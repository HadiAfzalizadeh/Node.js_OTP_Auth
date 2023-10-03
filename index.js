const bodyParser = require('body-parser');
require('module-alias/register');
const express = require('express');
const { globalErrorHandler } = require('@middlewares/errorhandlers');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

app.use(bodyParser.json());

const router = require('@routes/auth');

const port = process.env.PORT;

app.use('/auth', router);

app.use(globalErrorHandler);

app.listen(port, () => {});

module.exports = app;
