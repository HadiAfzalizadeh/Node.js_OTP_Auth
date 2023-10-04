const express = require('express');
const {
  signUpRequestValidation,
  signUpCheckCache,
  signInRequestValidation,
  signInCheckCache,
  signInValidateVerificationCode,
} = require('@middlewares/auth');

const router = express.Router();

const authController = require('@controllers/auth');

router
  .route('/signup')
  .get(signUpRequestValidation, signUpCheckCache, authController.SignUp);

router
  .route('/signin')
  .post(
    signInRequestValidation,
    signInCheckCache,
    signInValidateVerificationCode,
    authController.SignIn,
  );

module.exports = router;
