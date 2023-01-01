'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pivot_cards_types', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Id de la carta',
      },
      type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Id del tipo de la carta (leader, event, stage, character)',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pivot_cards_types');
  },
};
