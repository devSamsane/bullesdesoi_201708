// Déclaration des fichiers de configuration
const defaultEnvConfig = require('./default');

module.exports = {

  // Définition du nom de l'application pour le développement
  app: {
    title: defaultEnvConfig.app.title + ' - Environnement: development'
  },

  // Déclaration configuration db mongoDB
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/bullesdesoi-dev',
    options: {
      user: '',
      pass: ''
    },
    // Activation du mode debug de mongoose
    debug: process.env.MONGODB_DEBUG || false
  },

  // Déclaration de la configuration du logger
  log: {
    format: 'dev',
    fileLogger: {
      directoryPath: (process.cwd(), 'logs/'),
      fileName: 'app-bullesdesoi.log',
      maxsize: '10485760',
      maxFile: 2,
      json: false
    }
  },

  // Configuration des paramètres du json web token
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    options: {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  },

  // Définition du domaine de développement
  domain: process.env.DOMAIN || 'localhost'
};
