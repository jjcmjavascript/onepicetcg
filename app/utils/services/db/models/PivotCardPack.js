module.exports = (db, DataTypes) => {
    return db.define('pivot_cards_packs', {
        id: {
            type: DataTypes.INTEGER,
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
        pack_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: 'Id del pack de la carta',
            references: {
                model: 'packs',
                key: 'id'
            }
        }
    });
};