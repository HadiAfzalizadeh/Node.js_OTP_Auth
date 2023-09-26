const express = require('express');
const {
  signupRequestValidation,
  signupCheckCache,
  signUpCheckTtlZero,
} = require('@middlewares/auth');

const router = express.Router();

const authController = require('@controllers/auth');

router
  .route('/signup')
  .get(
    signupRequestValidation,
    signUpCheckTtlZero,
    signupCheckCache,
    authController.SignUp,
  );

module.exports = router;
