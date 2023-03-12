const { v4: idGenerator } = require('uuid');
const types = require('../../helpers/cardTypes');
const { shuffle, deckDivider, formatCardsForDeck } = require('../../helpers');
const { getConnectedSchema, getRoomSchema } = require('./schemas');
const gameEffects = require('./effects');

const evaluateRockPaperScissors = (playerA, playerB) => {
  const results = [
    { name: 'rock', beats: 'scissors' },
    { name: 'paper', beats: 'rock' },
    { name: 'scissors', beats: 'paper' },
  ];

  const playerAResult = results.find(
    (result) => result.name === playerA.rockPaperScissorChoice
  );
  const playerBResult = results.find(
    (result) => result.name === playerB.rockPaperScissorChoice
  );

  if (playerAResult.beats === playerBResult.name) {
    return playerA;
  } else if (playerBResult.beats === playerAResult.name) {
    return playerB;
  }

  return null;
};

const getCurrentPlayerAndRivalId = ({ room, ioState }) => {
  const { currentTurnPlayerId, playerAId, playerBId } =
    ioState.rooms[room].game;

  return {
    currentTurnPlayerId: currentTurnPlayerId,
    rivalPlayerId: currentTurnPlayerId === playerAId ? playerBId : playerAId,
  };
};

const getCurrentBoardFromClientSocket = ({ clientSocket, room, ioState }) => {
  const currentRoom = ioState.rooms[room];

  return currentRoom[clientSocket.id].board;
};

const setNewBoardToClientSocket = ({
  clientSocket,
  room,
  ioState,
  newBoard,
}) => {
  let currentRoom = ioState.rooms[room];

  currentRoom[clientSocket.id].board = newBoard;
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
  const playerADeckSplitted = deckDivider({
    deck: playerADeckStructure,
    types,
  });
  const playerADeckShuffled = shuffle(playerADeckSplitted.characters);
  const handA = playerADeckShuffled.splice(0, 5);

  // prepare player B state
  const playerBDeckStructure = formatCardsForDeck({
    deck: playerBDeck,
    idGenerator,
    types,
  });
  const playerBDeckSplitted = deckDivider({
    deck: playerBDeckStructure,
    types,
  });
  const playerBDeckShuffled = shuffle(playerBDeckSplitted.characters);
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
    lives: [],
    hand: handA,
  };

  playerBState.board = {
    ...playerBState.board,
    don: playerBDeckSplitted.don,
    leader: playerBDeckSplitted.leader,
    deck: playerBDeckShuffled,
    dons: playerBDeckSplitted.dons,
    lives: [],
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
const getPlayerChoise = ({ clientSocket, payload, ioState }) => {
  const room = ioState.rooms[payload.room];
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

const setWinnerInGameState = ({ ioState, roomName, winner }) => {
  const room = ioState.rooms[roomName];

  room.game.rockPaperScissorWinner = winner;
  room.game.currentTurnPlayerId = winner;
};

const mulligan = ({
  socket,
  clientSocket,
  payload,
  ioState,
  callbacks: { emitMulligan, emitRivalMulligan },
}) => {
  const room = ioState.rooms[payload.room];
  const currentPlayer = room[clientSocket.id];
  const currentPlayerBoard = currentPlayer.board;
  const game = room.game;

  // format board for mulligan
  if (payload.mulligan) {
    const deck = shuffle([
      ...currentPlayerBoard.deck,
      ...currentPlayerBoard.hand,
    ]);
    const hand = deck.splice(0, 5);

    currentPlayerBoard.deck = deck;
    currentPlayerBoard.hand = hand;
  }

  currentPlayerBoard.lives = currentPlayerBoard.deck.splice(
    0,
    currentPlayerBoard.leader.lives
  );

  // set config for mulligan
  game[clientSocket.id].mulligan.did = payload.mulligan;
  game[clientSocket.id].mulligan.available = false;

  // board emit
  const { playerAId, playerBId } = room.game;

  emitMulligan({
    socket,
    playerId: clientSocket.id,
    payload: {
      room: payload.room,
      board: currentPlayerBoard,
    },
  });

  emitRivalMulligan({
    socket,
    playerId: clientSocket.id === playerAId ? playerBId : playerAId,
    payload: {
      room: payload.room,
      board: currentPlayerBoard,
    },
  });
};

const checkMulliganEnd = ({
  socket,
  payload,
  clientSocket,
  ioState,
  callbacks: { emitGameRefreshPhase, emitGameRivalRefreshPhase },
}) => {
  const room = ioState.rooms[payload.room];
  const game = room.game;
  const { playerAId, playerBId } = game;

  if (
    !game[playerAId].mulligan.available &&
    !game[playerBId].mulligan.available
  ) {
    const { currentTurnPlayerId, rivalPlayerId } = getCurrentPlayerAndRivalId({
      room: payload.room,
      ioState,
    });

    const board = getCurrentBoardFromClientSocket({
      clientSocket,
      room: payload.room,
      ioState,
    });

    emitGameRefreshPhase({
      socket,
      playerId: currentTurnPlayerId,
      payload: {
        room: payload.room,
        board,
      },
    });

    emitGameRivalRefreshPhase({
      socket,
      playerId: rivalPlayerId,
      payload: {
        room: payload.room,
        board,
      },
    });
  }
};

const drawPhase = ({
  socket,
  clientSocket,
  payload,
  ioState,
  callbacks: { emitPhaseDraw, emitRivalPhaseDraw },
}) => {
  const currentBoard = getCurrentBoardFromClientSocket({
    clientSocket,
    room: payload.room,
    ioState,
  });

  const game = ioState.rooms[payload.room].game;
  const board = gameEffects.draw(
    currentBoard,
    game.currentTurnNumber == 1 ? 0 : 1
  );

  setNewBoardToClientSocket({
    clientSocket,
    room: payload.room,
    ioState,
    board,
  });

  const { currentTurnPlayerId, rivalPlayerId } = getCurrentPlayerAndRivalId({
    room: payload.room,
    ioState,
  });

  emitPhaseDraw({
    socket,
    playerId: currentTurnPlayerId,
    payload: {
      room: payload.room,
      board,
    },
  });

  emitRivalPhaseDraw({
    socket,
    playerId: rivalPlayerId,
    payload: {
      board,
      room: payload.room,
    },
  });
};

const donPhase = ({
  socket,
  clientSocket,
  payload,
  ioState,
  callbacks: { emitPhaseDon, emitRivalPhaseDon },
}) => {
  const game = ioState.rooms[payload.room].game;
  const currentBoard = getCurrentBoardFromClientSocket({
    clientSocket,
    room: payload.room,
    ioState,
  });

  const board = gameEffects.don(
    currentBoard,
    game.currentTurnNumber == 1 ? 1 : 2
  );

  setNewBoardToClientSocket({
    clientSocket,
    room: payload.room,
    ioState,
    board,
  });

  const { currentTurnPlayerId, rivalPlayerId } = getCurrentPlayerAndRivalId({
    room: payload.room,
    ioState,
  });

  emitPhaseDon({
    socket,
    playerId: currentTurnPlayerId,
    payload: {
      room: payload.room,
      board,
    },
  });

  emitRivalPhaseDon({
    socket,
    playerId: rivalPlayerId,
    payload: {
      board,
      room: payload.room,
    },
  });
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
  setWinnerInGameState,
  mulligan,
  checkMulliganEnd,
  getCurrentPlayerAndRivalId,
  drawPhase,
  donPhase,
};
