// Déclaration des librairies NODEJS
const path = require('path');

// Déclaration des librairies
const _ = require('lodash');
const mongoose = require('mongoose');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');

// Déclaration des fichiers de configuration
const config = require('../config');

// Déclaration de l'objet seed
let seedOptions = {};

/**
 * Suppression du user préalable
 * @name removeUser
 * @param {object} user
 * @returns {function} promise resolve()
 */
function removeUser (user) {
  return new Promise(function (resolve, reject) {
    const User = mongoose.model('User');
    User.find({ email: user.email }).remove(function (err) {
      if (err) {
        reject(new Error('Echec de suppression du user ' + user.email));
      }
      resolve();
    });
  });
};

/**
 * Sauvegarde du user
 * @name saveUser
 * @param {object} user
 * @returns {function} promise resolve()
 */
function saveUser(user) {
  return function () {
    return new Promise(function (resolve, reject) {
      user.save(function (err, theUser) {
        if (err) {
          reject(new Error('Echec de création du user ' + user.email));
        } else {
          resolve(theUser);
        }
      });
    });
  }
};

/**
 * Vérification de l'existence d'un user: unicité du mail
 * @name checkUserNotExists
 * @param {object} user
 * @returns {function} promise resolve()
 */
function checkUserNotExists(user) {
  return new Promise(function (resolve, reject) {
    const User = mongoose.model('User');
    User.find({ email: user.email }, function (err, users) {
      if (err) {
        reject(new Error('Connexion à la collection User impossible'))
      }
      if (users.length === 0) {
        resolve();
      } else {
        reject(new Error('Erreur: Un user existe déjà avec ' + user.email));
      }
    });
  });
};

/**
 * Rapport 'succes' de la création du user
 * @name reportSuccess
 * @param {string} password
 * @returns {function} promise resolve()
 */
function reportSuccess(password) {
  return function (user) {
    return new Promise(function (resolve, reject) {
      if (seedOptions.logResults) {
        console.log(chalk.bold.red('Database seeding: ' + user.email + ' créé avec le password ' + password));
      }
      resolve();
    });
  };
};

/**
 * Création du seed user
 * Vérification de la non préexistence, si oui suppression et sauvegarde
 * Rapport du succes pour avoir le mot de passe
 * @name seedTheUser
 * @param {object} user
 * @returns {function} promise resolve()
 */
function seedTheUser(user) {
  return function (password) {
    return new Promise(function (resolve, reject) {
      const User = mongoose.model('User');
      user.password = password;
      if (user.email === seedOptions.seedAdmin.email && process.env.NODE_ENV === 'production') {
        checkUserNotExists(user)
          .then(saveUser(user))
          .then(reportSuccess(password))
          .then(function () {
            resolve();
          })
          .catch(function (err, user) {
            reject(err);
          });
      } else {
        removeUser(user)
          .then(saveUser(user))
          .then(reportSuccess(password))
          .then(function () {
            resolve();
          })
          .catch(function (err) {
            reject(err);
          });
      }
    });
  };
};

/**
 *  Rapport 'echec' de la création du user
 * @name reportError
 * @param {function} reject promise
 * @returns {function} promise reject()
 */
function reportError(reject) {
  return function (err) {
    if (seedOptions.logResults) {
      console.log();
      console.log('Database seeding: ' + err);
      console.log();
    }
    reject(err);
  };
};

module.exports.start = function start(options) {
  seedOptions = _.clone(config.seedDB.options, true);

  if (_.has(options, 'logResults')) {
    seedOptions.logResults = options.logResults;
  }
  if (_.has(options, 'seedUser')) {
    seedOptions.seedUser = options.seedUser;
  }
  if (_.has(options, 'seedAdmin')) {
    seedOptions.seedAdmin = options.seedAdmin;
  }

  const User = mongoose.model('User');

  return new Promise(function (resolve, reject) {
    const adminAccount = new User(seedOptions.seedAdmin);
    const userAccount = new User(seedOptions.seedUser);

    // En environnement de production, création du user admin uniquement
    if (process.env.NODE_ENV === 'production') {
      User.generateRandomPassphrase()
        .then(seedTheUser(adminAccount))
        .then(function () {
          resolve();
        })
        .catch(reportError(reject));
    } else {
      // Pour les autres environnements, création du user et du user admin
      User.generateRandomPassphrase()
        .then(seedTheUser(userAccount))
        .then(User.generateRandomPassphrase)
        .then(seedTheUser(adminAccount))
        .then(function () {
          resolve();
        })
        .catch(reportError(reject));
    }
  });
};
