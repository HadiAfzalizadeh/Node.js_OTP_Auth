const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth.controller');

router.get('/SendVerificationCode', authController.SendVerificationCode);

module.exports = router;
