const Player = require('./Player');

class GameState {
  /**
   * @param {Player} playerA
   * @param {Player} playerB
   */
  constructor(playerA, playerB) {
    this.playerA = playerA;
    this.playerB = playerB;
    this.plays = [];

    this.currentTurnPlayerId = 0;
    this.currentPhase = 'mulligan';
    this.turnNumber = 1;
    this.rockPaperScissorWinner = null;
    this.playerTurnChoice = null;
    // this.locked = false;
    // this.selectionMode = null;

    this.pedingEffects = [];
    this.continuesEffects = [];
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
      // locked: this.locked,
      // selectionMode: this.selectionMode,
      pendingEffects: this.pendingEffects,
      continuesEffects: this.continuesEffects,
    };
  }

  setGameState({ gameState }) {
    this.currentTurnPlayerId = gameState.currentTurnPlayerId;
    this.currentPhase = gameState.currentPhase;
    this.turnNumber = gameState.turnNumber;
    this.rockPaperScissorWinner = gameState.rockPaperScissorWinner;
    this.playerTurnChoice = gameState.playerTurnChoice;
    // this.locked = gameState.locked;
    // this.selectionMode = gameState.selectionMode;
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

  // setLock(locked) {
  //   this.locked = locked;
  // }

  // setSelectionMode(mode) {
  //   this.selectionMode = mode;
  // }

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

  donPlus({ donUuid, cardUuid }) {
    // const player = this.getPlayerOnTurn();
    // const don = player.costs.find((don) => don.uuid === donUuid);
    // const card = player.characters.find((card) => card.uuid === cardUuid);
    // const { don: newDon, card: newCard } = this.effet.donPlus({ don, card });
    // player.mergeCharacter({ card: newCard });
    // player.mergeCost({ cost: newDon });
  }
}

module.exports = GameState;
