"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pivot_cards_effects", {
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
      effect_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Id efecto de la carta",
        references: {
          model: "effects",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pivot_cards_effects");
  },
};
