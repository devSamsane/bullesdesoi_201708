// Core NodeJS
const path = require('path');

// Packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Fichiers de configuration
const config = require(path.resolve('./config/config'));

// Création du schema _SophronisationReference
const _SophronisationReferenceSchema = new Schema({
  name: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  description: {
    type: String,
    required: [true, config.db.msg.general.required]
  }
});

// Création du model _SophronisationReference
mongoose.model('_SophronisationReference', _SophronisationReferenceSchema);
