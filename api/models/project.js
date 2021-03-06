/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;

/**
 * Project schema
 */
var ProjectSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  client: { type: String, required: true },
  active: { type: Number, required: true },
  media: { type: Array, required: false },
  linkWeb: { type: Array, required: false },
  repo: {
    display: { type: String, required: true },
    repoUrl: { type: String, required: false },
    repoUser: { type: String, required: false },
    repoName: { type: String, required: false }
  },
  projectTech: { type: Array, required: true },
  codeSnippet: {
    display: { type: String, required: true, default: false },
    code: { type: String, required: false }
  },
  viewOrder: { type: Number },
  sticky: { type: Number, required: true },
  dateModified: { type: Date, required: true },
  dateCreated: { type: Date, required: true }
});

/**
 * Project schema before save
 *
 * @return {Function}
 */
ProjectSchema.pre('save', function (next) {
  next();
});

/**
 * Module exports
 */
module.exports = mongoose.model('Project', ProjectSchema);
