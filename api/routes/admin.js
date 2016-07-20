/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var jwt 			          = require('jwt-simple');
var async               = require('async');
var crypto              = require('crypto');
var nodemailer          = require('nodemailer');
var Utils               = require('../utils');
var response            = require('../utils/response');
var Admin               = require('../models/admin');

/**
 * Module: Admin routes
 */

/**
 * Register administrator
 *
 *  route: /api/admin/registeradmin
 *  @request POST
 *  @api public
*/
module.exports.register = function(req, res) {
  Admin.findOne({ activeAdmin: true }, function(err, admin) {
    if (err) throw err;
    // Only 1 admin allowed
    if (admin) { return response(500, { success: false, message: 'Admin already created with username: ' + admin.username }, res); }
    // server side validation
    req.assert('username', 'Username field is empty.').notEmpty();
    req.assert('username', 'Username is not valid email.').isEmail();
    req.assert('password', 'Password must be between 6 and 14 characters.').len(6, 14);
    req.sanitize('username').normalizeEmail();
    var errors = req.validationErrors();
    if (errors) {
      var allErrors = '';
      errors.map(function(item) {
        allErrors += item.msg + ' ';
      });
      return response(500, { success:false, message: allErrors }, res);
    }
    // create new admin admin
    var newAdmin = new Admin({
      activeAdmin: true,
      username: req.body.username,
      password: req.body.password,
      passwordResetToken: '',
      passwordResetExpires: null,
      apikey: process.env.API_KEY,
      lastLoggedIn: new Date()
    });
    newAdmin.save(function(err) {
      // send response
      if (err) { response(500, { success: false, message: 'Admin not created: ' + err }, res); }
      else { response(200, { success: true, message: 'Successful created admin!' }, res); }
    });
  });
};

/**
 * Authenticate administrator
 *
 *  route: /api/admin/authenticate
 *  @request POST
 *  @api public
 */
module.exports.authenticate = function(req, res) {
  // find admin by username
  Admin.findOne({ username: req.body.username }, function(err, admin) {
    if (err) throw err;
    // if no admin found respond error
    if (!admin) { return response(403, { success: false, message: 'Authentication failed. Admin ' + req.body.username + ' not found.' }, res); }
    // run the compare password method
    admin.comparePassword(req.body.password, function(err, isMatch) {
      if (isMatch && !err) {
        // create token
        var token = jwt.encode(admin, process.env.SESSION_SECRET);
        // update admin lastLoggedIn field
        admin.lastLoggedIn = new Date();
        // save to db & send response
        admin.save(function(err) {
          if (err) { response(500, { success: false, message: 'lastLoggedIn not set on db' }, res); }
          else { response(200, {
            success: true,
            message: 'Admin authenticated!',
            username: admin.username,
            lastLoggedIn: admin.lastLoggedIn,
            token: 'JWT ' + token
          }, res); }
        });
      }
      else { response(401, { success: false, message: 'Authentication failed. Wrong password.' }, res); }
    });
  });
};

/**
 * Admin update password
 *
 *  route: /api/admin
 *  @request PUT
 *  @api private {jwt}
 */
module.exports.updateSettings = function(req, res) {
  var token = Utils.getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, process.env.SESSION_SECRET);
    // validate new password
    req.assert('password', 'Password must be between 6 and 14 characters.').len(6, 14);
    var errors = req.validationErrors();
    if (errors) {
      var allErrors = '';
      errors.map(function(item) {
        allErrors += item.msg + ' ';
      });
      return response(500, { success:false, message: allErrors }, res);
    }
    // update password
    // find admin
    Admin.findOne({ username: decoded.username }, function(err, admin) {
      if (err) throw err;
      // if no admin found respond error
      if (!admin) { return response(403, { success: false, message: 'Update failed. Admin not found.' }, res); }
      // update new password
      admin.password = req.body.password;
      // save to db & send response
      admin.save(function(err) {
        if (err) { return response(500, { success: false, message: 'Database save error.' }, res); }
        response(200, { success: true, message: 'Admin password updated.' }, res);
      });
    });
  }
  else { response(403, { success: false, message: 'No token provided.' }, res); }
};

