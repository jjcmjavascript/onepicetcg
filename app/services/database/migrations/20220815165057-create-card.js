'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cost: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Costo de la carta',
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Nombre de la carta',
      },
      other_name: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Nombre de la carta',
      },
      power: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Poder de la carta',
      },
      is_alternative: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Tipo de la carta (Leader, Character, etc)',
      },
      pack_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Id del pack de la carta',
      },
      card_number: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Numero de la carta',
      },
      code: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Codigo de la carta pack id mas numero',
      },
      card_text: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Texto de la carta',
      },
      image_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      full_image_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      blocker: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rush: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      counter: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      lives: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      banish: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      double_attack: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      don_rest: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      don_remove: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      don_set: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      trigger: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      attack_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      eu_usable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
      },
      asia_usable: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0,
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
    await queryInterface.dropTable('cards');
  },
};
