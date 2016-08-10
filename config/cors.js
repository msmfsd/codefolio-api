/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var devUrl = process.env.FRONTEND_DEV_URL;
var prodUrl = process.env.FRONTEND_PROD_URL;
var whitelist = [devUrl, prodUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'];

module.exports = {

  /**
   * Set Cors whitelisted domains
   *
   * @param origin : Array
   * @param callback : Function
   * @return {String}
   */
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }

};
