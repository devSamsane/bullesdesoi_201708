module.exports = {
  app: {
    title: 'Bulles de Soi',
    description: 'Site web de sophrologie et prise de rendez-vous en ligne',
    keywords: 'sophrologie, relaxation, gestion du stress, perinatalité, enfance, adolescence'
  },

  // Déclaration configuration db mongoDB
  db: {
    promise: global.Promise,
    msg: {
      general: {
        default: 'La validation du `{PATH}` a échoué pour `{VALUE}`',
        required: 'Le `{PATH}` est un champs obligatoire'
      },
      Number: {
        min: 'La `{VALUE}` est inférieur au minimum requis ({MIN})',
        max: 'La `{VALUE}` est supérieur au maximum requis ({MAX})'
      },
      Date: {
        min: 'Le `{PATH}` ({VALUE}) est inférieur à la valeur minimum ({MIN})',
        max: 'Le `{PATH}` ({VALUE}) est supérieur à la valeur maximum ({MAX})'
      },
      String: {
        enum: 'La valeur `{VALUE}` n\'est pas autorisée pour le champs `{PATH}`',
        match: 'La valeur `{VALUE}` est invalide pour le champs `{PATH}`',
        minlength: 'Champs `{PATH}`: la ({VALUE}) est inférieur au minimum requis ({MINLENGTH})',
        maxlength: 'Champs `{PATH}`: la ({VALUE}) est supérieur au maximum requis ({MAXLENGTH})'
      }
    }
  },

  // Spécification des paramètres réseau du server web
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  domain: process.env.DOMAIN,

  // Définition des fichiers statiques
  logo: 'src/assets/img/brand/logo.png',
  favicon: 'src/assets/img/brand/favicon.ico',

  // Spécification des paramètres partagés
  shared: {
    owasp: {
      allowPassphrase: true,
      maxLength: 128,
      minLength: 8,
      minPhraseLength: 12,
      minOptionalTestsToPass: 4
    }
  }
};
