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
    if (admin) { return response(500, { success: false, message: 'Admin already created with email: ' + admin.email }, res); }
    // server side validation
    req.assert('email', 'Email field is empty.').notEmpty();
    req.assert('email', 'Email is not valid.').isEmail();
    req.assert('password', 'Password must be between 6 and 14 characters.').len(6, 14);
    req.sanitize('email').normalizeEmail();
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
      email: req.body.email,
      password: req.body.password,
      passwordResetToken: '',
      passwordResetExpires: null,
      apikey: process.env.API_KEY,
      lastLoggedIn: new Date(),
      loggedOut: true
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
  // find admin by email address
  Admin.findOne({ email: req.body.email }, function(err, admin) {
    if (err) throw err;
    // if no admin found respond error
    if (!admin) { return response(403, { success: false, message: 'Authentication failed. Admin ' + req.body.email + ' not found.' }, res); }
    // run the compare password method
    admin.comparePassword(req.body.password, function(err, isMatch) {
      if (isMatch && !err) {
        // create token
        var token = jwt.encode(admin, process.env.SESSION_SECRET);
        // update admin lastLoggedIn field
        admin.lastLoggedIn = new Date();
        // set loggedOut to false
        admin.loggedOut = false;
        // save to db & send response
        admin.save(function(err) {
          if (err) { response(500, { success: false, message: 'lastLoggedIn or loggedOut not set' }, res); }
          else { response(200, {
            success: true,
            message: 'Admin authenticated!',
            username: admin.email,
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
    Admin.findOne({ email: decoded.email }, function(err, admin) {
      if (err) throw err;
      // if no admin found respond error
      if (!admin) { return response(403, { success: false, message: 'Update failed. Admin not found.' }, res); }
      // logged out or login expired?
      var lastLogin = admin.lastLoggedIn;
      // if has admin logged out or if login has expired..
      if(admin.loggedOut) { return response(500, { success: false, message: 'Admin is currently logged out.' }, res); }
      else if(admin.loginExpired(lastLogin)) {
        // set loggedOut to true
        admin.loggedOut = true;
        // save to db & send response
        admin.save(function(err) {
          if (err) { response(500, { success: false, message: 'Database save error.' }, res); }
          else { response(403, { success: false, message: 'Login expired, admin logged out.' }, res); }
        });
      }
      else {
        // update new password
        admin.password = req.body.password;
        // set loggedOut to true for security
        admin.loggedOut = true;
        // save to db & send response
        admin.save(function(err) {
          if (err) { return response(500, { success: false, message: 'Database save error.' }, res); }
          response(200, { success: true, message: 'Admin password updated. You have been logged out.' }, res);
        });
      }
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
    Admin.findOne({ email: decoded.email }, function(err, admin) {
      if (err) throw err;
      // if no admin found respond error
      if (!admin) { return response(403, { success: false, message: 'Logout failed. Admin not found.' }, res); }
      // already logged out?
      if(admin.loggedOut) { return response(403, { success: false, message: 'Logout failed. Admin was already logged out.' }, res); }
      // set loggedOut to true
      admin.loggedOut = true;
      // save to db & send response
      admin.save(function(err) {
        if (err) { return response(500, { success: false, message: 'Database save error.' }, res); }
        response(200, { success: true, message: 'Admin loggedOut: ' + admin.loggedOut }, res);
      });
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
  req.assert('email', 'Email field is empty.').notEmpty();
  req.assert('email', 'Email is not valid.').isEmail();
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
      // find admin by email address
      Admin.findOne({ email: req.body.email.toLowerCase() }, function(err, admin) {
        if (err) throw err;
        // if no admin found respond error
        if (!admin) { return response(403, { success: false, message: 'Admin ' + req.body.email + ' not found, please enter your registered admin email.' }, res); }
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
        to: admin.email,
        from: process.env.SERVER_SMTP_FROM_ADDRESS,
        subject: 'Reset your admin password on Codefolio',
        text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your Codefolio admin account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          req.body.reseturl + '/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        response(200, { success: true, message: 'A reset admin password link has been sent to: ' + admin.email }, res);
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
        to: admin.email,
        from: process.env.SERVER_SMTP_FROM_ADDRESS,
        subject: 'Your Codefolio admin password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your Codefolio admin account ' + admin.email + ' has just been changed.\n'
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
