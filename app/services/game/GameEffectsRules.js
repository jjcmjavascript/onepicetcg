class GameEffectsRules {
  constructor() {
    this.id = 1;
  }

  drawCardByDrawPhase({ turnNumber, hand }) {
    return turnNumber > 1 && hand.length < 7;
  }

  donPlus({ don }) {
    return !don.rested;
  }
}

module.exports = GameEffectsRules;
