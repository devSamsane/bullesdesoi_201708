// Déclaration des librairies nodeJS
const path = require('path');

// Déclaration des librairies
const mongoose = require('mongoose');
const moment = require('moment');
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
 * Ne pas prendre un rendez-vous dans le passé
 * @return {boolean}
 */
AppointmentSchema.path('startDateTime').validate({
  isAsync: true,
  validator: function (value, respond) {
    let isValid = true;
    if (value < new Date()) {
      isValid = false;
    }
    respond(isValid);
  },
  message: 'Le rendez-vous ne peut pas être pris dans le passé'
});

/**
 * Vérification de la validité de la date et heure de réservation
 * Ne pas prendre 2 rendez-vous sur la même plage
 */
AppointmentSchema.path('startDateTime').validate({
  isAsync: true,
  validator: function (value, done) {

    // FIXME: Retirer la console
    console.log('_thisStart: ' + moment.utc(this.startDateTime));
    console.log('_thisEnd: ' + this.endDateTime);
    console.log('_this._id: ' + this._id);

    return mongoose.models.Appointment.find({
      '_id': { $ne: this._id },
      $or: [
        { startDateTime: { $lt: moment.utc(this.endDateTime), $gte: moment.utc(this.startDateTime) } },
        { endDateTime: { $lte: moment.utc(this.endDateTime), $gt: moment.utc(this.startDateTime) } }
      ]
    }, function (err, appointments) {
      done(!appointments || appointments.length === 0);
    });
  },
  message: 'Le rendez-vous est en conflit avec un autre'
});

// Création du model Appointment
mongoose.model('Appointment', AppointmentSchema);
