const express = require('express');
const {
  signupRequestValidation,
  signupCheckCache,
  signUpCheckTtlZero,
} = require('../middlewares/auth.middleware');

const router = express.Router();

const authController = require('../controllers/auth.controller');

router
  .route('/signup')
  .get(
    signupRequestValidation,
    signUpCheckTtlZero,
    signupCheckCache,
    authController.SignUp,
  );

module.exports = router;
