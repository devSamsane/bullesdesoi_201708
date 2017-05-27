// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const validator = require('validator');

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

exports.renderIndexHTML = function (req, res, next) {
  let safeUserObject = null;

  // Création de l'objet safeUserObject si le user existe
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      created: req.user.created.toString(),
      roles: req.user.roles,
      email: validator.escape(req.user.email),
      lastname: validator.escape(req.user.lastname),
      firstname: validator.escape(req.user.firstname),
      phone: validator.escape(req.user.phone),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }
  // Affichage du fichier index par défaut pour toutes les routes
  res.render('index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};
