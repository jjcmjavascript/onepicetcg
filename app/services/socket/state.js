const { v4: uuidv4 } = require('uuid');
const { DON, LEADER } = require('../../helpers/cardTypes');
const shuffle = require('../../helpers/shuffle');

function formatCardsForDeck(deck) {
  const don = deck._cards.find((card) => card.type_id === DON);
  const cards = [];

  deck._cards.forEach((card) => {
    const quantity = card.pivot_decks_cards.quantity;
    for (let i = 0; i < quantity; i++) {
      cards.push({
        ...card,
        uuid: uuidv4(),
      });
    }
  });

  for (let i = 0; i < 9; i++) {
    cards.push({
      ...don,
      uuid: uuidv4(),
    });
  }

  return decks;
}

const separeDeck = (deck) => {
  const don = deck.find((card) => card.type_id === DON);
  const leader = deck.find((card) => card.type_id === LEADER);
  const dons = deck.filter((card) => card.type_id === DON);
  const characters = deck.filter(
    (card) => card.type_id !== DON && card.type_id !== LEADER
  );

  return {
    don,
    leader,
    characters,
    dons,
  };
};

const getConnectedSchema = (socket) => {
  return {
    socket,
    id: socket.id,
    isPlaying: false,
    activeDeck: null,
  };
};

const state = {
  connected: {},
  rooms: {},

  get connectedArr() {
    return (
      Object.values(this.connected).filter(
        (player) => player.socket.connected
      ) || []
    );
  },
  get notPlayingArr() {
    return this.connectedArr.filter((player) => !player.isPlaying);
  },
  get connectedCount() {
    return this.connectedArr.length;
  },
  get notPlayingCount() {
    return this.notPlayingArr.length;
  },
  get playingCount() {
    return this.connectedCount - this.notPlayingCount;
  },
  get roomsCount() {
    return Object.values(this.rooms).length;
  },
  removeWaiter: (socket) => {
    delete state.connected[socket.id];
  },
  waiterExist(socket) {
    return this.connected[socket.id];
  },
  setWaiter: (socket) => {
    state.connected[socket.id] = getConnectedSchema(socket);
  },
  separeDeck,
  formatCardsForDeck,
  shuffle,
};

module.exports = state;
