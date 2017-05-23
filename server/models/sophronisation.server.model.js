// Déclaration des librairies NODEJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

// Création du schema Sophronisation
const SophronisationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId
  },
  seance: {
    type: Schema.Types.ObjectId,
    ref: 'Seance'
  },
  description: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  intention: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  type: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  name: {
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

// Création du model Sophronisation
mongoose.model('Sophro', SophronisationSchema);
