// Déclaration des librairies
const _ = require('lodash');

/**
 * Module d'export global des controllers associés aux routes user
 * Concaténation des controllers
 */
module.exports = _.extend(
  require('./users/users.authentication.server.controller'),
  require('./users/users.authorization.server.controller'),
  require('./users/users.profile.server.controller')
);
