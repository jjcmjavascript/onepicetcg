class Player {
  constructor(id) {
    this.id = id;
    this.deckId = 0;
    this.rockPaperScissorChoice = null;

    this.leader = null;
    this.don = null;
    this.stage = null;
    this.characters = [];
    this.costs = [];
    this.trash = [];
    this.dons = [];
    this.lives = [];
    this.deck = [];
    this.hand = [];
  }

  get board() {
    return {
      leader: this.leader,
      don: this.don,
      stage: this.stage,
      characters: this.characters,
      costs: this.costs,
      trash: this.trash,
      dons: this.dons,
      lives: this.lives,
      deck: this.deck,
      hand: this.hand,
    };
  }
}

module.exports = Player;
