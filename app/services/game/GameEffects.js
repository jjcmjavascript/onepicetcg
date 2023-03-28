const { shuffle } = require('../../helpers');

class GameEffects {
  constructor(effects, gameEffectsRules) {
    this.effects = effects;
    this.gameEffectsRules = gameEffectsRules;
  }

  /**
   * @param {GameState} game
   * @param {PlayerState} playerState
   * @returns {PlayerState, GameState}
   */
  drawCardByDrawPhase({ gameState, playerState }) {
    let newHand = [];
    let newDeck = [];

    const canDraw = this.gameEffectsRules.drawCardByDrawPhase({
      currentTurnNumber: gameState.currentTurnNumber,
      hand: playerState.hand,
      deck: playerState.deck,
      quantity: 1,
    });

    if (canDraw) {
      const { result, changed } = this.effects.drawFromTop(playerState.deck, 1);
      newHand = result;
      newDeck = changed;
    }

    return {
      hand: newHand,
      deck: newDeck,
    };
  }

  /**
   * @param {GameState} game
   * @param {PlayerState} playerState
   * @returns {PlayerState, GameState}
   */
  loadDonFronDonPhase(gameState, playerState) {
    const canDraw = this.gameEffectsRules.loadDonFronDonPhase({
      currentTurnNumber: gameState.currentTurnNumber,
      dons: playerState.dons,
      quantity: 1,
    });

    if (canDraw) {
      const { result, changed } = this.effects.drawFromTop(playerState.dons, 1);

      playerState.costs = playerState.hand.concat(result);
      playerState.dons = changed;
    }

    return {
      playerState,
      gameState,
    };
  }

  shuffle(arr) {
    return shuffle(arr);
  }
}

module.exports = GameEffects;
