// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const _ = require('lodash');
const validator = require('validator');
const moment = require('moment');

// Déclaration des fichiers de configuration
let Appointment = require(path.resolve('./server/models/appointment.server.model'));
let User = require(path.resolve('./server/models/user.server.model'));
let Seance = require(path.resolve('./server/models/seance.server.model'));
let Relaxation = require(path.resolve('./server/models/relaxation.server.model'));
let Sophronisation = require(path.resolve('./server/models/sophronisation.server.model'));

// Initialisation des models
User = mongoose.model('User');
Seance = mongoose.model('Seance');
Sophronisation = mongoose.model('Sophronisation');
Relaxation = mongoose.model('Relaxation');
Appointment = mongoose.model('Appointment');

// Déclaration des champs pouvant être mis à jour par le front role=admin
const whiteListedField = ['intention', 'rang', 'intitule', 'consigne', 'description', 'type', 'name'];

/**
 * Initialisation et export de la méthode 'readUser'
 * Affiche l'utilisateur actuel
 * @name readUser
 * @param {any} req
 * @param {any} res
 * @returns {object} req.model json
 */
exports.readUser = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;

  if (isUserAuthenticated) {
    res.json(req.modelUser);
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode 'updateUser'
 * Mise à jour du user
 * @name updateUser
 * @param {any} req
 * @param {any} res
 * @returns {object} user
 */
exports.updateUser = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du userId passé en param dans l'url (bind fait avec la déclaration middleware)
  let userToProcess = req.modelUser

  if (isUserAuthenticated) {
    // Filtrage des champs avant de les passer au modèle
    userToProcess.firstname = req.body.firstname;
    userToProcess.lastname = req.body.lastname;
    // userToProcess.roles = req.body.roles;
    userToProcess.displayName = userToProcess.firstname + ' ' + userToProcess.lastname;
    userToProcess.updated = Date.now();

    userToProcess.save(function (err) {
      if (err) {
        return res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: err
        });
      } else {
        return res.status(200).json({
          title: 'Requête traitée avec succès',
          message: userToProcess
        });
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
 * Initialisation et export de la méthode 'createUser'
 * TODO: Améliorer la fonction create : Créer le user et envoyer le mot de passe par mail, réinitialiser le mot de passe à la première connexion
 * @name deleteUser
 * @param {any} req
 * @param {any} res
 * @returns {objet} user, user créée
 */
exports.createUser = function (req, res) {


}


/**
 * Initialisation et export de la méthode 'deleteUser'
 * TODO: Améliorer la fonction delete : propagation de la suppression du user dans les autres collections (issue #37)
 * @name deleteUser
 * @param {any} req
 * @param {any} res
 * @returns {objet} user, user supprimé
 */
exports.deleteUser = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du userId passé en param dans l'url (bind fait avec la déclaration middleware)
  let userToProcess = req.modelUser

  if (isUserAuthenticated) {
    userToProcess.remove(function (err) {
      if (err) {
        return res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: err
        });
      } else {
        return res.json(userToProcess);
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
 * Initialisation et export de la méthode 'listUsers'
 * Affiche la liste des users triée par date de création
 * @name listUsers
 * @param {any} req
 * @param {any} res
 * @returns {object} users
 */
exports.listAllUsers = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;

  if (isUserAuthenticated) {
    User.find({}, '-password -providerData').sort('-created').populate('user', 'displayName').exec(function (err, users) {
      if (err) {
        return res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: err
        });
      } else {
        return res.json(users);
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
 * Initialisation et export de la méthode 'addSeance'
 * Sauvegarde de la seance et mise à jour de la liste des seances du user
 * Il est nécessaire de passer le user._id en paramètre dans la requête http
 * Utilisation de: param = userId
 * @name addSeance
 * @param {any} req
 * @param {any} res
 */
exports.addSeance = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du userId passé en param dans l'url (bind fait avec la déclaration middleware)
  let userToProcess = req.modelUser

  if (isUserAuthenticated) {
    User.findById({ _id: userToProcess._id }, function (err, user) {
      if (err) {
        return res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
      } else {
        // Passage des valeurs du formulaire au model
        const seance = new Seance(req.body);

        // Configuration des valeurs par le backend
        seance.user = user._id;

        // Sauvegarde de la séance et push de l'id de seance dans le user
        // Mongoose pré créé l'id il est donc disponible avant la création par la bd
        seance.save(function (err, result) {
          if (err) {
            return res.status(500).json({
              title: 'Erreur interne du serveur',
              message: err
            });
          } else {
            // Push de l'id seance dans le user
            user.seances.push(result);
            user.updated = Date.now();
            user.save();
            return res.status(201).json({
              title: 'Requête traitée avec succès et création d’un document',
              message: 'La seance a été créée et le profil utilisateur mis à jour'
            });
          }
        });
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
 * Initialisation et export de la méthode 'addSophronisation'
 * Sauvegarde de la sophronisation et mise à jour de la seance
 * Il est nécessaire de passer le seance._id en paramètre dans la requête http
 * Utilisation de: param = seanceId
 * @name addSophronisation
 * @param {any} req
 * @param {any} res
 */
exports.addSophronisation = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;

  if (isUserAuthenticated) {
    Seance.findById({ _id: req.modelSeance._id }, function (err, seance) {
      if (err) {
        return res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
      } else {
        // Passage des valeurs du formulaire au model
        const sophronisation = new Sophronisation(req.body);

        // Configuration des valeurs par le backend
        sophronisation.user = seance.user;

        // Sauvegarde de la sophronisation et push de l'id dans la seance
        // Mongoose pré créé l'id il est donc disponible avant la création par la bd
        sophronisation.save(function (err, result) {
          if (err) {
            return res.status(500).json({
              title: 'Erreur interne du serveur',
              message: err
            });
          } else {
            // Push de l'id dans la seance
            seance.sophronisation.push(result);
            seance.updated = Date.now();
            seance.save();
            return res.status(201).json({
              title: 'Requête traitée avec succès et création d’un document',
              message: 'La sophronisation a été créée et la seance mise à jour'
            });
          }
        });
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
 * Initialisation et export de la méthode 'addRelaxation'
 * Sauvegarde de la ∂ et mise à jour de la seance
 * Il est nécessaire de passer le seance._id en paramètre dans la requête http
 * Utilisation de: param = seanceId
 * @name addRelaxation
 * @param {any} req
 * @param {any} res
 */
exports.addRelaxation = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;

  if (isUserAuthenticated) {
    Seance.findById({ _id: req.modelSeance._id }, function (err, seance) {
      if (err) {
        return res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
      } else {
        // Passage des valeurs du formulaire au model
        const relaxation = new Relaxation(req.body);

        // Configuration des valeurs par le backend
        relaxation.user = seance.user;

        // Sauvegarde de la relaxation et push de l'id dans la seance
        // Mongoose pré créé l'id il est donc disponible avant la création par la bd
        relaxation.save(function (err, result) {
          if (err) {
            return res.status(500).json({
              title: 'Erreur interne du serveur',
              message: err
            });
          } else {
            // Push de l'id dans la seance
            seance.relaxation.push(result);
            seance.updated = Date.now();
            seance.save();
            return res.status(201).json({
              title: 'Requête traitée avec succès et création d’un document',
              message: 'La relaxation a été créée et la seance mise à jour'
            });
          }
        });
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
 * Initialisation et export de la méthode 'updateSeance'
 * Il est nécessaire de passer le seance._id en paramètre dans la requête http
 * Utilisation de: param = seanceId
 * @name updateSeance
 * @param {any} req
 * @param {any} res
 * @returns {object} seance
 */
exports.updateSeance = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du seanceId passé en param dans l'url (bind fait avec la déclaration middleware)
  let seance = req.modelSeance;

  if (isUserAuthenticated) {
    if (seance) {
      // Filtrage des champs à mettre à jour sur la liste des champs autorisés
      seance = _.extend(seance, _.pick(req.body, whiteListedField));

      // Passage des valeurs backend
      seance.updated = Date.now();

      // Sauvegarde de la seance dans la bd
      seance.save(function (err) {
        if (err) {
          return res.status(500).json({
            title: 'Erreur interne du serveur',
            message: err
          });
        } else {
          return res.json(seance);
        }
      });
    } else {
      return res.status(409).json({
        title: 'La requête ne peut être traitée en l’état actuel',
        message: 'La seance est inconnue'
      });
    }
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode 'updateSophronisation'
 * Il est nécessaire de passer le sophronisation._id en paramètre dans la requête http
 * Utilisation de: param = sophronisationId
 * @name updateSophronisation
 * @param {any} req
 * @param {any} res
 * @returns {object} sophronisation
 */
exports.updateSophronisation = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du sophronisationId passé en param dans l'url (bind fait avec la déclaration middleware)
  let sophronisation = req.modelSophronisation;

  if (isUserAuthenticated) {
    if (sophronisation) {
      // Filtrage des champs à mettre à jour sur la liste des champs autorisés
      sophronisation = _.extend(sophronisation, _.pick(req.body, whiteListedField));

      // Passage des valeurs backend
      sophronisation.updated = Date.now();

      // Sauvegarde de la sophronisation dans la bd
      sophronisation.save(function (err) {
        if (err) {
          return res.status(500).json({
            title: 'Erreur interne du serveur',
            message: err
          });
        } else {
          return res.json(sophronisation);
        }
      });
    } else {
      return res.status(409).json({
        title: 'La requête ne peut être traitée en l’état actuel',
        message: 'La sophronisation est inconnue'
      });
    }
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode 'updateRelaxation'
 * Il est nécessaire de passer le relaxation._id en paramètre dans la requête http
 * Utilisation de: param = relaxationId
 * @name updateRelaxation
 * @param {any} req
 * @param {any} res
 * @returns {object} relaxation
 */
exports.updateRelaxation = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du relaxationId passé en param dans l'url (bind fait avec la déclaration middleware)
  let relaxation = req.modelRelaxation;

  if (isUserAuthenticated) {
    if (relaxation) {
      // Filtrage des champs à mettre à jour sur la liste des champs autorisés
      relaxation = _.extend(relaxation, _.pick(req.body, whiteListedField));

      // Passage des valeurs backend
      relaxation.updated = Date.now();

      // Sauvegarde de la relaxation dans la bd
      relaxation.save(function (err) {
        if (err) {
          return res.status(500).json({
            title: 'Erreur interne du serveur',
            message: err
          });
        } else {
          return res.json(relaxation);
        }
      });
    } else {
      return res.status(409).json({
        title: 'La requête ne peut être traitée en l’état actuel',
        message: 'La relaxation est inconnue'
      });
    }
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode 'deleteSophronisation'
 * Suppression de la sophronisation selectionnée
 * Il est nécessaire de passer le sophronisation._id en paramètre dans la requête http
 * Utilisation de: param = sophronisationId
 * @name deleteSophronisation
 * @param {any} req
 * @param {any} res
 * @returns {object} message
 */
exports.deleteSophronisation = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du sophronisationId passé en param dans l'url (bind fait avec la déclaration middleware)
  let sophronisation = req.modelSophronisation;

  if (isUserAuthenticated) {
    if (sophronisation) {
      sophronisation.remove(function (err) {
        if (err) {
          return res.status(500).json({
            title: 'Erreur interne du serveur',
            message: err
          });
        } else {
          return res.status(200).json({
            title: 'Requête traitée avec succès',
            message: 'La sophronisation ' + sophronisation._id + ' est supprimée'
          });
        }
      });
    } else {
      return res.status(409).json({
        title: 'La requête ne peut être traitée en l’état actuel',
        message: 'La sophronisation est inconnue'
      });
    }
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode 'deleteRelaxation'
 * Suppression de la relaxation selectionnée
 * Il est nécessaire de passer le relaxation._id en paramètre dans la requête http
 * Utilisation de: param = relaxationId
 * @name deleteRelaxation
 * @param {any} req
 * @param {any} res
 * @returns {object} message
 */
exports.deleteRelaxation = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du relaxationId passé en param dans l'url (bind fait avec la déclaration middleware)
  let relaxation = req.modelRelaxation;

  if (isUserAuthenticated) {
    if (relaxation) {
      relaxation.remove(function (err) {
        if (err) {
          return res.status(500).json({
            title: 'Erreur interne du serveur',
            message: err
          });
        } else {
          return res.status(200).json({
            title: 'Requête traitée avec succès',
            message: 'La relaxation ' + relaxation._id + ' est supprimée'
          });
        }
      });
    } else {
      return res.status(409).json({
        title: 'La requête ne peut être traitée en l’état actuel',
        message: 'La relaxation est inconnue'
      });
    }
  } else {
    res.status(401).json({
      title: 'Une authentification est nécessaire pour accéder à la ressource',
      message: 'L\'utilisateur n\'est pas authentifié'
    });
  }
};

/**
 * Initialisation et export de la méthode 'deleteSeance'
 * Suppression de la seance selectionnée
 * Il est nécessaire de passer le seance._id en paramètre dans la requête http
 * Utilisation de: param = seanceId
 * @name deleteSeance
 * @param {any} req
 * @param {any} res
 * @returns {object} message
 */
exports.deleteSeance = function (req, res) {
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;
  // Récupération du seanceId passé en param dans l'url (bind fait avec la déclaration middleware)
  let seance = req.modelSeance;

  if (isUserAuthenticated) {
    if (seance) {
      if (seance.sophronisations.length > 0) {
        seance.sophronisations.remove(seance.sophronisations[0], function (err) {
          if (err) {
            return res.status(500).json({
              title: 'Erreur interne du serveur',
              message: err
            });
          } else {
            res.status(200).json({
              title: 'Requête traitée avec succès',
              message: 'La sophronisation de la seance est supprimée'
            });
          }
        });
      }
      if (seance.relaxation.length > 0) {
        seance.relaxation.remove(seance.relaxation[0], function (err) {
          if (err) {
            return res.status(500).json({
              title: 'Erreur interne du serveur',
              message: err
            });
          } else {
            res.status(200).json({
              title: 'Requête traitée avec succès',
              message: 'La relaxation de la seance est supprimée'
            });
          }
        });
      }

      seance.remove(function (err) {
        if (err) {
          return res.status(500).json({
            title: 'Erreur interne du serveur',
            message: err
          });
        } else {
          return res.status(200).json({
            title: 'Requête traitée avec succès',
            message: 'La seance ' + seance._id + ' est supprimée'
          });
        }
      });
    } else {
      return res.status(409).json({
        title: 'La requête ne peut être traitée en l’état actuel',
        message: 'La seance est inconnue'
      });
    }
  } else {
    res.status(401).json({
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
  // Vérification qu'un user est bien authentifié
  // Récupération des valeurs req.user en provenance de authorisation
  let isUserAuthenticated = req.user;

  if (isUserAuthenticated) {
    // Affichage des rendez-vous supérieur ou égal à la date du jour
    Appointment.find({ startDateTime: { $gte: moment.utc(Date.now()) } }).sort('-startDateTime').populate('user', '-password').exec(function (err, appointments) {
      if (err) {
        return res.status(500).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: err
        });
      } else {
        console.log(appointments);
        res.status(200).json(appointments);
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
 * Initialisation et export de la méthode 'userById'
 * Renvoi un objet user paramétré dans req.modelUser
 * Cet object est disponible à travers les routes
 * @name userById
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} userId
 * @returns {object} user
 */
exports.userById = function (req, res, next, userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      title: 'La syntaxe de la requête est erronée',
      message: 'Le user est inconnu'
    });
  } else {
    User.findById(userId, '-password -providerData').exec(function (err, user) {
      if (err) {
        res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
        return next();
      } else if (!user) {
        res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: 'La seance est inconnue'
        });
        return next();
      } else {
        req.modelUser = user;
        next();
      }
    });
  }
};

/**
 * Initialisation et export de la méthode 'seanceById'
 * Renvoi un objet seance paramétré dans req.modelSeance
 * Cet object est disponible à travers les routes
 * @name seanceById
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} seanceId
 * @returns {object} seance
 */
exports.seanceById = function (req, res, next, seanceId) {
  if (!mongoose.Types.ObjectId.isValid(seanceId)) {
    return res.status(400).json({
      title: 'La syntaxe de la requête est erronée',
      message: 'La seance est inconnue'
    });
  } else {
    Seance.findById(seanceId).exec(function (err, seance) {
      if (err) {
        res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
        return next();
      } else if (!seance) {
        res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: 'La seance est inconnue'
        });
        return next();
      } else {
        req.modelSeance = seance;
        next();
      }
    });
  }
};

/**
 * Initialisation et export de la méthode 'sophronisationById'
 * Renvoi un objet sophronisation paramétré dans req.modelSophronisation
 * Cet object est disponible à travers les routes
 * @name sophronisationById
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} sophronisationId
 * @returns {object} sophronisation
 */
exports.sophronisationById = function (req, res, next, sophronisationId) {
  if (!mongoose.Types.ObjectId.isValid(sophronisationId)) {
    return res.status(400).json({
      title: 'La syntaxe de la requête est erronée',
      message: 'La sophronisation est inconnue'
    });
  } else {
    Sophronisation.findById(sophronisationId).exec(function (err, sophronisation) {
      if (err) {
        res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
        return next();
      } else if (!sophronisation) {
        res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: 'La sophronisation est inconnue'
        });
        return next();
      } else {
        req.modelsophronisation = sophronisation;
        next();
      }
    });
  }
};

/**
 * Initialisation et export de la méthode 'relaxationById'
 * Renvoi un objet relaxation paramétré dans req.modelRelaxation
 * Cet object est disponible à travers les routes
 * @name relaxationById
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} relaxationId
 * @returns {object} relaxation
 */
exports.relaxationById = function (req, res, next, relaxationId) {
  if (!mongoose.Types.ObjectId.isValid(relaxationId)) {
    return res.status(400).json({
      title: 'La syntaxe de la requête est erronée',
      message: 'La relaxation est inconnue'
    });
  } else {
    Relaxation.findById(relaxationId).exec(function (err, relaxation) {
      if (err) {
        res.status(500).json({
          title: 'Erreur interne du serveur',
          message: err
        });
        return next();
      } else if (!relaxation) {
        res.status(409).json({
          title: 'La requête ne peut être traitée en l’état actuel',
          message: 'La relaxation est inconnue'
        });
        return next();
      } else {
        req.modelrelaxation = relaxation;
        next();
      }
    });
  }
};
