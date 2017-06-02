// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const express = require('express');
const passport = require('passport');

// Déclaration des fichiers de configuration
const admin = require('../controllers/admin.server.controller');
const config = require(path.resolve('./config/config'));
const authorize = require(path.resolve('./config/lib/authorization'));
const adminPolicy = require(path.resolve('./server/policies/admin.server.policy'));

const router = express.Router();

module.exports = function (router) {

  // Passage des routes users en premiers pour eviter un accès non permis
  require('./users.server.routes');

  // Récupération de la liste de tous les utilisateurs
  router.route('/api/users/').get(adminPolicy.isAllowed, admin.listAllUsers);

  // Api(s) pour un utilisateur donné
  // Gestion du profil du user
  router.route('/api/users/').post(adminPolicy.isAllowed, admin.createUser);
  router.route('/api/users/:userId').get(adminPolicy.isAllowed, admin.readUser);
  router.route('/api/users/:userId').patch(adminPolicy.isAllowed, admin.updateUser);

  // Gestion des activités d'un user create ou update
  router.route('/api/users/:userId/seances/').post(adminPolicy.isAllowed, admin.addSeance);
  router.route('/api/users/:userId/seances/:seanceId').patch(adminPolicy.isAllowed, admin.updateSeance);
  router.route('/api/users/:userId/seances/:seanceId/sophronisations/').post(adminPolicy.isAllowed, admin.addSophronisation);
  router.route('/api/users/:userId/seances/:seanceId/sophronisations/:sophronisationId').patch(adminPolicy.isAllowed, admin.updateSophronisation);
  router.route('/api/users/:userId/seances/:seanceId/relaxations').post(adminPolicy.isAllowed, admin.addRelaxation);
  router.route('/api/users/:userId/seances/:seanceId/relaxations/:relaxationId').patch(adminPolicy.isAllowed, admin.updateRelaxation);

  // Api(s) de suppression
  router.route('/api/users/:userId/seances/:seanceId').delete(adminPolicy.isAllowed, admin.deleteSeance);
  router.route('/api/users/:userId/seances/:seanceId/sophronisations/:sophronisationId').delete(adminPolicy.isAllowed, admin.deleteSophronisation);
  router.route('/api/users/:userId/seances/:seanceId/relaxations/:relaxationId').delete(adminPolicy.isAllowed, admin.deleteRelaxation);
  router.route('/api/users/:userId').delete(adminPolicy.isAllowed, admin.deleteUser);

  // Api(s) gestion booking
  router.route('/api/users/appintments').get(adminPolicy.isAllowed, admin.getAllAppointments);

  // Mise en place du lien middleware
  router.param('userId', admin.userById);
  router.param('seanceId', admin.seanceById);
  router.param('sophronisationId', admin.sophronisationById);
  router.param('relaxationId', admin.relaxationById);
};
