// Déclaration des librairies NODEJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Déclaration des fichiers de configuration
let User = require(path.resolve('./server/models/user.server.model'));

// Initialisation du model User
User = mongoose.model('User');

module.exports = function () {
  passport.use(new LocalStrategy({
    // Mapping des champs passport versus les champs du model User
    usernameField: 'email',
    passwordField: 'password'
  }, function (email, password, done) {
    User.findOne({ email: email.toLowerCase() }, function (err, user) {
      if (err) {
        return done(err);
      } else if (!user || !user.authenticate(password)) {
        return done(null, false, {
          message: 'Login et/ou mot de passe invalides'
        });
      } else {
        return done(null, user)
      }
    });
  }));
};
