"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("effects", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Efecto de la carta",
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: "Descripción del efecto",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("effects");
  },
};
