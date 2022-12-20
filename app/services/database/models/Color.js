const { ParamsFormatter } = require("../../../helpers");

const { Op } = require("sequelize");

module.exports = (db, DataTypes) => {
  const color = db.define("colors", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      comment: "Nombre del color",
      allowNull: false,
    },
  });

  // Scopes Methods
  const byId = (ids) => {
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

  const byName = (name) => {
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
  color.getValidParamsFromRequestToCardsModule = (request) => {
    return new ParamsFormatter()
    .validateAndSetRequest(request)
    .setAllowed(["color", "color_name"])
    .fromQuery()
    .get();
  };

  // Scopes
  color.addScope("byId", byId);

  color.addScope("toCardsModule", (query) => {
    let result = { where: {} };

    if (!query) return result;

    if (query.color) {
      result.where = {
        ...result.where,
        ...byId(query.color).where,
      };
    }

    if (query.name || query.color_name) {
      result.where = {
        ...result.where,
        ...byName(query.name || query.color_name).where,
      };
    }

    return result;
  });

  return color;
};
