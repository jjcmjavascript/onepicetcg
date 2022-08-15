'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('packs', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: Sequelize.STRING,
                comment: 'Nombre del pack'
            },
            fecha_lanzamiento: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Año del pack'
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
        await queryInterface.dropTable('packs');
    }
};