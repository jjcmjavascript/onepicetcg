class GameEffectsRules {
  constructor() {
    this.id = 1;

    console.log('GameEffectsRules');
  }

  drawCardByDrawPhase({
    currentTurnNumber,
    hand,
    deck,
    quantity: quantityToDraw,
  }) {
    return (
      currentTurnNumber != 1 && hand.length < 7 && deck.length >= quantityToDraw
    );
  }

  loadDonFronDonPhase({
    currentTurnNumber,
    dons,
    quantity: quantityToDraw,
  }) {
    return currentTurnNumber != 1 && dons.length >= quantityToDraw;
  }
}

module.exports = GameEffectsRules;
