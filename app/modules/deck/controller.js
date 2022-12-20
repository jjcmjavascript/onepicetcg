const db = require("../../services/database");
const { paginator } = require("../../helpers");
const filters = require("../../services/filters_service");

class DeckController {
  constructor() {
    this.deckService = db.decks;
    this.cardService = db.cards;
  }

  async getAllCards(request, response) {
    const { page } = request.query;

    const cardParams = db.cards.getValidParamsFromRequestToCardsModule(request);

    const colorParams =
      db.colors.getValidParamsFromRequestToCardsModule(request);

    const cards = await paginator(
      this.cardService.scope({
        method: ["common", cardParams],
      }),
      {
        page,
        include: [
          "_image",
          "_image_full",
          {
            model: db.colors.scope({ method: ["common", colorParams] }),
            as: "_colors",
          },
          {
            model: db.packs,
            as: "_pack",
          },
          {
            model: db.types,
            as: "_type",
          },
          {
            model: db.categories,
            as: "_categories",
          },
        ],
      }
    );

    return response.status(200).json(cards);
  }

  async getAllDecks(request, response) {
    const decks = await this.deckService.findAll();

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
}

module.exports = DeckController;
