const express = require('express');

const router = express.Router();

const authController = require('@controllers/auth');

router.route('/signup').get(authController.SignUp);

router.route('/signin').post(authController.SignIn);

module.exports = router;
