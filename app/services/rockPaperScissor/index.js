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

    this.rooms = {};
  }

  init({ playerA, playerB, roomId }) {
    if (!this.rooms[roomId]) {
      this.rooms[roomId] = {
        playerA,
        playerB,
        winner: null,
      };
    }
  }

  setChoise({ roomId, playerId, choice }) {
    const room = this.rooms[roomId];

    if (room.playerA.id === playerId && !room.playerA.rockPaperScissorChoice) {
      room.playerA.rockPaperScissorChoice = choice;
    } else if (
      room.playerB.id === playerId &&
      !room.playerB.rockPaperScissorChoice
    ) {
      room.playerB.rockPaperScissorChoice = choice;
    }
  }

  clearChoise({ roomId }) {
    const room = this.rooms[roomId];

    room.playerA.rockPaperScissorChoice = null;
    room.playerB.rockPaperScissorChoice = null;
  }

  avaibleToEval({ roomId }) {
    const room = this.rooms[roomId];
    const { playerA, playerB } = room;

    return Boolean(
      playerA.rockPaperScissorChoice && playerB.rockPaperScissorChoice
    );
  }
  /**
   * @returns {Player} winner
   */
  evaluate({ roomId }) {
    const room = this.rooms[roomId];
    const { playerA, playerB } = room;
    const playerAChoice = this.vs[playerA.rockPaperScissorChoice];
    const playerBChoice = this.vs[playerB.rockPaperScissorChoice];

    if (playerAChoice.beats === playerBChoice.name) {
      return playerA;
    } else if (playerBChoice.beats === playerAChoice.name) {
      return playerB;
    }

    return null;
  }

  destroy({ roomId }) {
    delete this.rooms[roomId];
  }
}

module.exports = new PaperRockScissors();
