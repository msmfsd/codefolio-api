/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var mongoose            = require('mongoose');
var dotenv              = require('dotenv');
var assert              = require('chai').assert;
var request             = require('supertest');
var server              = require('../server.js');
var Admin               = require('../api/models/admin');
var Project               = require('../api/models/project');
var Profile               = require('../api/models/profile');

// example vars
var secret              = process.env.SESSION_SECRET;
var apikey              = process.env.ADMIN_API_KEY;
var adminCredentials = {
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PW
};
var jwtToken = '';
var projectId = '576c6b92e015c64e941e89c6'; // ENSURE EXISTS
var deleteProjectId = '57674cafdd1417ad729df896'; // ENSURE EXISTS
var newProjectJSON = {
    role: "Frontend developer",
    description: "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<\/p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.<\/p>",
    client: "Some other client",
    active: 1,
    media: ["cool-project-api-01.png", "cool-project-api-02.png"],
    linkWeb: [ {"name": "awesomesite55.com", "url": "http://awesomesite.com"} ],
    repo: {
      repoUrl: "http://github.com/Automattic/mongoose",
      repoUser: "Automattic",
      repoName: "mongoose"
    },
    projectTech: ["PHP", "CSS3", "Express js", "React", "Javascript"],
    codeSnippet: {
      display: true,
      code: "TO DO PAST IN",
      language: "php"
    },
    viewOrder: 52,
    sticky: 0,
    dateModified: new Date(),
    dateCreated: new Date()
}

 /****************************************************\
 -------------- /ADMIN ROUTES
/******************************************************\

/**
 * API /api
 */
describe('GET /api', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/api')
      .expect(200, done);
  });
});

/**
 * API POST authenticate
 * Confirm a admin can login and receive a token back
 */
describe('POST /api/admin/authenticate is 200 OK & confirm that auth jwt-token is returned', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .post('/api/admin/authenticate')
      .send(adminCredentials)
      .expect(function(res){
        jwtToken = res.body.token;
      })
      .expect(200, done);
  });
});

/**
 * API POST authenticate
 * Confirm a admin can access admin settings route using a jwt-token
 */
describe('GET /api/admin with jwt-token', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .get('/api/admin')
      .set('Authorization', jwtToken)
      .expect(function(res){ res.body.success = true; })
      .expect(200, done);
  });
});

/****************************************************
-------------- /PROFILE ROUTES
***************************************************/

/**
 * API GET profile
 */
describe('GET /api/profile with apikey and return 200 OK', function() {
 it('should return 200 OK', function(done) {
   request(server)
     .get('/api/profile?apikey=' + apikey)
     .expect(200, done);
 });
});

/**
 * API PUT profile
 * Update profile settings
 */
describe('PUT /api/profile with jwt-token & update profile', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .put('/api/profile')
      .set('Authorization', jwtToken)
      .send({
        name: 'Steve Wozniak woo hooo',
        avatar: {
          useDefault: false
        }
      })
      .expect(function(res){ res.body.success = true; })
      .expect(200, done);
  });
});


/****************************************************
-------------- /PROJECT ROUTES
***************************************************/

/**
 * API GET projects
 */
describe('GET /api/projects with apikey and return 200 OK', function() {
 it('should return 200 OK', function(done) {
   request(server)
     .get('/api/projects?apikey=' + apikey)
     .expect(200, done);
 });
});

/**
 * API GET project by ID
 */
describe('GET /api/project/:id with apikey', function() {
 it('should return 200 OK', function(done) {
   request(server)
     .get('/api/project/' + projectId + '?apikey=' + apikey)
     .expect(200, done);
 });
});

/**
 * API POST create new project
 */
describe('POST /api/project with jwt-token & create new project', function() {
  // create unique slug
  newProjectJSON.name = 'Dummy Project' + Math.floor((Math.random() * 6420) + 1);
  newProjectJSON.slug = newProjectJSON.name.trim().toLowerCase().replace(' ', '-');
  it('should return 200 OK', function(done) {
    request(server)
      .post('/api/project')
      .set('Authorization', jwtToken)
      .send(newProjectJSON)
      .expect(function(res){ res.body.success = true; })
      .expect(200, done);
  });
});

/**
 * API PUT update a project
 */
describe('PUT /api/project/:id with jwt-token & update project', function() {
  it('should return 200 OK', function(done) {
    request(server)
      .put('/api/project/' + projectId)
      .set({ 'Authorization': jwtToken })
      .send({ client: 'New client name added by mocha test' })
      .expect(function(res){ res.body.success = true; })
      .expect(200, done);
  });
});

/**
 * API DELETE remove a project
 */
/*describe('DELETE /api/project/:id with jwt-token & remove project', function() {

  // TODO get last project added so this wont fail after 1 test..
  //var lastProjectId = Project.findOne({ active: 1 });
  //var id = new mongoose.Types.ObjectId(lastProjectId._id);
  var id = deleteProjectId; // ENSURE ID EXISTS FOR DELETE

  it('should return 200 OK', function(done) {
    request(server)
      .delete('/api/project/' + id)
      .set({ 'Authorization': jwtToken })
      .expect(function(res){ res.body.success = true; })
      .expect(200, done);
  });
});*/

/****************************************************
-------------- /ERROR ROUTES
***************************************************/
/**
 * 404 error
 * Commented out as it causes console to full throw error stack
 * Uncomment if you need to test 404 errors
 */
/*describe('404 error should be thrown', function() {
  it('should return 404', function(done) {
    request(server)
      .get('/api/some404route/')
      .expect(404, done);
  });
});*/
