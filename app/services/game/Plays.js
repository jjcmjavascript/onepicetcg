const Play = require('./Play');

class Plays {
  constructor(plays) {
    this.list = plays;
  }

  static getDefault() {
    return new Plays({
      1: [],
    });
  }

  merge({ turnNumber, play }) {
    const currentPlays = this.list[turnNumber] || [];
    return new Plays({
      ...this.list,
      [turnNumber]: [...currentPlays, new Play(play)],
    });
  }
}

module.exports = Plays;
