module.exports = (db, DataTypes) => {
  return db.define(
    'pivot_decks_cards',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Cantidad de cartas',
      },
      card_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Id de la carta',
        references: {
          model: 'cards',
          key: 'id',
        },
      },
      deck_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Id del deck',
        references: {
          model: 'decks',
          key: 'id',
        },
      },
    },
    {
      timestamps: false,
    }
  );
};
