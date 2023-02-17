const Client = require('../model/Client.js');

class ClientController {
  getClients(req, res) {
    Client.find({}, (err, clients) => {
      if (err) {
        res.status(500).json({
          resultCode: 1,
          data: [
            { 
              message: 'Unable to get a list of clients' 
            }
          ]
        });
      } else {
        res.status(200).json({
          resultCode: 0,
          data: clients
        });
      }
    });
  }
  
  createClient(req, res) {
    const {
      firstName,
      lastName,
      phoneNumber,
      personType,
      cryptoWallet,
      currency,
      blockchainNetwork,
      volumes,
      paymentHistory,
      exchangeMethod,
      transactionAmount,
      transactionCurrency
    } = req.body;

    const client = new Client({
      firstName,
      lastName,
      phoneNumber,
      personType,
      cryptoWallet,
      currency,
      blockchainNetwork,
      volumes,
      paymentHistory,
      exchangeMethod,
      transactionAmount,
      transactionCurrency
    });

    client.save((err) => {
      if (err) {
        res.status(500).json({
          resultCode: 1,
          data: [
            { message: 'Unable to save client list' }
          ]
        });
      } else {
        res.status(201).json({
          resultCode: 0,
          data: [
            client
          ]
        });
      }
    });
  }
}

module.exports = new ClientController;