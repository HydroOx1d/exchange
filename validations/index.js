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
  body('volumes').isNumeric().notEmpty(),
];

const createClientsDeal = [
  body('transactionCurrency').isIn(['USD', 'KGS']).withMessage('Transaction currency must be USD or KGS'),
  body('currency').not().isEmpty().withMessage('Currency is required'),
  body('blockchainNetwork').not().isEmpty().withMessage('Blockchain network is required'),
  body('transactionAmount').isFloat({ min: 0 }).withMessage('Transaction amount must be a positive number'),
  body('exchangeMethod').isIn(['cash', 'non-cash']).withMessage('Exchange method must be cash or non-cash')
]

module.exports = {
  adminRegisterValidation,
  clientCreateValidation,
  createClientsDeal
}