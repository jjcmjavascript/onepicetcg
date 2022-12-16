module.exports = (db, DataTypes) => {
  const FileModel = require("./File")(db, DataTypes);
  const Colors = require("./Color")(db, DataTypes);
  const PivotCardColor = require("./PivotCardColor")(db, DataTypes);

  const card = db.define(
    "cards",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cost: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Costo de la carta",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Nombre de la carta",
      },
      other_name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Nombre de la carta",
      },
      power: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Poder de la carta",
      },
      is_alternative: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "Tipo de la carta (Leader, Character, etc)",
      },
      pack_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: "Id del pack de la carta",
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      card_number: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Numero de la carta",
      },
      card_text: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Texto de la carta",
      },
      image_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "files",
          key: "id",
        },
      },
      full_image_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "files",
          key: "id",
        },
      },
      blocker: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      rush: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      counter: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      banish: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      double_attack: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      don_rest: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      don_remove: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      don_set: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      trigger: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      attack_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {}
  );

  //RELATIONSHIPS
  card.belongsTo(FileModel, {
    foreignKey: "image_id",
    targetKey: "id",
    as: "_image",
  });

  card.belongsTo(FileModel, {
    foreignKey: "full_image_id",
    targetKey: "id",
    as: "_image_full",
  });
  
  card.belongsToMany(Colors, {
    through: "pivot_cards_colors",
    foreignKey: "card_id",
    otherKey: "color_id",
    as: "_colors",
  });

  return card;
};
