const Client = require('../model/Client.js');
const Deal = require('../model/Deal.js');
const { isValidObjectId } = require('mongoose')

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
      volumes
    } = req.body;

    const client = new Client({
      firstName,
      lastName,
      phoneNumber,
      personType,
      cryptoWallet,
      volumes
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

  async getClient(req, res) {
    try {
      const id = req.params.id;

      if(!isValidObjectId(id)) {
        return res.status(400).json({
          resultCode: 1,
          data: [
            {
              message: "Client id is invalid"
            }
          ]
        })
      }

      const admin = await Client.findById({_id: id})

      if(!admin) {
        return res.status(404).json({
          resultCode: 1,
          data: [
            {
              message: "Client not found"
            }
          ]
        })
      }

      res.json({
        resultCode: 0,
        data: [
          admin
        ]
      })
    } catch(err) {
      console.log(err)
      res.status(500).json({
        resultCode: 1,
        data: [
          {
            message: "Unable to get the client"
          }
        ]
      })
    }
  }

  createDeal(req, res) {
    try {
      const id = req.params.id;

      const deal = new Deal({
        blockchainNetwork: req.body.blockchainNetwork,
        currency: req.body.currency,
        exchangeMethod: req.body.exchangeMethod,
        transactionAmount: req.body.transactionAmount,
        transactionCurrency: req.body.transactionCurrency
      })

      Client.findByIdAndUpdate({_id: id}, {$push: {paymentHistory: deal}}, {returnDocument: "after"}, (err, doc) => {
        if(err) {
          return res.status(400).json({
            resultCode: 1,
            data: [
              {
                message: "Unable to create a deal"
              }
            ]
          })
        }

        if(!doc) {
          return res.status(404).json({
            resultCode: 1,
            data: [
              {
                message: "The deal is not defined"
              }
            ]
          })
        }

        res.json({
          resultCode: 0,
          data: [
            doc
          ]
        })
      });

      
    } catch(err) {
      console.log(err);
      res.status(500).json({
        resultCode: 1,
        data: [
          {
            message: "Unable to create a deal"
          }
        ]
      })
    }
  }
}

module.exports = new ClientController;