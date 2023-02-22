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
 * @param {Object SocketIo} mainSocket
 * @param {Object {room}} payload
 */
const emitDuelBoard = (mainSocket, room, ioState) => {
  console.log(constants.GAME_BOARD_STATE);
  const [playerA, playerB] = Object.values(ioState.rooms[room]);

  mainSocket
    .of('/duel')
    .to(playerA.socket.id)
    .emit(constants.GAME_BOARD_STATE, {
      room,
      board: playerA.board,
      name: "Player A"
    });

    mainSocket
    .of('/duel')
    .to(playerB.socket.id)
    .emit(constants.GAME_BOARD_STATE, {
      room,
      board: playerB.board,
      name: "Player B"
    });
};

/**
 * @param {Object SocketIo} mainSocket
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
const onRockPaperScissorsChoise = (socket, clientSocket, payload, state) => {
  console.log(constants.GAME_ROCK_PAPER_SCISSORS_CHOISE, payload);

  const [playerA, playerB] = methods.getPlayerChoise({
    clientSocket,
    payload,
    state,
  });

  if (playerA.rockPaperScissorChoice && playerB.rockPaperScissorChoice) {
    const result = methods.evaluateRockPaperScissors(playerA, playerB);

    emitDuelRockPaperScissorsResult(socket, {
      room: payload.room,
      result: result ? result.socket.id : null,
    });

    if (result) {
      emitDuelBoard(socket, payload.room, state);
    }

    methods.clearPlayerChoiseFromResult({ result, playerA, playerB });
  }
};

const onDeckSelected = (socket, payload, ioState) => {
  console.log(constants.GAME_DECK_SELECTED, payload);
  ioState.connected[socket.id].deckId = payload.deckId;
};

module.exports = {
  emitDuelJoin,
  emitDuelRoomJoin,
  emitDuelInitRockPaperScissors,
  emitDuelRockPaperScissorsResult,
  emitDuelCanceled,
  onRockPaperScissorsChoise,
  onDeckSelected,
  emitDuelBoard,
};

// ioServer.of('/duel').to(data.room).emit('duel:setBoard', {
//   player: playerId,
//   board: player.board,
// });
