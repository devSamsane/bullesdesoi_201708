// Déclaration des librairies
const chalk = require('chalk');

// Déclaration des fichiers de configuration
const config = require('../config');
const express = require('./express');

/**
 * Déclaration du module d'initialisation du démarrage de l'application
 * @param callback
 */
module.exports.init = function init(callback) {
  const app = express.init();

  if (callback) {
    callback(app, config);
  }
};

exports.start = function start(callback) {
  let _this = this;

  _this.init(function(app, config) {

    // Démarrage de l'application server sur le port et host de la config
    app.listen(config.port, config.host, function() {
      const server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.host + ':' + config.port;

      // Affichage des messages au lancement du serveur
      console.log('--');
      console.log(chalk.bgMagenta(config.app.title));
      console.log();
      console.log(chalk.green('Environnement: ' + process.env.NODE_ENV));
      console.log(chalk.green('Serveur: ' + server));
      // TODO: Réactiver la console à la mise en place de la config mongoose
      // console.log(chalk.green('Database: ' + config.db.uri));
      console.log(chalk.green('Version de l\'application: ' + config.bullesdesoi.version));

      if (config.bullesdesoi['bullesdesoi-version']) {
        console.log(chalk.green('Bulles de Soi - version: ' + config.bullesdesoi['Bulles de Soi - version']));
      }

      if (callback) {
        callback(app, config);
      }

    });
  });
};

