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
  }

  /**
   * @return {Array[Player]} playerA
   */
  get players() {
    return [this.playerA, this.playerB];
  }

  getPlayerById(id) {
    return this.players.find((player) => player.id === id);
  }

  get game() {
    return {
      currentTurnPlayerId: this.currentTurnPlayerId,
      currentPhase: this.currentPhase,
      currentTurnNumber: this.currentTurnNumber,
      rockPaperScissorWinner: this.rockPaperScissorWinner,
    };
  }

  setWinner(id) {
    this.rockPaperScissorWinner = id;
    this.currentTurnPlayerId = id;
  }
}

module.exports = GameState;
