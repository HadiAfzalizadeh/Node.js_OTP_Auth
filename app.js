const NodeCache = require('node-cache');
const express = require('express');
const {
  globalErrorHandler,
} = require('./middlewares/errorhandlers.middleware');

const verificationCache = new NodeCache();
const app = express();

const router = require('./routes/auth.route');

const port = 3000;

app.use('/auth', router);

app.use(globalErrorHandler);

app.listen(port, () => console.log(`Express app running on port ${port}!`));
