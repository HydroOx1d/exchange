
const jwt = require('jsonwebtoken')

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace('Bearer', '').trim()

  if (token) {
    try {
      const isVerify = jwt.verify(token, process.env.JSONWEBTOKEN_SECRET_KEY)

      req.adminId = isVerify.adminId

      next()
    } catch (err) {
      console.log(err)
      res.status(404).json({
        resultCode: 1,
        data: [
          { message: "You don't have rights" }
        ]
      })
    }
  } else {
    res.status(403).json({
      resultCode: 1,
      data: [
        { message: "You don't have rights" }
      ]
    })
  }
}

module.exports = checkAuth;