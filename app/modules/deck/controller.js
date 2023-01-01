const db = require('../../services/database');
const { paginator, deckRules } = require('../../helpers');
const filters = require('../../services/filters_service');

class DeckController {
  constructor() {
    this.dbDeck = db.decks;
    this.dbCard = db.cards;
    this.dbPivotDeckCard = db.pivot_decks_cards;
  }

  async getAllCards(request, response) {
    const { page } = request.query;
    const cardParams = db.cards.getValidParamsFromRequestToCardsModule(request);

    const cards = await paginator(
      this.dbCard.scope({
        method: ['common', cardParams],
      }),
      {
        page,
        include: [
          '_image',
          '_image_full',
          {
            model: db.colors,
            as: '_colors',
            where: cardParams.color ? { id: cardParams.color } : null,
          },
          {
            model: db.types,
            as: '_type',
            where: cardParams.type ? { id: cardParams.type } : null,
          },
          {
            model: db.categories,
            as: '_categories',
            where: cardParams.category ? { id: cardParams.category } : null,
          },
        ],
      }
    );

    return response.status(200).json(cards);
  }

  async getAllDecks(request, response) {
    const decks = await this.dbDeck.findAll();

    return response.status(200).json(decks);
  }

  async getFilters(_, response) {
    return response.status(200).json({
      costs: filters.costs,
      attacks: filters.attacks,
      types: await filters.types(),
      packs: await filters.packs(),
      colors: await filters.colors(),
      categories: await filters.categories(),
    });
  }

  async saveDeck(request, response) {
    const transaction = await db.sequelize.transaction();

    try {
      const { cards, name } = request.body;

      const deck = await this.dbDeck.create({
        name,
      });

      const formatCardsToInsert = cards.reduce((acc, card_id) => {
        if (!acc[card_id]) {
          acc[card_id] = { quantity: 0, card_id, deck_id: deck.id };
        }
        acc[card_id].quantity += 1;
        return acc;
      }, {});

      const cardsToInsert = Object.values(formatCardsToInsert);

      await this.dbPivotDeckCard.bulkCreate(cardsToInsert);

      await transaction.commit();

      const findDeck = await this.dbDeck.findOne({
        where: { id: deck.id },
        include: [
          {
            model: this.dbCard,
            as: '_cards',
            through: {
              attributes: ['quantity'],
            },
          },
        ],
      });

      return response.status(200).json({
        deck: findDeck,
        success: 'Deck saved successfully',
      });
    } catch (e) {
      if (transaction.state === 'pending') {
        await transaction.rollback();
      }
      return response.status(500).json({
        errors: ['Error saving deck'],
      });
    }
  }
}

module.exports = DeckController;
