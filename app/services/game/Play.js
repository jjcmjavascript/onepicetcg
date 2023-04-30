class Play {
  constructor(play) {
    this.name = play.name || null;
    this.card = play.card || null;
    this.playerId = play.playerId || null;
    this.inTheirTurn = play.inThemTurn || false;
  }

  get isCard() {
    return this.card !== null;
  }
}

module.exports = Play;
