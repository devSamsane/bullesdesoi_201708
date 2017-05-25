// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const express = require('express');

// Déclaration des fichiers de configuration
const renderIndex = require(path.resolve('./server/controllers/core.server.controller'));

const router = express.Router();

module.exports = function (router) {
  // router.route('*').get(function (req, res, next) {
    // Spécification de l'extension .html pour ne pas générer d'erreur
    // res.render attend la définition d'un view engine
    // res.sendFile(path.resolve('./dist/index.html'));
  // });
  router.route('*').get(renderIndex.renderIndexHTML);
};
