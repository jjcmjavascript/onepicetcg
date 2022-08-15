'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cards', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            cost: {
                type: Sequelize.STRING,
                allowNull: false,
                comment: 'Costo de la carta'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Nombre de la carta'
            },
            power: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Poder de la carta'
            },
            is_alternative: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            type_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Tipo de la carta (Leader, Character, etc)'
            },
            pack_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Id del pack de la carta'
            },
            card_numero: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Numero de la carta'
            },
            codigo: {
                type: Sequelize.STRING,
                allowNull: true,
                comment: 'Codigo de la carta pack id mas numero'
            },
            card_text: {
                type: Sequelize.TEXT,
                allowNull: true,
                comment: 'Texto de la carta'
            },
            image_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            full_image_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cards');
    }
};