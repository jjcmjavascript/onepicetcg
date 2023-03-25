const db = require('../database');

class GameDbBrige {
  constructor() {
    this.db = db;
  }

  async getDecksByIds(ids) {
    return await this.db.decks.scope(['structureForDeck']).findAll({
      where: {
        id: ids,
      },
    });
  }
}

module.exports = new GameDbBrige();
