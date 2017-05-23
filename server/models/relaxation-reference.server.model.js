// Déclaration des librairies NODEJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

// Création du schema _RelaxationReferenceSchema

const _RelaxationReferenceSchema = new Schema({
  intention: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  consigne: {
    type: String,
    required: [true, config.db.msg.general.required]
  }
});

// Création du model _RelaxationReference
mongoose.model('_RelaxationReference', _RelaxationReferenceSchema);
