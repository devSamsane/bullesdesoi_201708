// Déclaration des fichiers de configuration
const defaultEnvConfig = require('./default');

module.exports = {

  // Définition du nom de l'application pour le développement
  app: {
    title: defaultEnvConfig.app.title + ' - Environnement: development'
  },

  // Définition du domaine de développement
  domain: process.env.DOMAIN || 'localhost'
};
