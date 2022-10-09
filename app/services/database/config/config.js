require('dotenv').config();

if(!process.env.MODE){
  require('dotenv').config({
      path: '../../../.env'
  });
}

const config = {
  "dev": {
    "username": process.env.TEST_DB_USER,
    "password": process.env.TEST_DB_PASS,     
    "database": process.env.TEST_DB_NAME,
    "dialect": 'mysql',
    "host": process.env.TEST_DB_HOST,
    "port": process.env.TEST_DB_POST,
  },
  "prod": {
    "username": process.env.TEST_DB_USER,
    "password": process.env.TEST_DB_PASS,
    "database": process.env.TEST_DB_NAME,
    "dialect": 'mysql',
    "host": process.env.TEST_DB_HOST,
    "port": process.env.TEST_DB_POST,
  },
}

module.exports = config;