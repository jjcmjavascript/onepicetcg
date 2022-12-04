require('dotenv').config();

const config = {
  "dev": {
    "username": process.env.TEST_DB_USER,
    "password": process.env.TEST_DB_PASS,     
    "database": process.env.TEST_DB_NAME,
    "dialect": 'mysql',
    "host": process.env.TEST_DB_HOST,
    "port": process.env.TEST_DB_PORT,
    // "socketPath":'/var/run/mysqld/mysqld.sock'
  },
  "prod": {
    "username": process.env.TEST_DB_USER,
    "password": process.env.TEST_DB_PASS,
    "database": process.env.TEST_DB_NAME,
    "dialect": 'mysql',
    "host": process.env.TEST_DB_HOST,
    "port": process.env.TEST_DB_PORT,
    // "socketPath":'/var/run/mysqld/mysqld.sock'
  },
}

module.exports = config;