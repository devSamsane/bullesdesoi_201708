// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const express = require('express');

// Déclaration des fichiers de configuration
const users = require(path.resolve('./server/controllers/users.server.controller'));

const router = express.Router();

module.exports = function (router) {

  // Déclaration des api users
  // TODO: Regarder si on ne peut pas améliorer les urls des api
  router.route('/api/users/me').get(users.me);
  router.route('/api/users/me').patch(users.update);
  router.route('/api/users/me/seances').get(users.seances);
  router.route('/api/users/me/seances/:seanceId').get(users.seance);

  // Mise en place du lien avec le middleware user
  router.param('userId', users.userById);
};
