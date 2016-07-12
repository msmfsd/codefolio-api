/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var JwtStrategy         = require('passport-jwt').Strategy;
var LocalAPIKeyStrategy = require('passport-localapikey').Strategy;
var Admin               = require('../api/models/admin');

/**
 * Module exports
 */
module.exports = function(passport) {

  /**
   * JSON Web Token Strategy
   *
   * @return {Function}
   */
  passport.use(new JwtStrategy({ secretOrKey: process.env.SESSION_SECRET }, function(jwt_payload, done) {
    Admin.findOne({id: jwt_payload.id}, function(err, admin) {
      if (err) return done(err, false);
      if (admin) done(null, admin);
      else done(null, false);
      });
  }));

  /**
   * Apikey Strategy
   *
   * @return {Function}
   */
  passport.use(new LocalAPIKeyStrategy(function(apikey, done) {
    Admin.findOne({ apikey: apikey }, function (err, admin) {
      if (err) return done(err, false);
      if (!admin) return done(null, false);
      return done(null, admin);
    });
  }));

};
