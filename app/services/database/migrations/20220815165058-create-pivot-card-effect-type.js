"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pivot_cards_effect_types", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Id de la carta",
        references: {
          model: "cards",
          key: "id",
        },
      },
      effect_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Id efecto de la carta",
        references: {
          model: "effect_types",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pivot_cards_effect_types");
  },
};
