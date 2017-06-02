// Déclaration des librairies
let acl = require('acl');

// Configuration acl memory
acl = new acl(new acl.memoryBackend());

/**
 * Module de paramétrage des permissions routes
 * Association du role autorisé, de la route et de la méthode http
 */
exports.invokeRolesPolicies = function () {
  acl.allow('admin', '/api/users/', 'get');
  acl.allow('admin', '/api/users/appointments/', 'get');
  acl.allow('admin', '/api/users/:userId', ['get', 'patch', 'delete']);

  acl.allow('admin', '/api/users/:userId/seances', 'post');
  acl.allow('admin', '/api/users/:userId/seances/:seanceId', ['patch', 'delete']);

  acl.allow('admin', '/api/users/:userId/seances/:seanceId/sophronisations', 'post');
  acl.allow('admin', '/api/users/:userId/seances/:seanceId/sophronisations/:sophronisationId', ['patch', 'delete']);

  acl.allow('admin', '/api/users/:userId/seances/:seanceId/relaxations', 'post');
  acl.allow('admin', '/api/users/:userId/seances/:seanceId/relaxations/:relaxationId', ['patch', 'delete']);

};

exports.isAllowed = function (req, res, next) {
  // Vérification des roles du user authentifié via req.user (authorization)
  // Check en plus de celui effectué par le controller admin lui-même
  // Si aucun rôle, alors on attribue un rôle guest par défaut pour éviter les erreurs
  // Attention à ne pas attribuer de droit à ce rôle (ne fait pas partie de enum du modèle)
  const roles = (req.user) ? req.user.roles : ['guest'];

  // Vérification de la propriété rôle attribuée à la route
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      return res.status(500).json({
        title: 'Erreur interne du serveur',
        message: err
      });
    } else if (isAllowed) {
      return next();
    } else {
      return res.status(403).json({
        title: 'Le serveur a compris la requête, mais refuse de l\'exécuter',
        message: 'L\'utilisateur n\'est pas autorisé à accéder à la ressource'
      });
    }
  });
};