/**
 * Logout administrator
 *
 *  route: /api/admin/logoutadmin
 *  @request GET
 *  @api private {jwt}
 */
module.exports.logout = function(req, res) {
  // passed jwt auth so get token
  var token = Utils.getToken(req.headers);
  if (token) {
    // decode admin details from token
    var decoded = jwt.decode(token, process.env.SESSION_SECRET);
    // find admin
    Admin.findOne({ username: decoded.username }, function(err, admin) {
      if (err) throw err;
      // if no admin found respond error
      if (!admin) { return response(403, { success: false, message: 'Logout failed. Admin not found.' }, res); }
      // logout success
      return response(200, { success: true, message: 'Admin logged out.' }, res);
    });
  }
  else { response(403, { success: false, message: 'No token provided.' }, res); }
};

/**
 * Admin forgot password
 *
 *  route: /api/admin/forgotpassword
 *  @request POST
 *  @api public
*/
module.exports.forgotPassword = function(req, res) {
  // server side validation
  req.assert('username', 'Username field is empty.').notEmpty();
  req.assert('username', 'Username is not a valid email.').isEmail();
  var errors = req.validationErrors();
  if (errors) {
    var allErrors = '';
    errors.map(function(item) {
      allErrors += item.msg + ' ';
    });
    return response(500, { success:false, message: allErrors }, res);
  }
  // cont.
  async.waterfall([
    function(done) {
      // create reset token
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      // find admin by username
      Admin.findOne({ username: req.body.username.toLowerCase() }, function(err, admin) {
        if (err) throw err;
        // if no admin found respond error
        if (!admin) { return response(403, { success: false, message: 'Admin ' + req.body.username + ' not found, please enter your registered admin username.' }, res); }
        // update db w token with expiry of 2h
        admin.passwordResetToken = token;
        admin.passwordResetExpires = Date.now() + 7200000; // 2 hours
        admin.save(function(err) {
          done(err, token, admin);
        });
      });
    },
    function(token, admin, done) {
      // email link with reset token as param to admin
      // set your email send details here
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        to: admin.username,
        from: process.env.SERVER_SMTP_FROM_ADDRESS,
        subject: 'Reset admin password link for your Codefolio website',
        text: 'You recently requested a password reset for your Codefolio admin account.\n\n' +
          'Please click on the following link, or paste this link into your browser to complete the process:\n\n' +
          req.body.reseturl + '/' + token + '\n\n' +
          'This link is valid for the next 24 hours. If you did not request this link, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        response(200, { success: true, message: 'A reset admin password link has been sent to: ' + admin.username }, res);
        done(err);
      });
    }
  ], function(err) {
    if (err) { return response(500, { success:false, message: err }, res); }
  });
};

/**
 * Admin reset password
 *
 *  route: /api/admin/resetpassword/:token
 *  @request POST
 *  @api public
*/
module.exports.resetPassword = function(req, res, next) {
  // validate new password
  req.assert('password', 'Password must be between 6 and 14 characters.').len(6, 14);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);
  var errors = req.validationErrors();
  if (errors) {
    var allErrors = '';
    errors.map(function(item) {
      allErrors += item.msg + ' ';
    });
    return response(500, { success:false, message: allErrors }, res);
  }
  // cont.
  async.waterfall([
    function(done) {
      // compare :token param with database and expiry
      Admin
        .findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, admin) {
          if (err) { return next(err); }
          if (!admin) { response(500, { success:false, message: 'Password reset token is invalid or has expired.' }, res); }
          else {
            // update db with new password
            admin.password = req.body.password;
            admin.passwordResetToken = '';
            admin.passwordResetExpires = null;
            admin.save(function(err) {
              if (err) { return next(err); }
              done(err, admin);
            });
          }
        });
    },
    function(admin, done) {
      var transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
      var mailOptions = {
        to: admin.username,
        from: process.env.SERVER_SMTP_FROM_ADDRESS,
        subject: 'Your Codefolio admin password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your Codefolio admin account ' + admin.username + ' has just been changed.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        response(200, { success: true, message: 'Success! Your password has been changed.' }, res);
        done(err);
      });
    }
  ], function(err) {
    if (err) { return response(500, { success:false, message: err }, res); }
  });
};
