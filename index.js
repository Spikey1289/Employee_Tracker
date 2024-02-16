const mysql = require('msql2/promise');
const inquirer = require('inquirer');
require('dotenv').config();

const db = /*await*/ mysql.createConnection({
    host: process.env.HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});