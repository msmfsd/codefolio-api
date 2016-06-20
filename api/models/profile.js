/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;

/**
 * Profile schema
 */
var ProfileSchema = new Schema({
  activeProfile: { type: Boolean, required: true, default: true },
  name: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  bio: { type: String, required: true, trim: true },
  location: { type: Array, required: true },
  contacts: { type: Array, required: true },
  links: { type: Array, required: true },
  techIcons: { type: Array, required: true },
  avatar: {
    useDefault: { type: Boolean, required: true },
    customAvatar: { type: String },
    defaultAvatar: { type: String, data: Buffer }
  },
  layout: {
    theme: { type: String, required: true },
    displayBgImage: { type: Boolean, required: true },
    bgImageURL: { type: String, required: false }
  },
  dateModified: { type: Date, required: true, default: Date.now },
  dateCreated: { type: Date, required: true }
});

/**
 * Profile schema before save
 *
 * @return {Function}
 */
ProfileSchema.pre('save', function (next) {
  next();
});

/**
 * Module exports
 */
module.exports = mongoose.model('Profile', ProfileSchema);
