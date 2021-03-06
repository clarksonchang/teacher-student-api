('use strict');

const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const router = require('./routes/apiRoutes');

// Init express
const app = express();

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
let envString = process.env.NODE_ENV.toUpperCase();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/api', router);

app.listen(port, () => console.log(`Server (${envString}) is listening on port ${port}`));

module.exports = app;
