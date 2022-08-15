module.exports = (() => {
    const { db, DataTypes } = require('../services/db');

    return db.define('cards', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cost: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        power: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pack_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        card_numero: {
            type: DataTypes.STRING,
            allowNull: true
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: true
        },
        card_text: {
            type: DataTypes.TEXT,
            allowNull: true
        }

        //urlsUrls
        // leader : {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // character : {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // stage : {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // event : {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
        // don : {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: false
        // },
    }, {
        
    });
})();