/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
 var response            = require('../utils/response');
 var Project            = require('../models/project');
 var Utils               = require('../utils');

/**
  * Get all projects
  *
  *  route: /api/projects
  *  @request GET
  *  @api private {apikey}
  */
module.exports.getProjects = function(req, res) {
  Project.find({active: 1}).sort({ sticky: -1, viewOrder: 1, dateCreated: -1 }).exec(function(err, projects) {
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
  req.assert('role', 'Role field is empty.').notEmpty();
  req.assert('slug', 'Slug field is empty.').notEmpty();
  req.assert('client', 'Client field is empty.').notEmpty();
  req.assert('active', 'Active field is empty.').notEmpty();
  req.assert('sticky', 'Sticky field is empty.').notEmpty();
  var errors = req.validationErrors();
  if (errors) {
    var allErrors = '';
    errors.map(function(item) {
      allErrors += item.msg + ' ';
    });
    return response(500, { success:false, message: allErrors }, res);
  }
  // create new project
  var newProject = new Project({
    name: req.body.name,
    role: req.body.role,
    slug: req.body.slug,
    description: req.body.description,
    client: req.body.client,
    active: req.body.active,
    media: req.body.media,
    linkWeb: req.body.linkWeb,
    repo: {
      display: req.body.repo.display,
      repoUrl: req.body.repo.repoUrl,
      repoUser: req.body.repo.repoUser,
      repoName: req.body.repo.repoName
    },
    projectTech: req.body.projectTech,
    codeSnippet: {
      display: req.body.codeSnippet.display,
      code: req.body.codeSnippet.code
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
  // add modified date
  req.body.dateModified = new Date();
  // convert to dot notation so objects retain other values
  var dotData = Utils.toDot(req.body, '.');
  Project.findOneAndUpdate({ _id: id }, dotData, function(err, project) {
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
