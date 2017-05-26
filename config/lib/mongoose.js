// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const chalk = require('chalk');

// Déclaration des fichiers de configuration
const config = require('../config');

/**
 * Déclaration et export du module de chargement des models
 * @name loadModels
 * @param callback
 */
module.exports.loadModels = function (callback) {
  // Regroupement de tous les fichiers models
  config.files.server.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });
  if (callback) {
    callback();
  }
};

/**
 * Déclaration et exports du module de connexion à la bd
 * @name connect
 * @param callback
 */
module.exports.connect = function (callback) {

  // Utilisation des Promises natives de nodeJS
  mongoose.Promise = config.db.promise;

  // Utilisation des messages d'erreurs mongoose
  mongoose.Error.messages = config.db.msg;

  // Initialisation de la connexion à la db
  const db = mongoose.connect(config.db.uri, config.db.options, function (err) {
    if (err) {
      console.error(chalk.red('Connexion à la base de donnée ' + config.db.uri + ' impossible'));
      console.log(err);
    } else {
      // Activation du mode 'debug' si nécessaire
      mongoose.set('debug', config.db.debug);
      if (callback) {
        callback(db);
      }
    }
  });
};

/**
 * Déclaration du module de déconnexion à la db
 * @name disconnect
 * @param callback
 */
module.exports.disconnect = function (callback) {
  mongoose.disconnect(function (err) {
    console.info(chalk.yellow('La déconnexion à ' + config.db.uri + ' s\'est bien déroulée'));
    callback(err);
  });
};
