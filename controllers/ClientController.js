const Client = require('../model/Client.js');

class ClientController {
  getClients(req, res) {
    Client.find({}, (err, clients) => {
      if (err) {
        res.status(500).json({ error: 'Невозможно получить список клиентов' });
      } else {
        res.status(200).json(clients);
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
        res.status(500).json({ error: 'Невозможно сохранить список клиентов' });
      } else {
        res.status(201).json(client);
      }
    });
  }
}

module.exports = new ClientController;