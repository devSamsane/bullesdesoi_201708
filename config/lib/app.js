// Déclaration des librairies
const chalk = require('chalk');

// Déclaration des fichiers de configuration
const config = require('../config');
const mongooseConfig = require('./mongoose');
const express = require('./express');
const seed = require('./seed');

// Initialisation de le fonction seed
function seedDB() {
  if (config.seedDB && config.seedDB.seed) {
    console.log(chalk.bold.blue('Information: La fonction seed est active'));
    seed.start();
  }
};

// Chargement des models mongoose
mongooseConfig.loadModels(seedDB);

/**
 * Déclaration du module d'initialisation du démarrage de l'application
 * @param callback
 */
module.exports.init = function init(callback) {
  // Connexion à la base de donnée et initialisation de l'application express
  mongooseConfig.connect(function(db) {
    // Initialisation de l'application express
    const app = express.init(db);
    if (callback) {
      callback(app, db, config);
    }
  });
};

/**
 * Démarrage du server, passage de l'application express et de la config statique
 * @name start
 * @param callback
 */
exports.start = function start(callback) {
  let _this = this;

  _this.init(function(app, db, config) {

    // Démarrage de l'application server sur le port et host de la config
    app.listen(config.port, config.host, function() {
      const server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

      // Affichage des messages au lancement du serveur
      console.log('--');
      console.log(chalk.bgMagenta(config.app.title));
      console.log();
      console.log(chalk.green('Environnement: ' + process.env.NODE_ENV));
      console.log(chalk.green('Serveur: ' + server));
      console.log(chalk.green('MongoDB: ' + config.db.uri));
      console.log(chalk.green('Version de l\'application: ' + config.bullesdesoi.version));

      if (config.bullesdesoi['bullesdesoi-version']) {
        console.log(chalk.green('Bulles de Soi - version: ' + config.bullesdesoi['Bulles de Soi - version']));
      }

      if (callback) {
        callback(app, db, config);
      }

    });
  });
};

