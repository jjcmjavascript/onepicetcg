'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pivot_decks_cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Cantidad de cartas',
      },
      card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Id de la carta',
        references: {
          model: 'cards',
          key: 'id',
        },
      },
      deck_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Id del deck',
        references: {
          model: 'decks',
          key: 'id',
        },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pivot_decks_cards');
  },
};
