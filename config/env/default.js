module.exports = {
  app: {
    title: 'Bulles de Soi',
    description: 'Site web de sophrologie et prise de rendez-vous en ligne',
    keywords: 'sophrologie, relaxation, gestion du stress, perinatalité, enfance, adolescence'
  },

  // Spécification des paramètres réseau du server web
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  domain: process.env.DOMAIN,

  // Définition des fichiers statiques
  logo: 'src/assets/img/brand/logo.png',
  favicon: 'src/assets/img/brand/favicon.ico'
};
