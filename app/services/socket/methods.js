const { v4: idGenerator } = require('uuid');
const types = require('../../helpers/cardTypes');
const { shuffle, deckDivider, formatCardsForDeck } = require('../../helpers');

const results = [
  { name: 'rock', beats: 'scissors' },
  { name: 'paper', beats: 'rock' },
  { name: 'scissors', beats: 'paper' },
];

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

const getConnectedSchema = (socket) => {
  return {
    socket,
    id: socket.id,
    isPlaying: false,
    deckId: null,
  };
};

const getRoomSchema = (playerA, playerB) => {
  return {
    [playerA.id]: {
      socket: playerA.socket,
      board: getBoardSchema(),
      rockPaperScissorChoice: null,
      deckId: playerA.deckId,
    },
    [playerB.id]: {
      socket: playerB.socket,
      board: getBoardSchema(),
      rockPaperScissorChoice: null,
      deckId: playerB.deckId,
    },
  };
};

const evaluateRockPaperScissors = (playerA, playerB) => {
  const playerAResult = results.find(
    (result) => result.name === playerA.rockPaperScissorChoice
  );
  const playerBResult = results.find(
    (result) => result.name === playerB.rockPaperScissorChoice
  );

  if (playerAResult.beats === playerBResult.name) {
    return playerA;
  }
  if (playerBResult.beats === playerAResult.name) {
    return playerB;
  }

  return null;
};

const removePlayerFromRoom = (socket, ioState) => {
  const roomsEntries = Object.entries(ioState.rooms);
  const roomIndex = roomsEntries.findIndex(([key, room]) => room[socket.id]);
  const [roomKey, room] = rooms[roomIndex];

  if (room) {
    const [playerA, playerB] = Object.values(room);

    playerA && (playerA.isPlaying = false);
    playerB && (playerB.isPlaying = false);
    delete ioState.rooms[roomKey];
  }
};

const setPlayersInRoom = ({ playerA, playerB, ioState }) => {
  const roomName = idGenerator();
  ioState.rooms[roomName] = getRoomSchema(playerA, playerB);

  playerA.isPlaying = true;
  playerB.isPlaying = true;

  playerA.socket.join(roomName);
  playerB.socket.join(roomName);

  return roomName;
};

const preparePlayerState = async ({
  playerA,
  playerB,
  ioState,
  database,
  roomName,
  callback,
}) => {
  let decks = await database.decks.scope(['structureForDeck']).findAll({
    where: {
      id: [playerA.deckId, playerB.deckId],
    },
  });

  decks = decks.map((deck) => deck.toJSON());

  const playerADeck = decks.find((deck) => deck.id === playerA.deckId);
  const playerBDeck = decks.find((deck) => deck.id === playerB.deckId);

  // prepare player A state
  const playerADeckStructure = formatCardsForDeck({
    deck: playerADeck,
    idGenerator,
    types,
  });
  const playerADeckSplitted = deckDivider({ deck: playerADeckStructure, types });
  const playerADeckShuffled = shuffle(playerADeckSplitted.characters);
  const livesA = playerADeckShuffled.splice(0, playerADeckSplitted.leader.lives);
  const handA = playerADeckShuffled.splice(0, 5);

  // prepare player B state
  const playerBDeckStructure = formatCardsForDeck({
    deck: playerBDeck,
    idGenerator,
    types,
  });
  const playerBDeckSplitted = deckDivider({ deck: playerBDeckStructure, types });
  const playerBDeckShuffled = shuffle(playerBDeckSplitted.characters);
  const livesB = playerBDeckShuffled.splice(0, playerBDeckSplitted.leader.lives);
  const handB = playerBDeckShuffled.splice(0, 5);

  // find player A/B state
  const playerAState = ioState.rooms[roomName][playerA.id];
  const playerBState = ioState.rooms[roomName][playerB.id];

  playerAState.board = {
    ...playerAState.board,
    don: playerADeckSplitted.don,
    leader: playerADeckSplitted.leader,
    deck: playerADeckShuffled,
    dons: playerADeckSplitted.dons,
    lives: livesA,
    hand: handA,
  };

  playerBState.board = {
    ...playerBState.board,
    don: playerBDeckSplitted.don,
    leader: playerBDeckSplitted.leader,
    deck: playerBDeckShuffled,
    dons: playerBDeckSplitted.dons,
    lives: livesB,
    hand: handB,
  };

  callback();
};

const removeWaiter = (ioState, socket) => {
  delete ioState.connected[socket.id];
};

const waiterExist = (ioState, socket) => {
  return ioState.connected[socket.id];
};

const setWaiter = (ioState, socket) => {
  ioState.connected[socket.id] = getConnectedSchema(socket);
};

/**
 * @param {Object SocketClient} clientSocket
 * @param {Object { room, choice }} payload
 * @param {Object ioState } state
 * @returns {Array} [playerA, playerB]
 */
const getPlayerChoise = ({ clientSocket, payload, state }) => {
  const room = state.rooms[payload.room];
  const [playerA, playerB] = Object.values(room);
  const currentPlayer = room[clientSocket.id];

  if (!currentPlayer.rockPaperScissorChoice) {
    currentPlayer.rockPaperScissorChoice = payload.choice;
  }

  return [playerA, playerB];
};

/**
 * @param {Object { socket, board, rockPaperScissorChoice, deckId}} PlayerA
 * @param {Object { socket, board, rockPaperScissorChoice, deckId}} PlayerB
 * @return {undefined}
 */
const clearPlayerChoiseFromResult = ({ result, playerA, playerB }) => {
  if (!result) {
    playerA.rockPaperScissorChoice = null;
    playerB.rockPaperScissorChoice = null;
  }
};

module.exports = {
  evaluateRockPaperScissors,
  removePlayerFromRoom,
  setPlayersInRoom,
  preparePlayerState,
  removeWaiter,
  waiterExist,
  setWaiter,
  getPlayerChoise,
  clearPlayerChoiseFromResult,
};
