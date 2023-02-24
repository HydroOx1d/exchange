const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  website: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super-admin'], default: 'admin' }
}, {
  versionKey: false
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;