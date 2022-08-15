module.exports = (db, DataTypes) => {
    const card = db.define('cards', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cost: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Costo de la carta'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Nombre de la carta'
        },
        power: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Poder de la carta'
        },
        is_alternative :{
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Tipo de la carta (Leader, Character, etc)'
        },
        pack_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Id del pack de la carta'
        },
        card_numero: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Numero de la carta'
        },
        codigo: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Codigo de la carta pack id mas numero'
        },
        card_text: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Texto de la carta'
        },
        image_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'files',
                key: 'id'
            }
        },
        full_image_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'files',
                key: 'id'
            }
        }
    }, {
        
    });

    return card;
};