const { Op } = require('sequelize');
const { ParamsFormatter } = require('../../../helpers');

module.exports = (db, DataTypes) => {
  const category = db.define(
    'categories',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      modelName: 'categories',
    }
  );

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
  category.getValidParamsFromRequestToCardsModule = (
    request,
    allowed = null
  ) => {
    return new ParamsFormatter()
      .validateAndSetRequest(request)
      .setAllowed(allowed || ['category', 'category_name'])
      .fromQuery()
      .get();
  };

  // Scopes
  category.addScope('filterById', filterById);
  category.addScope('filterByName', filterByName);
  category.addScope('common', (query) => {
    if (!query) return { where: {} };

    return {
      where: {
        ...filterById(query.category || query.id).where,
        ...filterByName(query.name || query.category_name).where,
      },
    };
  });

  return category;
};
