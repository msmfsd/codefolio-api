/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var _                   = require('lodash');
var _this               = this;

/**
 * Get token from headers
 *
 * @param headers : Object
 * @return {String}
 */
module.exports.getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) { return parted[1]; }
    else { return null; }
  } else { return null; }
};

/**
 * toDot
 * transforms object to dot notation
 * modified from //github.com/elementary/houston/blob/master/src/lib/helpers/dotNotation.js
 * by github.com/btkostner
 * @param {Object} obj - object to transform
 * @param {String} div - sperator for iteration, usually '.'
 * @param {String} pre - prefix to attach to all dot notation strings
 * @returns {Object} - dot notation
 */
module.exports.toDot = function (obj, div, pre) {
  if (typeof obj !== 'object') {
    throw new Error('toDot requires a valid object');
  }

  if (pre != null) {
    pre = pre + div;
  } else {
    pre = '';
  }

  var iteration = {};

  Object.keys(obj).forEach(function(key) {
    if (_.isPlainObject(obj[key])) {
      Object.assign(iteration, _this.toDot(obj[key], div, pre + key));
    } else {
      iteration[pre + key] = obj[key];
    }
  });

  return iteration;
};

/**
 * toObj
 * transforms dot notation to expanded form
 * modified from //github.com/elementary/houston/blob/master/src/lib/helpers/dotNotation.js
 * by github.com/btkostner
 * @param {Object} dot - dot form object to transform
 * @param {String} div - seperator for iteration, usually '.'
 * @returns {Object} - expanded form object
 */
module.exports.toObj = function (dot, div) {
  var iteration = {};
  var uniterated = {};

  Object.keys(dot).forEach(function(key) {
    if (key.indexOf(div) === -1) {
      iteration[key] = dot[key];
    } else {
      var keyArray = key.split(div);

      if (uniterated[keyArray[0]] == null) {
        uniterated[keyArray[0]] = {};
      }

      uniterated[keyArray[0]][keyArray.splice(1).join(div)] = dot[key];
    }
  });

  Object.keys(uniterated).forEach(function(key) {
    iteration[key] = _this.toObj(uniterated[key], div);
  });

  return iteration;
};
