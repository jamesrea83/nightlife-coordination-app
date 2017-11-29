var passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/User');

/*
var dbConfig = require("./dbLogin")
var clientID = dbConfig.clientID || process.env.CLIENTID;
var clientSecret = dbConfig.clientSecret || process.env.CLIENTSECRET;
var callbackURL = dbConfig.callbackURL || process.env.CALLBACKURL;
*/


passport.use(new GitHubStrategy({
    clientID: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: process.env.CALLBACKURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({userid: profile.id}, {name: profile.displayName,userid: profile.id}, function (err, user) {
      return done(err, user);
    });
  }
));

module.exports = passport;