module.exports = (() => {
  const { Sequelize, Model, DataTypes } = require('sequelize');

  const mode = process.env.MODE;

  db = new Sequelize(
    mode == 'dev' ? process.env.TEST_DB_NAME : process.env.DB_NAME, 
    process.env.DB_USER,
    process.env.DB_PASS,{
      host: process.env.DB_HOST,
      dialect: process.env.DB_MOTOR
    });

  db.sync();

  return { db, Sequelize, Model, DataTypes };
})();