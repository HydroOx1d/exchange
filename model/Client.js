const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  personType: { type: String, enum: ['physical', 'legal'], required: true },
  cryptoWallet: { type: String, required: true },
  volumes: { type: Number, required: true },
  paymentHistory: { type: Array, default: []}
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;


/* 


  transactionCurrency: { type: String, enum: ['USD', 'KGS'], required: true }

currency: { type: String, required: true },
  blockchainNetwork: { type: String, required: true },


  transactionAmount: { type: Number, required: true },
  exchangeMethod: { type: String, enum: ['cash', 'non-cash'], required: true },
  cryptoWallet: { type: String, required: true },

*/