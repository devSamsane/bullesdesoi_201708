// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const owasp = require('owasp-password-strength-test');
const generatePassword = require('generate-password');
const Schema = mongoose.Schema;

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

/**
 * Fonction de validation pour la stratégie locale
 * @name validateLocalStrategyProperty
 * @param {String} property
 * @returns {number} property.length, property existe ou pas
 */
let validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * Fonction de validation email
 * @name validateLocalStrategyEmail
 * @param {String} email
 * @returns {boolean} l'email est-il un email
 */
let validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};


// Création du schema user
const UserSchema = new Schema({
  email: {
    type: String,
    index: {
      unique: true,
      sparse: true
    },
    lowercase: true,
    trim: true,
    default: '',
    validate: [validateLocalStrategyEmail, 'Une adresse email est requise']
  },
  firstname: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Un prénom est requis']
  },
  lastname: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Un nom est requis']
  },
  displayName: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    minlength: [8, config.db.msg.String.minlength],
    required: [true, config.db.msg.general.required]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  providerData: {},
  additionnalProviderData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user'],
    required: [true, config.db.msg.general.required]
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  updated: {
    type: Date,
    default: ''
  },
  hasResetInProgress: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: ''
  },
  resetPasswordExpires: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  hasAnAppointment: {
    type: Boolean,
    default: false
  },
  seances: [{
    type: Schema.Types.ObjectId,
    ref: 'Seance'
  }]
});

/**
 * Méthode 'pre' validate: vérification de la longueur du mot de passe avant enregistrement
 */
UserSchema.pre('validate', function (next) {
  // Filtrage du provider, la fonction n'est appliquée aur pour le provider local
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    const result = owasp.test(this.password);
    if (result.errors.length) {
      const error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }
  next();
});

/**
 * Méthode 'pre' save: hashage du mot de passe
 * On ne sauvegarde pas le sel
 * TODO: Regarder la différence entre le hashSync et hash
 */
UserSchema.pre('save', function (next) {
  // Vérification que le user modifie son mot de passe
  if (this.password && this.isModified('password')) {
    // Création du sel
    const salt = bcrypt.genSaltSync(10);
    // Hashage du mot de passe
    // Utilisation de la fonction synchrone du sel du mot de passe
    const hash = bcrypt.hashSync(this.password, salt);
    // Sauvegarde du hash
    this.password = hash;
  }
  next();
});


/**
 * Méthode de comparaison hash vs password
 * @name authenticate
 * @param {string} password hash du user
 * @returns {boolean}
 */
UserSchema.methods.authenticate = function (password) {
  return bcrypt.compareSync(password, this.password);
};


/**
 * Génération d'une passphrase respectant les règles de l'owasp
 * Seuls sont pris en compte les tests requis de l'owasp, pas les optionnels
 * @name {generateRandomPassphrase}
 * @return {Promise}
 */
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    let password = '';
    const repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // Itération tant que la passphrase ne répond pas aux tests
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // Construction de la passphrase entre minPhraseLength et (minPhraseLength)x2 caractères
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (config.shared.owasp.minPhraseLength)) + config.shared.owasp.minPhraseLength,
        numbers: true,
        symbols: true,
        uppercase: true,
        excludeSimilarCharacters: true,
        exclude: '"'
      });

      // Vérification de la nécessité de supprimer les caractères répétitifs
      password = password.replace(repeatingCharacters, '');
    }

    // Envoi de l'erreur si la passphrase ne passe pas les tests owasp
    if (owasp.test(password).errors.length) {
      reject(new Error('Un problème est survenu pendant la génération de la passphrase'));
    } else {
      resolve(password);
    }
  });
};

// Création du model User
mongoose.model('User', UserSchema);
