const Play = require('./Play');

class Plays {
  constructor(plays) {
    this.plays = plays;
  }

  static getDefault() {
    return new Plays({
      1: [],
    });
  }

  merge({ turnNumber, play }) {
    const currentPlays = this.plays[turnNumber] || [];
    return new Plays({
      ...this.plays,
      [turnNumber]: [...currentPlays, new Play(play)],
    });
  }
}

module.exports = Plays;
