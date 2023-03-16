const { v4: idGenerator } = require('uuid');
const types = require('../../helpers/cardTypes');
const { shuffle, deckDivider, formatCardsForDeck } = require('../../helpers');
const { getConnectedSchema, getRoomSchema } = require('./schemas');

const Game = require('../game/GameCore');

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

const setNewBoardToClientSocket = ({ clientSocket, room, ioState, board }) => {
  let currentRoom = ioState.rooms[room];

  currentRoom[clientSocket.id].board = board;
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

const setPlayersInRoom = ({ playerA, playerB }) => {
  const roomName = idGenerator();

  playerA.isPlaying = true;
  playerB.isPlaying = true;

  playerA.socket.join(roomName);
  playerB.socket.join(roomName);

  return roomName;
};

const removeWaiter = (ioState, socket) => {
  delete ioState.connected[socket.id];
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

  const board = Game.effects.drawCardByDrawPhase(currentBoard);

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

  const board = Game.effects.loadDonFronDonPhase(
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
      room: payload.room,
      board,
    },
  });
};

module.exports = {
  removePlayerFromRoom,
  setPlayersInRoom,
  removeWaiter,
  setWinnerInGameState,
  mulligan,
  checkMulliganEnd,
  getCurrentPlayerAndRivalId,
  drawPhase,
  donPhase,
};
