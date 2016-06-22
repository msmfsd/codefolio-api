/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */

 /**
  * Format http status & JSON response
  *
  * @param status : Int
  * @param json : Object
  * @param res : Response Object
  * @return {}
  */
module.exports = function (status, json, res) {
  // 200 - success
  // 401 - Unauthorized
  // 403 - Forbidden
  // 404 - Not found
  // 500 - Internal Server Error
  res.status(status || 500).json(json);
};
