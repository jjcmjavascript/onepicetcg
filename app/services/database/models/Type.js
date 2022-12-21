const { Op } = require("sequelize");
const { ParamsFormatter } = require("../../../helpers");

module.exports = (db, DataTypes) => {
  const type = db.define(
    "types",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        comment: "Nombre del tipo de carta",
      },
    },
    {}
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
  type.getValidParamsFromRequestToCardsModule = (request, allowed = null) => {
    return new ParamsFormatter()
      .validateAndSetRequest(request)
      .setAllowed(allowed || ["type", "type_name"])
      .fromQuery()
      .get();
  };

  // Scopes
  type.addScope("filterById", filterById);
  type.addScope("filterByName", filterByName);
  type.addScope("common", (query) => {
    if (!query) return { where: {} };

    return {
      where: {
        ...filterById(query.type || query.id).where,
        ...filterByName(query.name || query.type_name).where,
      },
    };
  });

  return type;
};
