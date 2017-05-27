// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const express = require('express');
const passport = require('passport');

// Déclaration des fichiers de configuration
const admin = require('../controllers/admin.server.controller');
const config = require(path.resolve('./config/config'));
const authorize = require(path.resolve('./config/lib/authorization'));

const router = express.Router();

module.exports = function (router) {

  // Passage des routes users en premiers pour eviter un accès non permis
  require('./users.server.routes');

  // Récupération de la liste de tous les utilisateurs
  router.route('/api/users/all').get(admin.listUsers);

  // Api(s) pour un utilisateur donné
  // Gestion du profil du user
  router.route('/api/user/:userId').get(admin.readUser);
  router.route('/api/user/:userId').patch(admin.updateUser);

  // Gestion des activités d'un user create ou update
  router.route('/api/user/seance/:userId').post(admin.addSeance);
  router.route('/api/user/seance/:userId').patch(admin.updateSeance);
  router.route('/api/user/sophronisation/:seanceId').post(admin.addSophronisation);
  router.route('/api/user/sophronisation/:sophronisationId').patch(admin.updateSophronisation);
  router.route('/api/user/relaxation/:seanceId').post(admin.addRelaxation);
  router.route('/api/user/relaxation/:relaxationId').patch(admin.updateRelaxation);

  // Api(s) de suppression
  router.route('/api/user/seance/:seanceId').delete(admin.deleteSeance);
  router.route('/api/user/sophronisation/:sophronisationId').delete(admin.deleteSophronisation);
  router.route('/api/user/relaxation/:relaxationId').delete(admin.deleteRelaxation);
  router.route('/api/user/:userId').delete(admin.deleteUser);

  // Mise en place du lien middleware
  router.param('userId', admin.userById);
  router.param('seanceId', admin.seanceById);
  router.param('sophronisationId', admin.sophronisationById);
  router.param('relaxationId', admin.relaxationById);
};
