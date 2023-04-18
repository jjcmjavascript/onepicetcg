const Player = require('./Player');

class GameState {
  /**
   * @param {Player} playerA
   * @param {Player} playerB
   */
  constructor(playerA, playerB, gameState = {}) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.plays = gameState.plays || {
      1: [],
    };

    this.currentTurnPlayerId = gameState.currentTurnPlayerId || 0;
    this.currentPhase = gameState.currentPhase || 'mulligan';
    this.turnNumber = gameState.turnNumber || 1;
    this.rockPaperScissorWinner = gameState.rockPaperScissorWinner || null;
    this.playerTurnChoice = gameState.playerTurnChoice || null;

    this.mode = gameState.mode || null;
    this.pendingEffects = gameState.pendingEffects || [];
    this.continuesEffects = gameState.continuesEffects || [];
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

  setGameState({ gameState }) {
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

  donPlus({ donUuid, cardUuid }) {
    // const player = this.getPlayerOnTurn();
    // const don = player.costs.find((don) => don.uuid === donUuid);
    // const card = player.characters.find((card) => card.uuid === cardUuid);
    // const { don: newDon, card: newCard } = this.effet.donPlus({ don, card });
    // player.mergeCharacter({ card: newCard });
    // player.mergeCost({ cost: newDon });
  }

  merge(gameState) {
    return new GameState(this.playerA, this.playerB, {
      ...this.game,
      ...gameState,
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
