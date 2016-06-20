/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
 var response            = require('../utils/response');
 var Project            = require('../models/project');

/**
  * Get all projects
  *
  *  route: /api/projects
  *  @request GET
  *  @api private {apikey}
  */
module.exports.getProjects = function(req, res) {
  Project.find().sort({ sticky: -1, viewOrder: 1, dateCreated: -1 }).exec(function(err, projects) {
    if (err) throw err;
    // at least 1 project?
    if (!projects || projects.length === 0) { return response(500, { success:false, message: 'There are no active projects.' }, res); }
    // response
    response(200, { success:true, message: 'Found ' + projects.length + ' projects.', data: projects }, res);
  });
};

/**
 * Project by ID
 *
 *  route: /api/project/:id
 *  @request GET
 *  @api private {apikey}
 */
module.exports.getProjectById = function(req, res) {
  var id = req.params.id.toString();
  Project.findById(id, function(err, project) {
    if (err) throw err;
    // at least 1 project?
    if (!project) { return response(500, { success:false, message: 'Project not found: ' + id }, res); }
    // response
    response(200, { success:true, message: 'Project found: ' + id, data: project }, res);
  });
};

/**
 * Create Project
 *
 *  route: /api/project
 *  @request POST
 *  @api private {jwt}
 */
module.exports.createProject = function(req, res) {
  // server side validation
  req.assert('name', 'Name field is empty.').notEmpty();
  req.assert('slug', 'Slug field is empty.').notEmpty();
  req.assert('client', 'Name field is empty.').notEmpty();
  req.assert('active', 'Name field is empty.').notEmpty();
  req.assert('sticky', 'Name field is empty.').notEmpty();
  var errors = req.validationErrors();
  if (errors) { return response(500, { success:false, message: errors }, res); }
  // create new admin admin
  var newProject = new Project({
    name: req.body.name,
    slug: req.body.slug,
    description: req.body.description,
    client: req.body.client,
    active: req.body.active,
    media: req.body.media,
    linkWeb: req.body.linkWeb,
    linkRepo: req.body.linkRepo,
    projectTech: req.body.projectTech,
    codeSnippet: {
      display: req.body.codeSnippet.display,
      code: req.body.codeSnippet.code,
      language: req.body.codeSnippet.language
    },
    viewOrder: req.body.viewOrder,
    sticky: req.body.sticky,
    dateModified: new Date(),
    dateCreated: new Date()
  });
  newProject.save(function(err) {
    // send response
    if (err) { response(500, { success: false, message: 'Project not created: ' + err }, res); }
    else { response(200, { success: true, message: 'Successful created Project.' }, res); }
  });
};

/**
 * Update Project
 *
 *  route: /api/project/:id
 *  @request PUT
 *  @api private {jwt}
 */
module.exports.updateProjectById = function(req, res) {
  var id = req.params.id.toString();
  var updateData = req.body;
  updateData.dateModified = new Date();
  Project.findOneAndUpdate({ _id: id }, updateData, function(err, project) {
    if (err) throw err;
    // if no profile found respond error
    if (!project) { return response(403, { success: false, message: 'Project not found: ' + id }, res); }
    // response
    response(200, { success:true, message: 'Project updated: ' + id }, res);
  });
};

/**
 * Delete Project
 *
 *  route: /api/project/:id
 *  @request DELETE
 *  @api private {jwt}
 */
module.exports.deleteProjectById = function(req, res) {
  var id = req.params.id.toString();
  Project.findOneAndRemove({ _id: id }, function(err, project) {
    if (err) throw err;
    // if no profile found respond error
    if (!project) { return response(403, { success: false, message: 'Project not found: ' + id }, res); }
    // response
    response(200, { success:true, message: 'Project deleted: ' + id }, res);
  });
};
