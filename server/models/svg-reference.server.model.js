// Déclaration des librairies NODEJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

// Création du schema _SVGReference
const _SVGReferenceSchema = new Schema({
  name: {
    type: String,
    required: [true, config.db.msg.general.required]
  },
  content: {
    type: String,
    required: [true, config.db.msg.general.required]
  }
});

// Création du model RefSvg
mongoose.model('_SVGReference', _SVGReferenceSchema);
