const Player = require('./Player');

class GameState {
  /**
   * @param {Player} playerA
   * @param {Player} playerB
   */
  constructor(playerA, playerB) {
    this.currentTurnPlayerId = 0;
    this.currentPhase = 'mulligan';
    this.currentTurnNumber = 1;
    this.rockPaperScissorWinner = null;

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
      currentTurnNumber: this.currentTurnNumber,
      rockPaperScissorWinner: this.rockPaperScissorWinner,
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
}

module.exports = GameState;
