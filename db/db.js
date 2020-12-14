const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, `../config/${process.env.ENVIRONMENT}.env`) });

('use strict');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    timezone: 'Z',
    multipleStatements: true
});

connection.connect(err => {
    if (err) throw err;
    // console.log('Connection to database established.');
});

module.exports = connection;
