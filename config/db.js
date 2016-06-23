/*!
 * Codefolio API
 * Copyright(c) 2016 MSMFSD
 * MIT Licensed
 */
/* eslint-disable no-console */
var mongoose            = require('mongoose');
var response            = require('../api/utils/response');
var Profile             = require('../api/models/profile');

/**
 * Start mongo db
 *
 * @return {}
 */
module.exports.start = function () {

  mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
  mongoose.connection.on('error', function(err) {
    console.log('MongoDB Connection Error. Ensure MongoDB is running.');
    console.log(err);
    process.exit(1);
  });

};

/**
 * Init DB with default profile
 * @param req
 * @param res
 * @param next
 */
module.exports.initDatabase = function(req, res, next) {
  // profile exists?
  Profile.findOne({ activeProfile: true }, function(err, profile) {
    if (err) throw err;
    // if no profile found create default profile w dummy data
    if (!profile) {
      // create default profile
      var defaultProfile = new Profile({
        activeProfile: true,
        name: 'Steve Wozniak',
        description: 'Apple developer',
        bio: '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<\/p><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.<\/p>',
        location: [
          {name: 'Silicon Valley, California', url: 'https://goo.gl/maps/yA6gDxKgoTU2'}
        ],
        contacts: [
          {name: '@swozniak_apple', url: 'http://twitter.com/swozniak_apple'},
          {name: '@my_gitter_handle', url: 'http://gitter.im/my_gitter_handle'},
          {name: 'swozniak@email.com', url: 'mailto:swozniak@email.com'}
        ],
        links: [
          {name: 'github.com/swoz', url: 'http://github.com/swoz'},
          {name: 'blogger.woz-blog.com', url: 'http://blogger.woz-blog.com'}
        ],
        techIcons: [
          {name: 'Rails', icon: 'rails-plain'},
          {name: 'Javascript', icon: 'javascript-plain'},
          {name: 'Git', icon: 'git-plain'},
          {name: 'Bootstrap', icon: 'bootstrap-plain'},
          {name: 'Symfony', icon: 'symfony-original'},
          {name: 'PHP', icon: 'php-plain'},
          {name: 'Nodejs', icon: 'nodejs-plain'}
        ],
        avatar: {
          use: 'custom',
          grvatarEmail: '',
          customAvatar: 'avatar.jpg',
          defaultAvatar: 'data:image/png;base64,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'
        },
        layout: {
          theme: 'dark',
          displayBgImage: true,
          bgImageURL: 'background-image.jpg'
        },
        dateModified: new Date(),
        dateCreated: new Date()
      });
      defaultProfile.save(function(err) {
        // send response
        if (err) { response(500, {success: false, message: 'Profile not saved to Database.'}, res); }
        else { next(); }
      });
    }
    else { next(); }
  });
};
