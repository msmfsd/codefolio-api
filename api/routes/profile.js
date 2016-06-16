/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
 var response            = require('../utils/response');
 var Profile             = require('../models/profile');

/**
 * View Profile
 *
 *  route: /api/profile
 *  @request GET
 *  @api private {apikey}
 */
module.exports.getProfile = function(req, res) {
  Profile.findOne({ activeProfile: true }, function(err, profile) {
    if (err) throw err;
    // if no profile found respond error
    if (!profile) { return response(403, { success: false, message: 'Default profile not found.' }, res); }
    response(200, { success:true, message: "Profile found.", data: profile }, res);
  });
};

/**
 * Update Profile
 *
 *  route: /api/profile
 *  @request PUT
 *  @api private {jwt}
 */
module.exports.updateProfile = function(req, res) {
  var updateData = req.body;
  updateData.dateModified = new Date();
  Profile.findOneAndUpdate({ activeProfile: true }, updateData, function(err, profile) {
    if (err) throw err;
    // if no profile found respond error
    if (!profile) { return response(403, { success: false, message: 'Default profile not found.' }, res); }
    // response
    response(200, { success:true, message: "Profile updated." }, res);
  });
};
