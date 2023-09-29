const express = require('express');
const {
  signUpRequestValidation,
  signUpCheckCache,
} = require('@middlewares/auth');

const router = express.Router();

const authController = require('@controllers/auth');

router
  .route('/signup')
  .get(signUpRequestValidation, signUpCheckCache, authController.SignUp);

router.route('/signin').post(authController.SignIn);

module.exports = router;
