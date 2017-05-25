// Déclaration des librairies
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const passport = require('passport');

// Déclaration des fichiers de configuration
const config = require('../config');

// Définition de l'objet 'auth'
const auth = {
  signToken: signToken,
  authorize: authorizeRequest
};

// Exportation de l'objet auth
module.exports = auth;

/**
 * Autorisation passport
 * @name authorizeRequest
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
function authorizeRequest(req, res, next) {
  // Appel de la stratégie d'autorisation passport
  passport.authenticate('jwt', { session: false }, function (err, user) {
    if (err) {
      return next(new Error(err));
    }
    if (user) {
      // Mémorisation des champs dans l'objet user
      req.user = user;
    }
    next();
  })(req, res, next);
};

/**
 * Signature du token
 * @name signToken
 * @param {object} user objet user récupéré au moment de l'authentification
 * @param {object} options objet options de configuration jwt
 * @returns {object} token token signé
 */
function signToken(user, options) {
  const payload = undefined;
  const token = undefined;
  const jwtOptions = undefined;

  // Vérification du user
  if (!user || !user._id) {
    return null;
  } else {
    options = options || {};
    payload = {
      user: user._id.toString()
    };
    jwtOptions = _.merge(config.jwt.options, options);
    token = jwt.sign(payload, config.jwt.secret, jwtOptions);

    return token;
  }
};
