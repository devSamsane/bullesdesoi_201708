// Déclaration des librairies NODEJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const passport = require('passport');

// Déclaration des fichiers de configuration
let User = require(path.resolve('./server/models/user.server.model'));
const authorization = require('../../../config/lib/authorization');

// Initialisation du model User
User = mongoose.model('User');

/**
 * Intialisation et export de la méthode signup
 * Fonction permettant la création d'un user
 * @param {object} req requête http
 * @param {object} res réponse http
 * @param {function} next callback, appel du futur middleware
 * @method {post} méthode http
 * @return {object} user json object
 */
exports.signup = function (req, res, next) {

  // Par défaut, suppression du rôle de la requête de création
  // Pour le rôle admin, attribution en direct dans la bd
  delete req.body.roles;

  // Initialisation des paramètres du nouvel utilisateur
  // Passage des valeurs de la req au model User
  const user = new User(req.body);

  // Mise à jour des paramètres du user
  // Pour les champs non disponible dans le form et requis
  user.provider = 'local';
  user.displayName = user.firstname + ' ' + user.lastname;

  // Sauvegarde du user initialisé
  // Renvoi à la méthode 'pre' save du model User
  user.save(function (err) {
    if (err) {
      return res.status(422).json({
        title: 'Une erreur est survenue',
        message: err
      });
    } else {
      // Suppression des valeurs sensibles, une fois la sauvegarde effectuée
      user.password = undefined;

      // Récupération du token
      const token = authorization.signToken(user);
      res.status(201).json({
        message: 'Utilisateur créé',
        user: user,
        token: token
      });
    }
  });
};

/**
 * Initialisation et export de la methode signin
 * @name signin
 * @param {object} req requête HTTP
 * @param {object} res réponse HTTP
 * @param {function} next callback
 * @method {post} méthode HTTP
 * @return {object} objet user JSON
 */
exports.signin = function (req, res, next) {
  // Appel de la stratégie passport d'authentification local
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      res.status(500).json({
        message: 'Erreur interne du serveur',
        error: err
      })
    } else if (!user) {
      res.status(401).json({
        message: 'User inconnu',
        error: info
      })
    } else {
      // Suppression des valeurs sensibles une fois l'auth effectuée
      user.password = undefined;

      // Mise à jour du champ lastConnexion
      // TODO: Trouver un moyen de mettre à jour le champs
      // user.lastConnexion = Date.now();
      // console.log(user._id);
      // User.findByIdAndUpdate(user._id, { $set: { 'lastConnexion': Date.now() } });
      // user.put({ _id: user._id }, { $set: { 'lastConnexion': Date.now() } });

      // Récupération et signature du token
      const token = authorization.signToken(user);
      res.status(200).json({
        user: user,
        token: token
      });
    }
  })(req, res, next);
};
