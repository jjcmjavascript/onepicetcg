module.exports = (db, DataTypes) => {
  return db.define(
    "effects",
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
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Descripción del efecto",
      },
    },
    {
      modelName: "effects",
    }
  );
};
