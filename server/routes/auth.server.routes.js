// Déclaration des librairies
const express = require('express');

// Déclaration des fichiers de configuration
const users = require('../controllers/users.server.controller');

const router = express.Router();

module.exports = function (router) {

  // Déclaration des api de l'authentification users
  router.route('/api/auth/signup').post(users.signup);
  router.route('/api/auth/signin').post(users.signin);
  router.route('/api/auth/signout').get(users.signout);
};
