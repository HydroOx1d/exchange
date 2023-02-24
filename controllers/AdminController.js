const Admin = require('../model/Admin.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class AdminController {
  async createAdmin(req, res) {
    try {
      const { companyName, website, phoneNumber, licenseNumber, password} = req.body;

      // Проверка существования администратора с таким же номером телефона
      const adminExists = await Admin.findOne({ phoneNumber });
      if (adminExists) {
        return res.status(400).json({
          resutlCode: 1,
          data: [
            {
              message: "Admin is already registered"
            }
          ]
        });
      }

      // Хэширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание нового администратора
      const newAdmin = new Admin({
        companyName,
        website,
        phoneNumber,
        licenseNumber,
        password: hashedPassword
      });

      // Сохранение нового администратора в базе данных
      const admin = await newAdmin.save();

      // Генерация JWT токена для нового администратора
      const token = jwt.sign({ adminId: newAdmin._id }, process.env.JSONWEBTOKEN_SECRET_KEY, { expiresIn: '1h' });

      return res.status(201).json({
        resultCode: 0,
        data: [
          { 
            message: 'Admin succesfully registered', 
            token,
            admin
          }
        ]
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        resultCode: 1,
        data: [
          {
            message: 'An error occurred during administrator registration'
          }
        ]
      });
    }
  }

  async loginAdmin(req, res) {
    try {
      const { companyName, password } = req.body;

      const admin = await Admin.findOne({ companyName });

      if (!admin) {
        return res.status(404).json({
          resultCode: 1,
          data: [
            {
              message: "Administrator not found"
            }
          ]
        })
      }

      const isPasswordMatch = await bcrypt.compare(password, admin.password);

      if (!isPasswordMatch) {
        return res.status(400).json({
          resultCode: 1,
          data: [
            {
              message: "Incorrect company name or password"
            }
          ]
        })
      }

      const token = jwt.sign({ adminId: admin._id }, process.env.JSONWEBTOKEN_SECRET_KEY, { expiresIn: '1h' });

      res.json({
        resultCode: 0,
        data: [
          {
            message: "Successfully logged in",
            token,
            admin
          }
        ]
      })
    } catch(err) {
      console.log(err);
      res.status(500).json({
        resultCode: 1,
        data: [
          {
            message: "Authorization error"
          }
        ]
      })
    }
  }

  async getMe(req, res) {
    try {
      const admin = await Admin.findById({_id: req.adminId});

      if(!admin) {
        return res.status(404).json({
          resultCode: 1,
          data: [
            {
              message: "Admin is not defined"
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
            message: "Unable to get admin"
          }
        ]
      })
    }
  }
}

module.exports = new AdminController;