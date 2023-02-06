const { v4: uuidv4 } = require('uuid');

const getBoardSchema = () => {
  return {
    leader: null,
    don: null,
    stage: null,
    characters: [],
    costs: [],
    trash: [],
    dons: [],
    lives: [],
    deck: [],
  };
};

const getRoomSchema = (playerA, playerB) => {
  return {
    [playerA.id]: {
      socket: playerA.socket,
      board: getBoardSchema(),
    },
    [playerB.id]: {
      socket: playerB.socket,
      board: getBoardSchema(),
    },
  };
};

const separeDeck = (deck) => {
  const schema = getBoardSchema();
  const don = deck.find((card) => card.type_id === DON);
  const leader = deck.find((card) => card.type_id === LEADER);
  const dons = deck.filter((card) => card.type_id === DON);
  const cards = deck.filter(
    (card) => card.type_id !== DON && card.type_id !== LEADER
  );

  return {
    don,
    leader,
    cards,
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
  setPlayersInRoom: (playerA, playerB) => {
    const roomName = uuidv4();

    state.rooms[roomName] = getRoomSchema(playerA, playerB);

    playerA.isPlaying = true;
    playerB.isPlaying = true;
    playerA.socket.join(roomName);
    playerB.socket.join(roomName);

    return roomName;
  },
};

module.exports = state;
