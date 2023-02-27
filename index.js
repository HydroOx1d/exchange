require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

const ClientController = require('./controllers/ClientController.js');
const AdminController = require('./controllers/AdminController.js');

const checkAuth = require('./middleware/checkauth.js');
const { handleValidation } = require('./middleware/handleValidation.js')

const { adminRegisterValidation, clientCreateValidation, createClientsDeal } = require('./validations/index.js')

const mode = process.env.mode === 'development'

mode && mongoose.connect(process.env.MONGODB_SERVER)
  .then(() => console.log('db'))
  .catch((err) => console.log('Error: ', err));


const app = express();

app.use(express.json());
app.use(cors())

app.get('/clients', ClientController.getClients);
app.get('/clients/:id', ClientController.getClient)
app.post('/clients', clientCreateValidation, handleValidation, checkAuth, ClientController.createClient);
app.delete('/clients/:id', checkAuth, ClientController.deleteClient)
app.patch('/clients/:id', clientCreateValidation, handleValidation, checkAuth, ClientController.updateClient)

app.post('/clients/:id/deal', createClientsDeal, handleValidation, checkAuth, ClientController.createDeal)
app.patch('/clients/:id/deal/:dealId', createClientsDeal, handleValidation, checkAuth, ClientController.updateDeal)
app.delete('/clients/:id/deal/:dealId', checkAuth, ClientController.deleteDeal)

app.post('/admin/register', adminRegisterValidation, handleValidation, AdminController.createAdmin);
app.post('/admin/login', AdminController.loginAdmin);
app.get('/admin/me', checkAuth, AdminController.getMe)

if(mode) {
  console.log(mode)
  app.listen(8080, (err) => {
    if (err) console.log('Ошибка запуска сервера', err);
    console.log("Listen")
  })
}

module.exports = app;