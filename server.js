const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/apiRoutes');

// Init express
const app = express();

// Init environment (dev, test, prod)
dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`) });
console.log(process.env.ENVIRONMENT);

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// app.use('/', (req, res) => {
//     res.send({ response: 'I am alive' }).status(200);
// });

app.use('/api', router);

app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;
