const mysql = require('mysql2');
const dotenv = require('dotenv');

// For .env variable
dotenv.config()

// MYSQL CONNECTION

const con = mysql.createConnection({ // VALUES CAN BE STORED IN ENVIRONMENT VARIABLE
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

console.log("DB Connected!")


module.exports = con;