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
}

module.exports = GameState;
