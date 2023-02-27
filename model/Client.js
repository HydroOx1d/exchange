const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  personType: { type: String, enum: ['physical', 'legal'], required: true },
  cryptoWallet: { type: String, required: true },
  volumes: { type: Number, required: true },
  paymentHistory: { type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deal",
      required: true
    }
  ], default: []}
}, {
  versionKey: false
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;