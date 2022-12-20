const db = require("../../services/database");
const { paginator, ParamsFormatter } = require("../../helpers");
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
        method: ["toCardsModule", cardParams],
      }),
      {
        page,
        include: [
          "_image",
          "_image_full",
          {
            model: db.colors.scope({ method: ["toCardsModule", colorParams] }),
            as: "_colors",
          },
        ],
      }
    );

    return response.status(200).json(cards);
  }

  async getAllDecks(request, response) {}

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
