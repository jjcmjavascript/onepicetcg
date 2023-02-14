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

const getconnectedschema = (socket) => {
  return {
    socket,
    id: socket.id,
    isPlaying: false,
  };
};

const state = {
  connecteds: {},
  rooms: {},
  get connectedsCount() {
    return Object.values(this.connecteds).length;
  },
  get roomsCount() {
    return Object.values(this.rooms).length;
  },
  removeWaiter: (socket) => {
    delete state.connecteds[socket.id];
  },
  waiterExist(socket) {
    return this.connecteds[socket.id];
  },
  setWaiter: (socket) => {
    state.connecteds[socket.id] = getconnectedschema(socket);
  },
  separeDeck,
  formatCardsForDeck,
  shuffle,
};

module.exports = state;
