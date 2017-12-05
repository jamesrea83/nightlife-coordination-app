var passport = require('passport')
  , GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/User');


var dbConfig = require("./dbLogin")
var clientID = process.env.CLIENTID;
var clientSecret = process.env.CLIENTSECRET;
var callbackURL = process.env.CALLBACKURL;



passport.use(new GitHubStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({userid: profile.id}, {name: profile.displayName,userid: profile.id}, function (err, user) {
      return done(err, user);
    });
  }
));

module.exports = passport;