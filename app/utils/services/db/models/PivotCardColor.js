module.exports = (db, DataTypes) => {
    return db.define('pivot_cards_colors', {
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
        color_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: 'Id del color de la carta (green, red, blue, purple)',
            references: {
                model: 'colors',
                key: 'id'
            }
        }
    },{
        timestamps: false,
    });
};