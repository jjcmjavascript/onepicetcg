const { ParamsFormatter } = require('../../../helpers');

const { Op } = require('sequelize');

module.exports = (db, DataTypes) => {
  const color = db.define('colors', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      comment: 'Nombre del color',
      allowNull: false,
    },
  });

  // Scopes Methods
  const filterById = (ids) => {
    if (!ids) return { where: {} };

    ids = Array.isArray(ids) ? ids : [ids];

    return {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    };
  };

  const filterByName = (name) => {
    if (!name) return { where: {} };

    return {
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    };
  };

  // Methods
  color.getValidParamsFromRequestToCardsModule = (request, allowed = null) => {
    return new ParamsFormatter()
      .validateAndSetRequest(request)
      .setAllowed(allowed || ['color', 'color_name'])
      .fromQuery()
      .get();
  };

  // Scopes
  color.addScope('filterById', filterById);
  color.addScope('filterByName', filterByName);
  color.addScope('common', (query) => {
    if (!query) return { where: {} };

    return {
      where: {
        ...filterById(query.color || query.id).where,
        ...filterByName(query.name || query.color_name).where,
      },
    };
  });

  return color;
};
