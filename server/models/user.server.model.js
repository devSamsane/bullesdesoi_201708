// Déclaration des librairies NODEJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
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
  lastConnexion: {
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

// Création du model User
mongoose.model('User', UserSchema);
