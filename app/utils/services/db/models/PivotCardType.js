module.exports = (db, DataTypes) => {
    return db.define('pivot_cards_types', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Id de la carta',
            references: {
                model: 'cards',
                key: 'id'
            }
        },
        type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Id del tipo de la carta (leader, event, stage, character)',
            references: {
                model: 'types',
                key: 'id'
            }
        }
    });
};