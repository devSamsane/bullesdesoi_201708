// Déclaration des librairies nodeJS
const path = require('path');
const fs = require('fs');

// Déclaration des librairies
const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');
const moment = require('moment-timezone');

// Déclaration des fichiers de configuration
let User = require(path.resolve('./server/models/user.server.model'));
let Appointment = require(path.resolve('./server/models/appointment.server.model'));
const config = require(path.resolve('./config/config'));

// Initialisation des models
User = mongoose.model('User');
Appointment = mongoose.model('Appointment');

// Configuration momentjs
moment().tz('Europe/Paris').format();

/**
 * Initialisation et export de la méthode addAppointment
 * Permet à un utilisateur authentifié de prendre rendez-vous
 * @name addAppointment
 * @param {any} req
 * @param {any} res
 * @returns
 */
exports.addAppointment = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let user = req.user;

  if (user) {
    User.findById({ _id: user._id }, function (err, user) {
      if (err) {
        return res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
      } else {
        // Passage des valeurs du formulaire au model
        const appointment = new Appointment();

        // Configuration des valeurs par le backend
        // TODO:Calcul de la date de fin de rendez-vous: Start + 1h
        appointment.user = user._id;
        appointment.startDateTime = moment.tz(req.body.startDateTime, 'Europe/Paris');
        appointment.endDateTime = moment(appointment.startDateTime).add(60, 'minutes');

        // FIXME: Retirer consoles
        // console.info('Valeurs locales moment passées dans le model')
        // console.log('start: ' + appointment.startDateTime);
        // console.log('End: ' + appointment.endDateTime);
        // console.log('-----');

        // Sauvegarde du rendez-vous
        appointment.save(function (err, result) {
          if (err) {
            return res.status(500).json({
              title: 'Erreur interne du serveur',
              message: err
            });
          } else {
            // Push de l'id appointment dans le user
            user.appointments.push(result);
            user.updated = Date.now();
            user.hasAnAppointment = true;
            user.save();
            return res.status(201).json({
              title: 'Requête traitée avec succès et création d’un document',
              message: 'Le rendez-vous est pris'
            });
          }
        });
      }
    });
  } else {
    return res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode getAllAppointments
 * Retourne l'ensemble des rendez-vous pris
 * @param {any} req
 * @param {any} res
 * @param {object} appointments, json object
 */
exports.getAllAppointments = function (req, res) {
  // Fonction accessible sans authentification
  // Filtrer les rendez-vous par rapport à la date du jour
  Appointment.find({ startDateTime: { $gte: Date.now() } }, '-user -_id').sort('-startDateTime').exec(function (err, appointments) {
    if (err) {
      return res.status(500).json({
        title: 'La requête ne peut être traitée en l’état actuel',
        message: err
      });
    } else {
      res.status(200).json(appointments);
    }
  });
};

/**
 * Initialisation et export de la méthode getUserAppointments
 * Retourne l'ensemble des rendez-vous pris
 * @param {any} req
 * @param {any} res
 * @param {object} appointments, json object
 */
exports.getUserAppointments = function (req, res) {
  let user = req.user;

  if (user) {
    User.findById({ _id: user._id }, function (err, user) {
      if (err) {
        return res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
      } else {
        Appointment.find({ userId: user._id }), function (err, appointments) {
          if (err) {
            return res.status(500).json({
              title: 'La requête ne peut être traitée en l’état actuel',
              message: err
            });
          } else {
            res.status(200).json(appointments);
          }
        }
      }
    });
  } else {
    return res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};
