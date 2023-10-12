const bodyParser = require('body-parser');
require('module-alias/register');
const express = require('express');
const { globalErrorHandler } = require('@middlewares/errorhandlers');
const { protect } = require('@middlewares/auth');
const router = require('@routes/auth');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.use(bodyParser.json());

const port = process.env.PORT;

app.use('/auth', router);

app.use(protect);

app.use(globalErrorHandler);

app.listen(port, () => {});

module.exports = app;

// TODO - solve eslint errors in project
// TODO - make app modular
// TODO - check for sign up should not be logged in right now
