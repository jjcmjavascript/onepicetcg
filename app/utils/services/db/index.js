import { Sequelize, Model, DataTypes } from 'sequelize';

const db = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});