('use strict');

const mysql = require('mysql2');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}
let envString = process.env.NODE_ENV.toUpperCase();

const pool = mysql.createPool({
    host: process.env['DB_HOST_' + envString],
    database: process.env['DB_DATABASE_' + envString],
    port: process.env['DB_PORT_' + envString],
    user: process.env['DB_USER_' + envString],
    password: process.env['DB_PASSWORD_' + envString],
    timezone: 'Z',
    multipleStatements: true,
    connectionLimit: 10
});

// connection.connect(err => {
//     if (err) throw err;
//     // console.log('Connection to database established.');
// });

module.exports = pool;
