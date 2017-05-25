// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const express = require('express');

const router = express.Router();

module.exports = function (router) {
  router.route('*').get(function (req, res, next) {
    // Spécification de l'extension .html pour ne pas générer d'erreur
    // res.render attend la définition d'un view engine
    res.sendFile(path.resolve('./dist/index.html'));
  });
};
