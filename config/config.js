// Déclaration des librairies nodeJS
const path = require('path');
const fs = require('fs');

// Déclaration des librairies
const glob = require('glob');
const _ = require('lodash');
const chalk = require('chalk');

// Déclaration des fichiers de configuration

/**
 * Function globbing des fichiers
 * @name getGlobbedPaths
 * @param globPatterns
 * @param excludes
 * @returns {Array}
 */
const getGlobbedPaths = function(globPatterns, excludes) {
  // Définition du regex path
  const urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  // Définition de l'array de sortie
  let output = [];

  // Si glob pattern est un [] alors on passe chaque pattern de façon recursive, sinon on utilise glob
  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      let files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (let i in excludes) {
              if (excludes.hasOwnProperty(i)) {
                file = file.replace(excludes[i], '');
              }
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }
  return output;
};

/**
 * Validation de la variable d'environnement NODE_ENV
 * @name validateEnvironmentVariable
 */
const validateEnvironmentVariable = function() {

  // Vérification de la présence de fichiers de configuration d'environnement
  const environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.error(chalk.red('Erreur: Aucun fichier de configuration n\'a été' +
        ' trouvé pour l\'environnement "' + process.env.NODE_ENV + '". Utilisation par défaut de env: development'));
    } else {
      console.error(chalk.red('Erreur: NODE_ENV n\'est pas définie. Utilisation par défaut de env: development'));
    }
    process.env.NODE_ENV = 'development';
  }
};

/**
 * Validation du nom de domaine
 * @name validateDomainIsSet
 * @param config
 */
const validateDomainIsSet = function (config) {
  if (!config.domain) {
    console.log(chalk.red('Alerte: config.domain n\'est pas défini'))
  }
};

/**
 * Vérification que le jwt n'est pas celui par défaut
 * @name validateSecretJwt
 * @param {object} config
 * @param {object} testing
 */
const validateSecretJwt = function (config, testing) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  if (config.secretJwt === 'secret') {
    if (!testing) {
      console.log(chalk.red('Alerte: le secret JWT doit être modifié pour la production'));
      console.log();
    }
    return false;
  } else {
    return true;
  }
}

/**
 * Déclaration des folders de la configuration server
 * @name initGlobalConfigFolders
 * @param config
 * @param assets
 */
const initGlobalConfigFolders = function(config, assets) {
  config.folders = {
    server: {},
    client: {}
  };

  // Configurations des folders client
  config.folders.client = getGlobbedPaths(path.join(process.cwd(), '/dist'), process.cwd().replace(new RegExp(/\\/g), '/'));
};

/**
 * Déclaration des folders de la configuration server
 * @name initGlobalConfigFolders
 * @param config
 * @param assets
 */
const initGlobalConfigFiles = function(config, assets) {
  config.files = {
    server: {},
    client: {}
  };

  // Déclaration des models mongoose
  config.files.server.models = getGlobbedPaths(assets.server.models);

  // Déclaration des routes
  config.files.server.routes = getGlobbedPaths(assets.server.routes);

  // Déclaration des fichiers de configuration server
  config.files.server.configs = getGlobbedPaths(assets.server.config);

  // Déclaration des fichiers de configuration des policies
  config.files.server.policies = getGlobbedPaths(assets.server.policies);

  // Déclaration des fichiers js client (compilation webpack)
  // config.files.client.js = getGlobbedPaths(assets.client.lib.js);


  // Déclaration des fichiers de styles css
  // désactivation pour le moment car le front n'est pas encore la
  // TODO: Réactiver une fois le front en place
  // config.files.client.css = getGlobbedPaths(assets.client.lib.css,
  // 'dist/css').concat(getGlobbedPaths(assets.client.css, ['dist/css']));

  // Déclaration des fichiers de test front
  // TODO: Réactiver quand le front sera en place
  // config.files.client.tests = getGlobbedPaths(assets.client.tests);
};

/**
 * Initialisation de la configuration server
 * @name initGlobalConfig
 * @returns {*} config, objet portant l'ensemble des paramètres de
 * configuration du serveur
 */
const initGlobalConfig = function () {

  // Vérification et initialisation des variables d'environnement
  validateEnvironmentVariable();

  // Initialisation des assets par default
  const defaultAssets = require(path.join(process.cwd(), 'config/assets/default'));

  // Initialisation des assets selon NODE_ENV
  const environmentAssets = require(path.join(process.cwd(), 'config/assets', process.env.NODE_ENV)) || {};

  // Merge des assets
  const assets = _.merge(defaultAssets, environmentAssets);

  // Initialisation de la configuration server par default
  const defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

  // Initialisation de la configuration server selon NODE_ENV
  const environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge des fichiers de configuration
  const config = _.merge(defaultConfig, environmentConfig);

  // Récupération des informations de 'package.json'
  const pkg = require(path.resolve('./package.json'));
  config.bullesdesoi = pkg;

  // Initialisation des fichiers server
  initGlobalConfigFiles(config, assets);

  // Initialisation des folders server
  initGlobalConfigFolders(config, assets);

  // Validation du secret JWT
  validateSecretJwt(config);

  // Validation du domain
  validateDomainIsSet(config);

  // Déclaration de la configuration
  config.utils = {
    getGlobbedPaths: getGlobbedPaths,
    validateSecretJwt: validateSecretJwt
  };
  return config;
};

// Export de la configuration
module.exports = initGlobalConfig();
