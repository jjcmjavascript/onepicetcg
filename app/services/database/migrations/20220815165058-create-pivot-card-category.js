"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pivot_cards_categories", {
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
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Id de la categoria de la carta",
        references: {
          model: "categories",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pivot_cards_categories");
  },
};
