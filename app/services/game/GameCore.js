const Effects = require('./Effects');
const GameEffects = require('./GameEffects');
const GameEffectsRules = require('./GameEffectsRules');

class GameCore {
  constructor() {
    this.effects = new GameEffects(new Effects(), new GameEffectsRules());
    this.games = {};
  }

  /**
   * @param {uuid} id usually the socket room id
   * @param {GameState} gameState
   */
  initNewGame(id, gameState) {
    this.games[id] = gameState;
  }

  getBoardById(id) {
    return this.games[id];
  }
}

module.exports = new GameCore();
