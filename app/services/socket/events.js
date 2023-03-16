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

const emitInitialBoardState = ({ socket, payload, ioState }) => {
  console.log(constants.GAME_INITIAL_BOARD_STATE);

  const [playerA, playerB] = Object.values(ioState.rooms[payload.room]);

  socket
    .of('/duel')
    .to(playerA.socket.id)
    .emit(constants.GAME_INITIAL_BOARD_STATE, {
      room: payload.room,
      board: playerA.board,
      rivalBoard: playerB.board,
    });

  socket
    .of('/duel')
    .to(playerB.socket.id)
    .emit(constants.GAME_INITIAL_BOARD_STATE, {
      room: payload.room,
      board: playerB.board,
      rivalBoard: playerA.board,
    });
};

const emitGameState = ({ socket, payload, ioState }) => {
  console.log(constants.GAME_STATE);

  socket.of('/duel').to(payload.room).emit(constants.GAME_STATE, {
    room: payload.room,
    game: ioState.rooms[payload.room].game,
  });
};

const onRockPaperScissorsChoise = ({}) => {
  console.log(constants.GAME_ROCK_PAPER_SCISSORS_CHOISE);
};

const onDeckSelected = ({}) => {
  console.log(constants.GAME_DECK_SELECTED);
};

const emitMulliganPhase = ({ socket, payload }) => {
  console.log(constants.GAME_PHASES_MULLIGAN);

  socket.of('/duel').to(payload.room).emit(constants.GAME_PHASES_MULLIGAN, {
    room: payload.room,
  });
};

const emitMulligan = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_MULLIGAN);

  socket.of('/duel').to(playerId).emit(constants.GAME_MULLIGAN, {
    room: payload.room,
    board: payload.board,
  });
};

const emitRivalMulligan = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_RIVAL_MULLIGAN);

  socket.of('/duel').to(playerId).emit(constants.GAME_RIVAL_MULLIGAN, {
    room: payload.room,
    board: payload.board,
  });
};

const emitGameRefreshPhase = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_PHASES_REFRESH);

  socket.of('/duel').to(playerId).emit(constants.GAME_PHASES_REFRESH, {
    room: payload.room,
    board: payload.board,
  });
};

const emitGameRivalRefreshPhase = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_RIVAL_PHASES_REFRESH);

  socket.of('/duel').to(playerId).emit(constants.GAME_RIVAL_PHASES_REFRESH, {
    room: payload.room,
    board: payload.board,
  });
};

const emitPhaseDraw = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_PHASES_DRAW);

  socket.of('/duel').to(playerId).emit(constants.GAME_PHASES_DRAW, {
    room: payload.room,
    board: payload.board,
  });
};

const emitRivalPhaseDraw = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_RIVAL_PHASES_DRAW);

  socket.of('/duel').to(playerId).emit(constants.GAME_RIVAL_PHASES_REFRESH, {
    room: payload.room,
    board: payload.board,
  });
};

const emitPhaseDon = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_PHASES_DON);

  socket.of('/duel').to(playerId).emit(constants.GAME_PHASES_DON, {
    room: payload.room,
    board: payload.board,
  });
};

const emitRivalPhaseDon = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_RIVAL_PHASES_DON);

  socket.of('/duel').to(playerId).emit(constants.GAME_RIVAL_PHASES_DON, {
    room: payload.room,
    board: payload.board,
  });
};

module.exports = {
  emitDuelJoin,
  emitDuelRoomJoin,
  emitDuelInitRockPaperScissors,
  emitDuelRockPaperScissorsResult,
  emitDuelCanceled,
  onRockPaperScissorsChoise,
  onDeckSelected,
  emitInitialBoardState,
  emitMulligan,
  emitGameRefreshPhase,
  emitGameRivalRefreshPhase,
  emitPhaseDraw,
  emitRivalPhaseDraw,
  emitRivalMulligan,
  emitPhaseDon,
  emitRivalPhaseDon,
  emitGameState,
};
