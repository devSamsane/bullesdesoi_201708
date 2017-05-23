// Déclaration des libraires NODEJS
const fs = require('fs');

// Déclaration des libraires
const _ = require('lodash');
const chalk = require('chalk');
const winston = require('winston');

// Déclaration des fichiers de configuration
const config = require('../config');

// Définition des formats valides acceptées par le middleware
const validFormat = ['combined', 'common', 'dev', 'short', 'tiny'];

// Instanciation 'transport console' du logger winston
const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      colorize: true,
      showLevel: true,
      handleExceptions: true,
      humanReadableUnhandledException: true
    })
  ],
  exitOnError: false
});

// Déclaration du stream, appel du logger winston
// Intégration avec le stream morgan pour tracer les requêtes http dans un fichier
logger.stream = {
  write: function (msg) {
    logger.info(msg)
  }
};

logger.setupFileLogger = function setupFileLogger() {
  let fileLoggerTransport = this.getLogOptions();
  if (!fileLoggerTransport) {
    return false;
  }
  try {
    // Vérification de l'accès au path et ensuite instanciation du fichier de log
    if (fs.openSync(fileLoggerTransport.filename, 'a+')) {
      logger.add(winston.transports.File, fileLoggerTransport);
    }
    return true;
  } catch (err) {
    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.red('Une erreur est survenue pendant la création du fichier de log'));
      console.log(chalk.red(err));
      console.log();
    }
    return false;
  }
};

/**
 * Configuration des options à utiliser avec winston
 * @name getLogOptions
 * @returns {Object} winston object, l'ensemble des options de winston
 */
logger.getLogOptions = function getLogOptions() {
  const _config = _.clone(config, true);
  const configFileLogger = _config.log.fileLogger;

  if (!_.has(_config, 'log.fileLogger.directoryPath') || !_.has(_config, 'log.fileLogger.filename')) {
    console.log('Impossible de trouver le fichier de configuration du logger');
    return false;
  }

  const logPath = configFileLogger.directoryPath + '/' + configFileLogger.fileName;
  return {
    level: 'debug',
    colorize: true,
    filename: logPath,
    timestamp: true,
    maxsize: configFileLogger.maxsize ? configFileLogger.maxsize : 10485760,
    maxFiles: configFileLogger.maxFiles ? configFileLogger.maxFiles : 2,
    json: (_.has(configFileLogger, 'json')) ? configFileLogger.json : false,
    eol: '\n',
    tailable: true,
    showLevel: true,
    handleExceptions: true,
    humanReadableUnhandledException: true
  };
};

logger.getMorganOptions = function getMorganOptions() {
  const format = config.log && config.log.format ? config.log.format.toString() : 'combined';

  // Validation du format de log
  if (!_.includes(validFormat, format)) {
    format = 'combined';
    if (process.env.NODE_ENV !== 'test') {
      console.log();
      console.log(chalk.yellow('Alerte: un format invalide est fourni. Le logger doit utiliser le format "' + format + '"'));
      console.log();
    }
  }
  return format;
};

// Initialisation du fichier de transport de log
logger.setupFileLogger();

// Déclaration et exports du module logger
module.exports = logger;
