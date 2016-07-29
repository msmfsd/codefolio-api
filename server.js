/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
/* eslint-disable no-console */
var express             = require('express');
var bodyParser          = require('body-parser');
var methodOverride      = require('method-override');
var multer              = require('multer');
var passport	          = require('passport');
var dotenv              = require('dotenv');
var cors                = require('cors');
var log                 = require('logging');
var logger              = require('logger-request');
var flash               = require('express-flash');
var expressValidator    = require('express-validator');
var compress            = require('compression');
var path                = require('path');
var db                  = require('./config/db');
var corsOptions         = require('./config/cors');
var admin               = require('./api/routes/admin');
var projects            = require('./api/routes/projects');
var profile             = require('./api/routes/profile');
var response            = require('./api/utils/response');
var Utils               = require('./api/utils');
var app                 = express();

/**
 * Settings / Database
 */
dotenv.load({ path: '.env' });
db.start();
app.set('title', 'Codefolio API');
app.set('port', 8090);
if(process.env.NODE_ENV === 'production') app.disable('x-powered-by');

/**
 * Middleware
 */
app.use(compress());
app.use(logger({ filename: './logs/server.log' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(methodOverride());
// only allow api calls from whitelisted sites
app.use(cors(corsOptions));
// allow whitelisted domains to load static assets from public uploads folder
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// configure passport authorization
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// init db
app.use(db.initDatabase);
// upload files
var uploadFilenames = [];
var uploadsDir = 'uploads/projects/';
if(process.env.NODE_ENV === 'production') {
  uploadsDir = process.env.SERVER_ROOT_PATH + uploadsDir;
}
var storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsDir); },
  filename: function (req, file, cb) {
    var name = Utils.formatFileName(file.originalname);
    uploadFilenames.push(name);
    cb(null, name);
  }
});
var upload = multer({ storage: storage });

/**
 * Routes
 */
app.get(['/', '/api'], function(req, res) { response(200, { success:true, message:'API' }, res); });
// admin routes
app.post('/api/admin/register', admin.register);
app.post('/api/admin/authenticate', admin.authenticate);
app.put('/api/admin', passport.authenticate('jwt', {session: false}), admin.updateSettings);
app.get('/api/admin/logout', passport.authenticate('jwt', {session: false}), admin.logout);
app.post('/api/admin/forgotpassword', admin.forgotPassword);
app.post('/api/admin/resetpassword/:token', admin.resetPassword);
// project routes
app.get('/api/projects', passport.authenticate('localapikey', { session: false }), projects.getProjects);
app.get('/api/project/:id', passport.authenticate('localapikey', { session: false }), projects.getProjectById);
app.post('/api/project', passport.authenticate('jwt', { session: false }), projects.createProject);
app.put('/api/project/:id', passport.authenticate('jwt', { session: false }), projects.updateProjectById);
app.delete('/api/project/:id', passport.authenticate('jwt', { session: false }), projects.deleteProjectById);
app.post('/api/project/upload', passport.authenticate('jwt', { session: false }), upload.array('media'), function(req, res){
  // TODO - pass uploadFilenames to middleware more elegantly
  var data = uploadFilenames;
  uploadFilenames = [];
  response(200, { success: true, message: 'Successful saved files.', data: data }, res);
});

// profile routes
app.get('/api/profile', passport.authenticate('localapikey', { session: false }), profile.getProfile);
app.put('/api/profile', passport.authenticate('jwt', { session: false }), profile.updateProfile);

/**
 * Route not found
 */
app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
});

/**
 * Error Handler
 */
app.use(function (err, req, res) {
  if (process.env.NODE_ENV === 'development') { log(err.status); }
  else { delete err.stack; }
  response(err.status || 500, { success:false, message:err }, res);
});

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
