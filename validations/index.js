const { body } = require('express-validator');

const adminRegisterValidation = [
  body('companyName', 'Company name is required').isString().notEmpty(),
  body('website', 'Web site is required').isURL(),
  body('phoneNumber', 'Phone number is required').notEmpty(),
  body('licenseNumber', 'License number is required').isString().notEmpty(),
  body('password', 'Password is required').isString().notEmpty(),
];

const clientCreateValidation = [
  body('firstName').isString().notEmpty(), 
  body('lastName').isString().notEmpty(), 
  body('phoneNumber').isString().notEmpty(), 
  body('personType').isIn(['physical', 'legal']).notEmpty(),
  body('cryptoWallet').isString().notEmpty(),
  body('currency').isString().notEmpty(),
  body('blockchainNetwork').isString().notEmpty(),
  body('volumes').isNumeric().notEmpty(),
  body('paymentHistory').isArray(),
  body('exchangeMethod').isIn(['cash', 'non-cash']).notEmpty(),
  body('transactionAmount').isNumeric().notEmpty(),
  body('transactionCurrency').isIn(['USD', 'KGS']).notEmpty(),
];

module.exports = {
  adminRegisterValidation,
  clientCreateValidation
}