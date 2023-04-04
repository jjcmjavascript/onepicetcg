class GameEffectsRules {
  constructor() {
    this.id = 1;
  }

  drawCardByDrawPhase({ turnNumber, hand }) {
    return turnNumber > 1 && hand.length < 7;
  }

  donPlus({ don , characters}) {
    return !don.rested && characters.length > 0;
  }
}

module.exports = GameEffectsRules;
