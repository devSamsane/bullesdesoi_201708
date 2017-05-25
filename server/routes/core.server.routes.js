// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const express = require('express');

const router = express.Router();

// router.get('/', function(req, res, next) {
//   res.render('index');
// });
module.exports = function (app) {
  router.route('*').get(function (req, res, next) {
    // Spécification de l'extension .html pour ne pas générer d'erreur
    // res.render attend la définition d'un view engine
    res.send('route *')
    // res.sendFile(path.resolve('./dist/index.html'));
  });
};


// module.exports = router;
