const { Op } = require('sequelize');

const { ParamsFormatter } = require('../../../helpers');

module.exports = (db, DataTypes) => {
  const CardModel = require('./Card')(db, DataTypes);
  const PivotDeckCard = require('./PivotDeckCard')(db, DataTypes);

  const deck = db.define(
    'decks',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Nombre del deck',
      },
    },
    {}
  );

  //RELATIONSHIPS
  deck.belongsToMany(CardModel, {
    through: PivotDeckCard,
    foreignKey: 'deck_id',
    otherKey: 'card_id',
    as: '_cards',
  });

  return deck;
};
