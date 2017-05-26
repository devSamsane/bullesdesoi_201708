// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const express = require('express');
const morgan = require('morgan');
const chalk = require('chalk');
const _ = require('lodash');
const compress = require('compression');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

// Déclaration des fichiers de configuration
const config = require('../config');
const logger = require('./logger');
const authorization = require('./authorization');

/**
 * Initialisation et export des variables utilisées par ExpressJS
 * @name initLocalVariables
 * @param app
 */
module.exports.initLocalVariables = function(app) {
  // Déclaration des variables de l'application express
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;
  app.locals.keywords = config.app.keywords;
  app.locals.logo = config.logo;
  app.locals.favicon = config.favicon;
  app.locals.env = process.env.NODE_ENV;
  app.locals.domain = config.domain;

  // Interception du host et de l'url et passage à des variables locales
  app.use(function(req, res, next) {
    res.locals.host = req.protocol + '://' + req.hostname;
    res.locals.url = req.protocol + '://' + req.headers.host + req.originalUrl;
    next();
  });
};

/**
 * Initialisation et export du module middleware
 * Active l'ensemble des middlewares déclarés pour app
 * @name initMiddleware
 * @param app
 */
module.exports.initMiddleware = function(app) {
  // Middleware: Compression
  app.use(compress({
    filter: function(req, res) {
      return (/json|text|javascript|css|font|svg/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  // Middleware: Initialisation favicon
  // TODO: A réactiver dès que le favicon est mis à la bonne place
  // app.use(favicon(app.locals.favicon));

  // Middleware: Initialisation du logger
  // Activé uniquement si log-format est déclaré dans config
  if (_.has(config, 'log-format')) {
    app.use(morgan(logger.getLogFormat(), logger.getMorganOptions()));
  }

  // Middleware: Cache
  // Si NODE_ENV = development, désactivation du cache
  if (process.env.NODE_ENV === 'development') {
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    app.locals.cache = 'memory';
  }

  // Middleware: Initialisation body-parser
  // Configuration body-parser parser application/json
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // Middleware: Initialisation cookie-parser
  app.use(cookieParser());

  // Middleware: Initialisation de l'autorisation Third-Party
  app.use(authorization.authorize);

  // Middleware: Initialisation du répertoire statique
  app.use(express.static(path.resolve('./dist')));

};

/**
 * Initialisation et export du module 'view engine'
 * @name initViewEngine
 * @param app
 */
module.exports.initViewEngine = function(app) {
  app.get('/', function (req, res) {
    res.sendFile(path.resolve('./dist/index.html)'));
  });
};

/**
 * Initialisation et export des modules de configuration server
 * @name initModulesConfiguration
 * @param app
 * @param db
 */
module.exports.initModulesConfiguration = function(app, db) {
  config.files.server.configs.forEach(function(configPath) {
    require(path.resolve(configPath))(app, db);
  });
};

/**
 * Initialisation et export du module helmet
 * @name initHelmetHeaders
 * @param app
 */
module.exports.initHelmetHeaders = function (app) {
  const SIX_MONTHS = 15778476000;
  app.use(helmet.frameguard());
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());
  app.use(helmet.ieNoOpen());
  app.use(helmet.hsts({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true
  }));
  app.disable('x-powered-by');
};

/**
 * Initialisation et export de la configuration des routes server
 * @name initModulesServerRoutes
 * @param app
 */
module.exports.initModulesServerRoutes = function(app) {
  config.files.server.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};

/**
 * Initialisation et export du module error-handler
 * Renvoi de toutes les erreurs vers index.hbs
 * Permet à angular de prendre le relais et de ne pas afficher d'erreur server
 * @name intiErrorRoutes
 * @param app
 */
module.exports.initErrorRoutes = function (app) {
  app.use(function(err, req, res, next) {
    if (!err) {
      return next();
    }
    // TODO: Retirer la console quand le développement sera terminé
    console.error(err.stack);
    return res.sendFile(path.resolve('./dist/index.html'));
  });
};

/**
 * Export module 'app', création de l'application Express
 * @name init
 * @returns {*} app express
 */
module.exports.init = function(db) {
  const app = express();

  // Initialisation des variables ExpressJS app.locals
  this.initLocalVariables(app);

  // Initialisation des middlewares
  this.initMiddleware(app);

  // Initialisation du view engine
  this.initViewEngine(app);

  // Initialisation de helmet
  this.initHelmetHeaders(app);

  // Initialisation des modules de configuration
  this.initModulesConfiguration(app);

  // Initialisation des routes server
  this.initModulesServerRoutes(app);

  // Initialisation des routes error
  this.initErrorRoutes(app);

  return app;
};







