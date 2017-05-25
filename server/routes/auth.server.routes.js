// Déclaration des librairies
const express = require('express');

// Déclaration des fichiers de configuration
const users = require('../controllers/users.server.controller');

const router = express.Router();

module.exports = function (router) {
  // Route signup
  router.route('/api/auth/signup').post(users.signup);
};
