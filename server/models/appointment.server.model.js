// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Déclaration des fichiers de configuration
const config = require(path.resolve('./config/config'));

// Création du schema Appointment
const AppointmentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  startDateTime: {
    type: Date,
    default: '',
    required: [true, config.db.msg.general.required]
  },
  endDateTime: {
    type: Date,
    default: '',
    required: [true, config.db.msg.general.required]
  },
  isConfirmed: {
    type: Boolean,
    default: false
  }
});

/**
 * Vérification de la validité de la date et heure de réservation
 * Ne pas prendre 2 rendez-vous sur la même plage
 * @return {object}
 */
AppointmentSchema.path('startDateTime').validate(function (value, done) {
  const _this = this

  return mongoose.modelNames.Appointment.find({
    '_id': { $ne: _this._id },
    'user.id': _this.user.id,
    $or: [
      { startDateTime: { $lt: _this.endDateTime, $gte: _this.startDateTime } },
      { endDateTime: { $lte: _this.endDateTime, $gt: _this.startDateTime } }
    ]
  }, function (err, appointments) {
    done(!appointments || appointments.length === 0);
  });
}, 'Le rendez-vous est en conflit avec un autre');

/**
 * Vérification de la validité de la date et heure de réservation
 * Ne pas prendre un rendez-vous dans le passé
 * @return {boolean}
 */
AppointmentSchema.path('startDateTime').validate(function (value, done) {
  const isValid = true;
  if (value < new Date()) {
    isValid = false;
  }
  done(isValid);
}, 'Le rendez-vous ne peut pas être pris dans le passé');

// Création du model Appointment
mongoose.model('Appointment', AppointmentSchema);
