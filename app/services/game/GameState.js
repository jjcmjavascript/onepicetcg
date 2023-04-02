const Player = require('./Player');

class GameState {
  /**
   * @param {Player} playerA
   * @param {Player} playerB
   */
  constructor(playerA, playerB) {
    this.currentTurnPlayerId = 0;
    this.currentPhase = 'mulligan';
    this.turnNumber = 1;
    this.rockPaperScissorWinner = null;
    this.playerTurnChoice = null;

    this.playerA = playerA;
    this.playerB = playerB;

    this.plays = [];
  }

  /**
   * @return {Array[Player]} playerA
   */
  get players() {
    return [this.playerA, this.playerB];
  }

  get game() {
    return {
      currentTurnPlayerId: this.currentTurnPlayerId,
      currentPhase: this.currentPhase,
      turnNumber: this.turnNumber,
      rockPaperScissorWinner: this.rockPaperScissorWinner,
      playerTurnChoice: this.playerTurnChoice,
    };
  }

  setWinner({ playerId }) {
    this.rockPaperScissorWinner = playerId;
    this.currentTurnPlayerId = playerId;
  }

  getCurrentPlayerAndOpponent({ playerId }) {
    const player = this.getPlayerById({ playerId });
    const opponent = this.players.find((player) => player.id !== playerId);

    return [player, opponent];
  }

  getPlayerOnTurn() {
    return this.getPlayerById({ playerId: this.currentTurnPlayerId });
  }

  getPlayerById({ playerId }) {
    return this.players.find((player) => player.id === playerId);
  }

  getOtherPlayerById({ playerId }) {
    return this.players.find((player) => player.id !== playerId);
  }

  setTurnPlayerId(playerId) {
    this.currentTurnPlayerId = playerId;
  }

  setPhase(phase) {
    this.currentPhase = phase;
  }

  setPlayerTurnFromPlayerChoice({ playerId, choice }) {
    const player = this.getPlayerById({ playerId });
    const opponent = this.getOtherPlayerById({ playerId });

    this.playerTurnChoice = choice;

    if (player.choice === 'first') {
      this.setTurnPlayerId(playerId);
    } else {
      this.setTurnPlayerId(opponent.id);
    }
  }
}

module.exports = GameState;
