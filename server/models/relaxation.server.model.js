// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

// Création du schema Relaxation
const RelaxationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  seance: {
    type: Schema.Types.ObjectId,
    ref: 'Seance'
  },
  intitule: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  intention: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  consigne: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  created: {
    type: Date,
    required: [true, config.db.msg.general.required],
    default: Date.now
  },
  updated: {
    type: Date
  }
});

// Création du model Relaxation
mongoose.model('Relaxation', RelaxationSchema);
