const express = require('express');

const app = express();

const router = require('./routes/auth.route');

const port = 3000;

app.use('/auth', router);

app.listen(port, () => console.log(`Express app running on port ${port}!`));
