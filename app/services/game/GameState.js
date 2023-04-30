const Player = require('./Player');
const Plays = require('./Plays');
class GameState {
  /**
   * @param {Player} playerA
   * @param {Player} playerB
   */
  constructor(playerA, playerB, gameState) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.plays = gameState.plays;

    this.currentTurnPlayerId = gameState.currentTurnPlayerId;
    this.currentPhase = gameState.currentPhase;
    this.turnNumber = gameState.turnNumber;
    this.rockPaperScissorWinner = gameState.rockPaperScissorWinner;
    this.playerTurnChoice = gameState.playerTurnChoice;

    this.mode = gameState.mode;
    this.pendingEffects = gameState.pendingEffects;
    this.continuesEffects = gameState.continuesEffects;
  }

  static getDefault() {
    return {
      plays: Plays.getDefault(),
      currentTurnPlayerId: 0,
      currentPhase: '',
      turnNumber: 1,
      rockPaperScissorWinner: null,
      playerTurnChoice: null,
      mode: null,
      pendingEffects: [],
      continuesEffects: [],
    };
  }
  /**
   * @return {Array[Player]} playerA
   */
  get players() {
    return [this.playerA, this.playerB];
  }

  get game() {
    return {
      plays: this.plays,
      mode: this.mode,
      currentTurnPlayerId: this.currentTurnPlayerId,
      currentPhase: this.currentPhase,
      turnNumber: this.turnNumber,
      rockPaperScissorWinner: this.rockPaperScissorWinner,
      playerTurnChoice: this.playerTurnChoice,
      pendingEffects: this.pendingEffects,
      continuesEffects: this.continuesEffects,
    };
  }

  get currentPlays() {
    return this.plays[this.turnNumber] || [];
  }

  setGameState(gameState) {
    this.mode = gameState.mode;
    this.currentTurnPlayerId = gameState.currentTurnPlayerId;
    this.currentPhase = gameState.currentPhase;
    this.turnNumber = gameState.turnNumber;
    this.rockPaperScissorWinner = gameState.rockPaperScissorWinner;
    this.playerTurnChoice = gameState.playerTurnChoice;
    this.pendingEffects = gameState.pendingEffects;
    this.continuesEffects = gameState.continuesEffects;
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
    const opponent = this.getOtherPlayerById({ playerId });

    this.playerTurnChoice = choice;

    if (choice === 'first') {
      this.setTurnPlayerId(playerId);
    } else {
      this.setTurnPlayerId(opponent.id);
    }
  }

  merge(gameState) {
    return new GameState(this.playerA, this.playerB, {
      ...this.game,
      ...gameState,
    });
  }

  mergePlay(play) {
    return this.merge({
      plays: this.plays.merge({
        turnNumber: this.turnNumber,
        play: {
          playerId: this.currentTurnPlayerId,
          inTheirTurn: this.currentTurnPlayerId === play.playerId,
          ...play,
        },
      }),
    });
  }

  changePlayerTurn() {
    this.currentTurnPlayerId =
      this.currentTurnPlayerId === this.playerA.id
        ? this.playerB.id
        : this.playerA.id;
  }

  changeTurn() {
    this.changePlayerTurn();
    this.turnNumber += 1;
  }
}

module.exports = GameState;
