const Admin = require('../model/Admin.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class AdminController {
  async createAdmin(req, res) {
    try {
      const { companyName, website, phoneNumber, licenseNumber, password, role } = req.body;

      // Проверка наличия всех полей
      if (!companyName || !website || !phoneNumber || !licenseNumber || !password || !role) {
        return res.status(400).json({ message: 'Пожалуйста, заполните все поля' });
      }

      // Проверка существования администратора с таким же номером телефона
      const adminExists = await Admin.findOne({ phoneNumber });
      if (adminExists) {
        return res.status(400).json({ message: 'Администратор с таким номером телефона уже зарегистрирован' });
      }

      // Хэширование пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создание нового администратора
      const newAdmin = new Admin({
        companyName,
        website,
        phoneNumber,
        licenseNumber,
        password: hashedPassword,
        role
      });

      // Сохранение нового администратора в базе данных
      await newAdmin.save();

      // Генерация JWT токена для нового администратора
      const token = jwt.sign({ adminId: newAdmin._id }, process.env.JSONWEBTOKEN_SECRET_KEY, { expiresIn: '1h' });

      return res.status(201).json({ message: 'Администратор успешно зарегистрирован', token });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Произошла ошибка при регистрации администратора' });
    }
  }

  async loginAdmin(req, res) {
    const { companyName, password } = req.body;

    const admin = await Admin.findOne({ companyName });

    if (!admin) {
      return res.status(404).json({message: "Администратор не найден"})
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if(!isPasswordMatch) {
      return res.status(400).json({message: "Неправильное имя компании или пароль"})
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JSONWEBTOKEN_SECRET_KEY, { expiresIn: '1h' });

    res.json({
      message: "Успешно авторизован",
      token
    })
  }
}

module.exports = new AdminController;