const { validationResult } = require('express-validator')


const handleValidation = (req, res, next) => {
  const errors = validationResult(req)

  if(errors.isEmpty()) {
    next();
    return;
  }

  res.status(400).json({
    resultCode: 1,
    data: errors
  })
}

module.exports = {
  handleValidation
}