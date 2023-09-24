const express = require('express');
const {
  globalErrorHandler,
} = require('./middlewares/errorhandlers.middleware');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();

const router = require('./routes/auth.route');

const port = process.env.PORT;

app.use('/auth', router);

app.use(globalErrorHandler);

app.listen(port, () => console.log(`Express app running on port ${port}!`));
