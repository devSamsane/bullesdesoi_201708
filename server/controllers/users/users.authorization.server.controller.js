// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');

// Déclaration des fichiers de configuration
let User = require(path.resolve('./server/models/user.server.model'));

// Initialisation du model User
User = mongoose.model('User');

/**
 * Initialisation et export du middleware user
 * @name userById
 * @param {any} req
 * @param {any} res
 * @param {any} next
 * @param {any} id
 * @returns {object} user
 */
exports.userById = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      title: 'La syntaxe de la requête est erronée',
      message: 'L\'id utilisateur n\'est pas au format valide'
    });
  } else {
    User.findOne({
      _id: id
    }).exec(function (err, user) {
      if (err) {
        return next(err);
      } else if (!user) {
        return next(new Error('Erreur de chargement de l\'utilisateur ' + id));
      } else {
        req.profile = user;
        next();
      }
    });
  }
};
