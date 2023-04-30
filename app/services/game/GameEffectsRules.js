class GameEffectsRules {
  constructor() {
    this.id = 1;
  }

  drawCardByDrawPhase({ turnNumber, hand }) {
    return turnNumber > 1 && hand.length < 7;
  }
}

module.exports = GameEffectsRules;
