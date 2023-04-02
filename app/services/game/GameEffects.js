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
    let newHand = playerState.hand;
    let newDeck = playerState.deck;

    const canDraw = this.gameEffectsRules.drawCardByDrawPhase({
      turnNumber: gameState.turnNumber,
      hand: newHand,
    });

    if (canDraw) {
      const { result, changed } = this.effects.drawFromTop(newDeck, 1);

      newHand = [...result, ...newHand];
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
  loadDonFronDonPhase({ gameState, playerState }) {
    const { result, changed } = this.effects.drawFromTop(
      playerState.dons,
      gameState.turnNumber > 1 ? 2 : 1
    );

    return {
      costs: [...result, ...playerState.costs],
      dons: changed,
    };
  }

  /**
   * @param {Array} game
   * @returns {Array}
   */
  shuffle(arr) {
    return shuffle(arr);
  }

  refreshCard(arr, quantity = 0) {
    return this.effects.refresh(arr, quantity);
  }
}

module.exports = GameEffects;
