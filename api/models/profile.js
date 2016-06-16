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
  location: {
    display: { type: Boolean, required: true },
    city: { type: String, required: true }
  },
  contacts: {
    display: { type: Boolean, required: true },
    feature: { type: String },
    email: { type: String },
    twitter: { type: String },
    gitter: { type: String },
    github: { type: String },
    custom: { type: String }
  },
  links: {
    display: { type: Boolean, required: true },
    feature: { type: String },
    github: { type: String },
    blog: { type: String },
    custom: { type: String }
  },
  avatar: {
    use: { type: String },
    avatarURL: { type: String },
    avatarBase64: { type: String, data: Buffer }
  },
  layout: {
    theme: { type: String, required: true },
    highlightColor: { type: String, required: true },
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
