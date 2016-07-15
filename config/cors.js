/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var whitelist = ['http://codefolio-static.dev', 'http://localhost:3000', 'http://127.0.0.1:3000'];

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
