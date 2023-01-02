const { Op } = require('sequelize');

const { ParamsFormatter } = require('../../../helpers');

module.exports = (db, DataTypes) => {
  const CardModel = require('./Card')(db, DataTypes);
  const ColorModel = require('./Color')(db, DataTypes);
  const CategoryModel = require('./Category')(db, DataTypes);
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

  const structureForDeck = () => {
    return {
      include: [
        {
          model: CardModel,
          as: '_cards',
          through: {
            attributes: ['quantity'],
          },
          include: [
            '_image',
            '_image_full',
            '_type',
            {
              model: ColorModel,
              as: '_colors',
            },
            {
              model: CategoryModel,
              as: '_categories',
            },
          ],
        },
      ],
    };
  };

  deck.addScope('structureForDeck', structureForDeck);

  //RELATIONSHIPS
  deck.belongsToMany(CardModel, {
    through: PivotDeckCard,
    foreignKey: 'deck_id',
    otherKey: 'card_id',
    as: '_cards',
  });

  return deck;
};
