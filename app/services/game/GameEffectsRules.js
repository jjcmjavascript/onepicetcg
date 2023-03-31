class GameEffectsRules {
  constructor() {
    this.id = 1;
  }

  drawCardByDrawPhase({
    currentTurnNumber,
    hand,
  }) {
    return (
      currentTurnNumber > 1 && hand.length < 7
    );
  }
}

module.exports = GameEffectsRules;
