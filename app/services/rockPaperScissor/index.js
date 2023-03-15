class PaperRockScissors {
  constructor() {
    this.vs = {
      rock: {
        name: 'rock',
        beats: 'scissors',
      },
      paper: {
        name: 'paper',
        beats: 'rock',
      },
      scissors: {
        name: 'scissors',
        beats: 'paper',
      },
    };
  }

  evaluate(playerA, playerB) {
    const playerAChoice = this.vs[playerA.rockPaperScissorChoice];
    const playerBChoice = this.vs[playerB.rockPaperScissorChoice];

    if (playerAChoice.beats === playerBChoice.name) {
      return playerA;
    } else if (playerBChoice.beats === playerAChoice.name) {
      return playerB;
    }

    return null;
  }
}

module.exports = new PaperRockScissors;
