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
    }).populate("paymentHistory");
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

      const admin = await Client.findById({_id: id}).populate('paymentHistory').exec()

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

  async deleteClient(req, res) {
    try {
      const id = req.params.id

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          resultCode: 1,
          data: [
            {
              message: "Client id is invalid"
            }
          ]
        })
      }

      const client = await Client.findByIdAndDelete({_id: id})

      if(!client) {
        return res.status(404).json({
          resultCode: 1,
          data: [
            {
              message: "Client is not defined"
            }
          ]
        })
      }

      res.json({
        resultCode: 0,
        data: [
          {
            _id: client._id
          }
        ]
      })
    } catch(err) {
      console.log(err)
      res.status(500).json({
        resultCode: 1,
        data: [
          {
            message: "Unable to delete the client"
          }
        ]
      })
    }
  }

  async updateClient(req, res) {
    try {
      const id = req.params.id

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          resultCode: 1,
          data: [
            {
              message: "Client id is invalid"
            }
          ]
        })
      }

      const { firstName, lastName, phoneNumber, personType, cryptoWallet, volumes } = req.body

      Client.findByIdAndUpdate({_id: id}, {$set: {
        cryptoWallet: cryptoWallet,
        firstName: firstName,
        lastName: lastName,
        personType: personType,
        phoneNumber: phoneNumber,
        volumes: volumes
      }}, {returnDocument: "after"}, (err, doc) => {
        if(err) {
          console.log(err)
          return res.status(400).json({
            resultCode: 1,
            data: [
              {
                message: "Unable to update the client"
              }
            ]
          })
        }

        if(!doc) {
          return res.status(404).json({
            resultCode: 1,
            data: [
              {
                message: "Client is not defined"
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
      }).populate('paymentHistory')

      // const client = await Client.findByIdAndUpdate({_id: id}, {$set: {
        // cryptoWallet: cryptoWallet, 
        // firstName: firstName,
        // lastName: lastName,
        // personType: personType,
        // phoneNumber: phoneNumber,
        // volumes: volumes
      // }}).populate("cryptoWallet").exec()

      // if(!client) {
      //   return res.status(404).json({
      //     resultCode: 1,
      //     data: [
      //       {
      //         message: "Client is not defined"
      //       }
      //     ]
      //   })
      // }

      // console.log(firstName)

      // res.json({
      //   resultCode: 0,
      //   data: [
      //     client
      //   ]
      // })
    } catch(err) {
      console.log(err)
      res.status(500).json({
        resultCode: 1,
        data: [
          {message: "Unable to update the client"}
        ]
      })
    }
  }

  async createDeal(req, res) {
    try {
      const id = req.params.id;

      if (!isValidObjectId(id)) {
        return res.status(400).json({
          resultCode: 1,
          data: [
            {
              message: "Client id is invalid"
            }
          ]
        })
      }

      const deal = new Deal({
        blockchainNetwork: req.body.blockchainNetwork,
        currency: req.body.currency,
        exchangeMethod: req.body.exchangeMethod,
        transactionAmount: req.body.transactionAmount,
        transactionCurrency: req.body.transactionCurrency
      })

      await deal.save()

      Client.findByIdAndUpdate({_id: id}, {$push: {paymentHistory: deal._id}}, {returnDocument: "after"}, (err, doc) => {
        if(err) {
          console.log(err)
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
      }).populate("paymentHistory");

      
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

  updateDeal(req, res) {
    try {
      const clientId = req.params.id
      const dealId = req.params.dealId

      if(!isValidObjectId(dealId) || !isValidObjectId(clientId)) {
        res.status(400).json({
          resultCode: 1,
          data: [
            {
              message: "Id is not valid"
            }
          ]
        })
      }

      Deal.findByIdAndUpdate({_id: dealId}, {$set: {...req.body}}, {returnDocument: "after"}, (err, doc) => {
        if(err) {
          return res.status(400).json({
            resultCode: 1,
            data: [
              {
                message: "Unable to update the deal"
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
      })
      

    } catch(err) {
      console.log(err)
      res.status(500).json({
        resultCode: 1,
        data: [
          {
            message: "Unable to update the deal"
          }
        ]
      })
    }
  }

  async deleteDeal(req, res) {
    try {
      const dealId = req.params.dealId

      if (!isValidObjectId(dealId)) {
        res.status(400).json({
          resultCode: 1,
          data: [
            {
              message: "Id is not valid"
            }
          ]
        })
      }

      const deal = await Deal.findByIdAndDelete({_id: dealId})

      if(!deal) {
        return res.json(404).json({
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
          { _id: deal._id }
        ]
      })
    } catch(err) {
      console.log(err)
      res.status(500).json({
        resultCode: 1,
        data: [
          {
            message: "Unable to delete the deal"
          }
        ]
      })
    }
  }
}

module.exports = new ClientController;