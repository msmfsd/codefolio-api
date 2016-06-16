/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var whitelist = ['http://dev.dev', 'http://localhost:3000'];

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
