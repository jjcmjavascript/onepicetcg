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
  loadDonFromDonPhase({ gameState, playerState }) {
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

  donPlus({ don, card }) {
    let newDon = don;
    let newCard = card;

    if (this.gameEffectsRules.donPlus({ don })) {
      const { result: cardWithNewAttack } = this.effects.sumAttack({
        card,
        mount: 1000,
      });

      const { card: cardWithUnderCard, underCard } = this.effects.pushUnder({
        card: cardWithNewAttack,
        underCard: newDon,
      });

      newCard = cardWithUnderCard;
      newDon = underCard;
    }

    return {
      don: newDon,
      card: newCard,
    };
  }

  refreshHandByRefreshPhase({ playerState }) {
    let leader = playerState.leader;
    let costs = playerState.costs;
    let characters = playerState.characters;

    if (leader.overCards.length > 0) {
      costs = [...costs, ...leader.overCards];
      leader.overCards = [];
    }

    characters.forEach((character) => {
      if (character.overCards.length > 0) {
        costs = [...costs, ...character.overCards];
        character.overCards = [];
      }
    });

    return {
      leader: this.effects.refresh([leader])[0],
      costs: this.effects.refresh(costs),
      characters: this.effects.refresh(characters),
    };
  }
}

module.exports = GameEffects;
