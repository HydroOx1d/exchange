require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const ClientController = require('./controllers/ClientController.js');
const AdminController = require('./controllers/AdminController.js');

const checkAuth = require('./middleware/checkauth.js');

mongoose.connect(process.env.MONGODB_SERVER)
.then(() => console.log('db'))
.catch((err) => console.log('Error: ', err));


const app = express();

app.use(express.json());


app.get('/clients', ClientController.getClients);
app.post('/clients', checkAuth, ClientController.createClient);

app.post('/admin/register', AdminController.createAdmin);
app.post('/admin/login', AdminController.loginAdmin);

app.listen(8080, (err) => {
  if (err) console.log('Ошибка запуска сервера', err);
  console.log("Listen")
})