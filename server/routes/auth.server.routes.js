// Déclaration des librairies
const express = require('express');

// Déclaration des fichiers de configuration
// const users = require('../controllers/users.server.controller');

const router = express.Router();

module.exports = function (app) {
  // Route signup
  router.route('api/auth/signup').get(function (req, res) {
    res.send('api/auth/signup');
  });
};
