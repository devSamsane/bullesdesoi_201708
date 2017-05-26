// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

// Création du schema Seance
const SeanceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  intention: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  created: {
    type: Date,
    default: Date.now
  },
  rang: {
    type: Number,
    default: ''
  },
  relaxations: [{
    type: Schema.Types.ObjectId,
    ref: 'Relaxation'
  }],
  sophronisations: [{
    type: Schema.Types.ObjectId,
    ref: 'Sophronisation'
  }],
  updated: {
    type: Date
  }
});

// Création du model User
mongoose.model('Seance', SeanceSchema)
