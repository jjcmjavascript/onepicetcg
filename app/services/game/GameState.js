const Player = require('./Player');

class GameState {
  constructor(playerAId, PlayerBId) {
    this.currentTurnPlayerId = 0;
    this.currentPhase = 'mulligan';
    this.currentTurnNumber = 1;
    this.rockPaperScissorWinner = null;

    this.playerAId = playerAId;
    this.playerBId = PlayerBId;

    this.playerA = new Player(playerAId);
    this.playerB = new Player(PlayerBId);
  }
}

module.exports = GameState;
