/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
var whitelist = [
  'http://52.65.106.196',
  'http://52.65.106.196:80',
  'http://52.65.106.196:8080',
  'http://ec2-52-65-106-196.ap-southeast-2.compute.amazonaws.com',
  'http://ec2-52-65-106-196.ap-southeast-2.compute.amazonaws.com:80',
  'http://ec2-52-65-106-196.ap-southeast-2.compute.amazonaws.com:8080', 
  'http://codefolio-static.dev',
  'http://localhost:3000',
  'http://127.0.0.1:3000'];

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
