// Déclaration des librairies nodeJS
const path = require('path');
const fs = require('fs');

// Déclaration des librairies
const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');

// Déclaration des fichiers de configuration
let User = require(path.resolve('./server/models/user.server.model'));
let Seance = require(path.resolve('./server/models/seance.server.model'));
const config = require(path.resolve('./config/config'));

// Initialisation des models
User = mongoose.model('User');
Seance = mongoose.model('Seance');

// Déclaration des champs modifiables par le front
const whiteListedFields = ['firstname', 'lastname', 'email', 'phone'];


/**
 * Initialisation et exports de la méthode 'me'
 * Création du safeUserObjet comportant les données user et passage par le sanitizer validator
 * @name me
 * @param {any} req
 * @param {any} res
 * @returns {object} json object safe user
 */
exports.me = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let user = req.user;
  // Création d'un objet sanitize
  let safeUserObject = null;

  if (user) {
    safeUserObject = {
      // Passage des valeurs du front par le sanitizer validator
      displayName: validator.escape(req.user.displayName),
      created: req.user.created.toString(),
      roles: req.user.roles,
      email: validator.escape(req.user.email),
      firstname: validator.escape(req.user.firstname),
      lastname: validator.escape(req.user.lastname),
      phone: validator.escape(req.user.phone)
    };
  }
  // Renvoi de l'objet safeUserObject ou null si user non authentifié
  res.json(safeUserObject || null);
};


/**
 * Initialisation et exports de la méthode 'update'
 * Mets à jour les données utilisateur depuis sa gestion de profil
 * Renvoi l'object user si tout se passe bien
 * @name
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @returns {object} user
 */
exports.update = function (req, res, next) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let user = req.user;

  if (user) {
    // Filtrage des champs à mettre à jour sur la liste des champs autorisés
    user = _.extend(user, _.pick(req.body, whiteListedFields));

    // Passage des valeurs backend
    user.updated = Date.now();
    user.displayName = user.firstname + ' ' + user.lastname;

    // Sauvegarde du user dans la bd
    user.save(function (err) {
      if (err) {
        return res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: err
        });
      } else {
        res.json(user);
      }
    });
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et exports de méthode 'seances'
 * Retourne un objet seances listant l'ensemble des séances pour un user
 * @name seances
 * @param {any} req
 * @param {any} res
 * @returns {object} seances, liste des seances pour un user
 */
exports.seances = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let user = req.user;

  if (user) {
    Seance.find({ user: user }, function (err, seances) {
      if (err) {
        return res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: err
        });
      } else {
        res.json(seances);
      }
    });
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode seance
 * Retourne l'objet seance passé en paramètre
 * @name seance
 * @param {any} req
 * @param {any} res
 * @returns {object} seance, la séance demandée en params
 */
exports.seance = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let user = req.user;
  // Déclaration param pour accèder aux valeurs de l'url
  const param = req.params;

  if (user) {
    Seance.findOne({ _id: param.seanceId }).populate('sophronisations').populate('relaxations').exec(function (err, seance) {

      if (err) {
        return res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: err
        });
      } else {
        res.status(200).json(seance);
      }
    });
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};
