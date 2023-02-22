const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  transactionCurrency: { type: String, enum: ['USD', 'KGS'], required: true },
  currency: { type: String, required: true },
  blockchainNetwork: { type: String, required: true },
  transactionAmount: { type: Number, required: true },
  exchangeMethod: { type: String, enum: ['cash', 'non-cash'], required: true }
}, {
  timestamps: true
});

const Deal = mongoose.model('Deal', dealSchema);

module.exports = Deal;