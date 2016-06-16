/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */

/**
 * Get token from headers
 *
 * @param headers : Object
 * @return {String}
 */
exports.getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) { return parted[1]; }
    else { return null; }
  } else { return null; }
};
