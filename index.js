require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const ClientController = require('./controllers/ClientController.js');
const AdminController = require('./controllers/AdminController.js');

const checkAuth = require('./middleware/checkauth.js');
const { handleValidation } = require('./middleware/handleValidation.js')

const { adminRegisterValidation, clientCreateValidation } = require('./validations/index.js')

const mode = process.env.mode === 'development'

mode && mongoose.connect(process.env.MONGODB_SERVER)
  .then(() => console.log('db'))
  .catch((err) => console.log('Error: ', err));


const app = express();

app.use(express.json());


app.get('/clients', ClientController.getClients);
app.post('/clients', clientCreateValidation, handleValidation, checkAuth, ClientController.createClient);

app.post('/admin/register', adminRegisterValidation, handleValidation, AdminController.createAdmin);
app.post('/admin/login', AdminController.loginAdmin);

if(mode) {
  console.log(mode)
  app.listen(8080, (err) => {
    if (err) console.log('Ошибка запуска сервера', err);
    console.log("Listen")
  })
}

module.exports = app;