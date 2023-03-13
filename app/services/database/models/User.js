const { Op } = require('sequelize');

const { ParamsFormatter } = require('../../../helpers');

module.exports = (db, DataTypes) => {
  const user = db.define(
    'users', 
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'email del usuario'
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'password del usuario'
      },
    },
    {}
  );

  const filterByEmail = (email) => {
    if (!email) return { where: {} };

    return {
      where: {
        email: {
          [Op.regexp]: email,
        },
      },
    };
  };

  user.addScope('filterByEmail', filterByEmail);

  return user;
}