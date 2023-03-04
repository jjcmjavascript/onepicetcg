const constants = require('./constants');
const methods = require('./methods');

const emitDuelJoin = (socket, payload = {}) => {
  console.log(constants.DUEL_JOIN);
  socket.emit(constants.DUEL_JOIN, payload);
};
const emitDuelRoomJoin = (socket, payload) => {
  console.log(constants.GAME_ROOM_JOIN, payload.room);
  socket.of('/duel').to(payload.room).emit(constants.GAME_ROOM_JOIN, payload);
};

const emitDuelInitRockPaperScissors = (socket, payload) => {
  console.log(constants.GAME_ROCK_SCISSORS_PAPER_START);
  socket
    .of('/duel')
    .to(payload.room)
    .emit(constants.GAME_ROCK_SCISSORS_PAPER_START, payload);
};

const emitDuelRockPaperScissorsResult = (socket, payload) => {
  console.log(constants.GAME_ROCK_SCISSORS_PAPER_RESULT, payload);
  socket
    .of('/duel')
    .to(payload.room)
    .emit(constants.GAME_ROCK_SCISSORS_PAPER_RESULT, payload);
};

const emitDuelCanceled = (socket, payload) => {
  console.log(constants.GAME_ROOM_CANCEL);
  socket.of('/duel').emit(constants.GAME_ROOM_CANCEL, payload);
};

/**
 * @param {Object SocketIo} socket
 * @param {Object {room}} payload
 */
const emitBoardState = ({ socket, payload, ioState }) => {
  console.log(constants.GAME_BOARD_STATE);
  const [playerA, playerB] = Object.values(ioState.rooms[payload.room]);

  socket.of('/duel').to(playerA.socket.id).emit(constants.GAME_BOARD_STATE, {
    room: payload.room,
    board: playerA.board,
    name: 'Player A',
  });

  socket.of('/duel').to(playerB.socket.id).emit(constants.GAME_BOARD_STATE, {
    room: payload.room,
    board: playerB.board,
    name: 'Player B',
  });
};

const emitGameState = ({ socket, payload, ioState }) => {
  console.log(constants.GAME_STATE);

  socket.of('/duel').to(payload.room).emit(constants.GAME_STATE, {
    room: payload.room,
    game: ioState.rooms[payload.room].game,
  });
};

/**
 * @param {Object SocketIo} socket
 * @param {Object SocketIo} clientSocket
 * @param {Object {room, choise}} payload
 * @param {Object} state
 * @param {Object} state.connected
 * @param {Object} state.rooms
 * @param {Object} state.rooms[payload.room]
 * @param {Object} state.rooms[payload.room]
 * @param {Object} state.rooms[payload.room][payload.socket.id]
 * @param {Object} state.rooms[payload.room][payload.socket.id].rockPaperScissorChoice
 */
const onRockPaperScissorsChoise = (socket, clientSocket, payload, ioState) => {
  console.log(constants.GAME_ROCK_PAPER_SCISSORS_CHOISE, payload);

  const [playerA, playerB] = methods.getPlayerChoise({
    clientSocket,
    payload,
    ioState,
  });

  if (playerA.rockPaperScissorChoice && playerB.rockPaperScissorChoice) {
    const result = methods.evaluateRockPaperScissors(playerA, playerB);

    const winner = result ? result.socket.id : null;

    methods.setWinnerInGameState({
      ioState,
      roomName: payload.room,
      winner,
    });

    emitDuelRockPaperScissorsResult(socket, {
      room: payload.room,
      result: winner,
    });

    if (winner) {
      emitBoardState({ socket, payload, ioState });
      emitGameState({ socket, payload, ioState });
      emitMulliganPhase({ socket, payload });
    }

    methods.clearPlayerChoiseFromResult({ result, playerA, playerB });
  }
};

const onDeckSelected = (socket, payload, ioState) => {
  console.log(constants.GAME_DECK_SELECTED, payload);
  ioState.connected[socket.id].deckId = payload.deckId;
};

const emitMulliganPhase = ({ socket, payload }) => {
  console.log(constants.GAME_PHASES_MULLIGAN);

  socket.of('/duel').to(payload.room).emit(constants.GAME_PHASES_MULLIGAN, {
    room: payload.room,
  });
};

const emitMulligan = ({ socket, clientSocket, payload }) => {
  console.log(constants.GAME_MULLIGAN);

  socket.of('/duel').to(payload.room).emit(constants.GAME_MULLIGAN, payload);
};

const emitGameRefreshPhase = ({ socket, payload }) => {
  console.log(constants.GAME_PHASES_REFRESH);

  socket.of('/duel').to(payload.room).emit(constants.GAME_PHASES_REFRESH, {
    room: payload.room,
  });
}

module.exports = {
  emitDuelJoin,
  emitDuelRoomJoin,
  emitDuelInitRockPaperScissors,
  emitDuelRockPaperScissorsResult,
  emitDuelCanceled,
  onRockPaperScissorsChoise,
  onDeckSelected,
  emitBoardState,
  emitMulligan,
  emitGameRefreshPhase,
};

// ioServer.of('/duel').to(data.room).emit('duel:setBoard', {
//   player: playerId,
//   board: player.board,
// });
