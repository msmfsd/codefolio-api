/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
var bcrypt              = require('bcryptjs');
var moment              = require('moment');

/**
 * Admin schema
 */
var AdminSchema = new Schema({
  activeAdmin: { type: Boolean, required: true, default: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  apikey: { type: String, required: true },
  loggedOut: { type: Boolean, required: true },
  lastLoggedIn: { type: Date, required: true }
});

/**
 * Admin schema before save
 *
 * @return {Function}
 */
AdminSchema.pre('save', function (next) {
  var admin = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) { return next(err); }
      bcrypt.hash(admin.password, salt, function (err, hash) {
        if (err) return next(err);
        admin.password = hash;
        next();
      });
    });
  }
  else { return next(); }
});

/**
 * Compare password
 *
 * @param passw : String
 * @param cb : Function
 * @return {Function}
*/
AdminSchema.methods.comparePassword = function (passw, cb) {
  bcrypt.compare(passw, this.password, function (err, isMatch) {
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};

/**
 * Login expired
 *
 * @param oldDate : Date
 * @return {Boolean}
 */
AdminSchema.methods.loginExpired = function(oldDate) {
  var now = new Date();
  var hours = moment(now).diff(oldDate, 'hours');
  if (hours < 48) { return false; }
  return true;
};

/**
 * Module exports
 */
module.exports = mongoose.model('Admin', AdminSchema);
