// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const passport = require('passport');
const mongoose = require('mongoose');

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));
let User = require(path.resolve('./server/models/user.server.model'));

// Initialisation du model User
User = mongoose.model('User');

/**
 * Initialisation et exports des stratégies
 * @param {object} app
 * @param {obejct} bd
 */
module.exports = function (app, db) {
  config.utils.getGlobbedPaths(path.resolve('./server/config/strategies/*.js')).forEach(function (strategy) {
    require(path.resolve(strategy))(config);
  }),

  // Middleware: Initialisation passport
  app.use(passport.initialize());
};
