const types = require('../../helpers/cardTypes');

const Effects = require('./Effects');
const GameEffects = require('./GameEffects');
const GameEffectsRules = require('./GameEffectsRules');
const GameState = require('./GameState');
const Player = require('./Player');
const GameDbBrige = require('./GameDbBridgeService');

class GameCore {
  constructor() {
    this.db = new GameDbBrige();
    this.effects = new GameEffects(new Effects(), new GameEffectsRules());
    this.games = {};
    this.connected = {};
  }

  get connectedArr() {
    return Object.values(this.connected).filter(
      (player) => player.socket.connected
    );
  }

  get notPlayingArr() {
    return this.connectedArr.filter((player) => !player.isPlaying);
  }

  get connectedCount() {
    return this.connectedArr.length;
  }

  get avaiblesToPlay() {
    return this.connectedArr.filter(
      (player) => !player.isPlaying && player.deckId
    );
  }

  get notPlayingCount() {
    return this.notPlayingArr.length;
  }

  get playingCount() {
    return this.connectedCount - this.notPlayingCount;
  }

  /**
   * @param {uuid} id usually uuidv4
   * @param {id} playerAId usually the socket id
   * @param {id} PlayerBId usually the socket id
   */
  async initNewGame({ stateId, playerAId, playerBId, callback }) {
    const playerA = {
      id: playerAId,
      deckId: this.connected[playerAId].deckId,
    };

    const playerB = {
      id: playerBId,
      deckId: this.connected[playerBId].deckId,
    };

    const decksFromDb = await this.db.getDecksByIds([
      playerA.deckId,
      playerB.deckId,
    ]);

    const decks = decksFromDb.map((deck) => deck.toJSON());
    const playerADeck = decks.find((deck) => deck.id === playerA.deckId);
    const playerBDeck = decks.find((deck) => deck.id === playerB.deckId);

    const PlayerA = new Player(playerA);
    const PlayerB = new Player(playerB);

    PlayerA.setDeckFromDeckModel(playerADeck);
    PlayerB.setDeckFromDeckModel(playerBDeck);

    this.games[stateId] = new GameState(PlayerA, PlayerB);

    callback && callback();
  }

  getStateById({ stateId }) {
    return this.games[stateId];
  }

  getPlayerBoardById({ stateId, playerId }) {
    const state = this.getStateById(stateId);

    return state.getPlayerById(playerId);
  }

  playerIsWaiting(playerId) {
    return Boolean(this.connected[playerId]);
  }

  setPlayerToWait({ clientSocket }) {
    this.connected[clientSocket.id] = this.getConnectedSchema({ clientSocket });
  }

  setDeckIdToConnectedPlayer({ playerId, deckId }) {
    this.connected[playerId].deckId = deckId;
  }

  setPlayerWinnerFromSelectorTurnGame({ stateId, playerId }) {
    const state = this.getStateById({ stateId });

    state.setWinner({ playerId });
  }

  getConnectedSchema({ clientSocket }) {
    return {
      id: clientSocket.id,
      isPlaying: false,
      deckId: null,
      socket: clientSocket,
    };
  }

  mulliganPhase({ didMulligan, stateId, playerId }) {
    const state = this.getStateById({ stateId });
    const player = state.getPlayerById({ playerId });

    console.log("didMulligan", didMulligan)
    if (didMulligan) {
      const deck = this.effects.shuffle([...player.deck, ...player.hand]);
      player.setHand(deck.splice(0, 5));
      player.setDeck(deck);
    }

    player.setLives(player.deck.splice(0, player.leader.lives));

    player.setMulligan(didMulligan);
  }

  isMulliganAvailable({ stateId }) {
    const state = this.getStateById({ stateId });

    return state.players.some((player) => player.mulliganAvailable);
  }

  drawPhase({ stateId }) {
    const gameState = this.getStateById({ stateId });
    const playerState = gameState.getPlayerOnTurn();

    const { hand, deck } = this.effects.drawCardByDrawPhase({
      gameState,
      playerState,
    });

    playerState.setHand(hand);
    playerState.setDeck(deck);
  }
}

module.exports = new GameCore();
