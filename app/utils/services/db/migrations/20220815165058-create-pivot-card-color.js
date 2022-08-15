'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('pivot_cards_colors', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            card_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Id de la carta',
                references: {
                    model: 'cards',
                    key: 'id'
                }
            },
            color_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Id del color de la carta (green, red, blue, purple)',
                references: {
                    model: 'colors',
                    key: 'id'
                }
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('pivot_cards_colors');
    }
};