/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var mongoose            = require('mongoose');
var dotenv              = require('dotenv');
var assert              = require('chai').assert;
var expect              = require('chai').expect;
var request             = require('supertest');
var server              = require('../server.js');
var Admin               = require('../api/models/admin');
var Project             = require('../api/models/project');
var Profile             = require('../api/models/profile');
var AdminRoutes         = require('../api/routes/admin');
var ProjectRoutes       = require('../api/routes/projects');
var ProfileRoutes       = require('../api/routes/profile');
var Utils               = require('../api/utils/index')

// example vars

 /****************************************************\
 -------------- /API CODE
/******************************************************\

/**
 * Utils.toDot
 */
describe('Utils.toDot transforms nested object to dot notation', function() {
  it('should return a string of the second part of the auth string', function(done) {
    var result = Utils.getToken({ authorization: 'JWT zI1NiJ9.eyJfaWQi' });
    expect(result).to.be.an('string');
    expect(result).to.eql('zI1NiJ9.eyJfaWQi');
    done();
  });
});

/**
 * Utils.toDot
 */
describe('Utils.toDot transforms nested object to dot notation', function() {
  it('should return a object with dot notation', function(done) {
    var obj = { avatar: { default: true }};
    var dotNotation = Utils.toDot(obj, '.');
    expect(dotNotation).to.be.an('object');
    expect(dotNotation).to.eql({ 'avatar.default': true });
    done();
  });
});

/**
 * Utils.toObj
 */
describe('Utils.toObj transforms dot notation to nested object', function() {
  it('should return an object with a nested object', function(done) {
    var dotObj = { 'avatar.default': true };
    var obj = Utils.toObj(dotObj, '.');
    expect(obj).to.be.an('object');
    expect(obj).to.eql({ avatar: { default: true }});
    done();
  });
});
