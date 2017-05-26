// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const passport = require('passport');
const mongoose = require('mongoose');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Déclaration des fichiers de configuration
let User = require(path.resolve('./server/models/user.server.model'));
const config = require(path.resolve('./config/config'));

// Initialisation du model User
User = mongoose.model('User');

/**
 * Initialisation et export de la stratégie de configuration jwt
 * @param {Object} config
 */
module.exports = function (config) {
  const opts = {
    // Création de la liste d'extracteurs
    // L'ordre correspond à l'ordre de recherche du jwt
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeader(),
      ExtractJwt.fromUrlQueryParameter('token')
    ]),
    secretOrKey: config.jwt.secret
  };

  // Configuration de la stratégie passport
  passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.user }, function (err, user) {
      if (err) {
        return done(err, false, {
          message: 'Erreur interne'
        });
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: 'Login et/ou mot de passe invalide'
        });
      }
    });
  }));

};
