const constants = require('./constants');
const methods = require('./methods');

const emitDuelJoin = ({ socket, payload }) => {
  console.log(constants.DUEL_JOIN);
  socket.emit(constants.DUEL_JOIN, payload);
};
const emitDuelRoomJoin = ({ socket, payload }) => {
  console.log(constants.GAME_ROOM_JOIN, payload.room);
  socket.of('/duel').to(payload.room).emit(constants.GAME_ROOM_JOIN, payload);
};

const emitDuelInitRockPaperScissors = ({ socket, payload }) => {
  console.log(constants.GAME_ROCK_SCISSORS_PAPER_START, payload);
  socket
    .of('/duel')
    .to(payload.room)
    .emit(constants.GAME_ROCK_SCISSORS_PAPER_START, payload);
};

const emitDuelRockPaperScissorsResult = ({ socket, payload }) => {
  console.log(constants.GAME_ROCK_SCISSORS_PAPER_RESULT, payload);
  socket
    .of('/duel')
    .to(payload.room)
    .emit(constants.GAME_ROCK_SCISSORS_PAPER_RESULT, payload);
};

const emitDuelCanceled = ({ socket, payload }) => {
  console.log(constants.GAME_ROOM_CANCEL);
  socket.of('/duel').emit(constants.GAME_ROOM_CANCEL, payload);
};

const emitInitialBoardState = ({ socket, payload, players }) => {
  console.log(constants.GAME_INITIAL_BOARD_STATE);

  players.forEach((player, index) => {
    socket
      .of('/duel')
      .to(player.id)
      .emit(constants.GAME_INITIAL_BOARD_STATE, {
        room: payload.room,
        board: player.board,
        rivalBoard: players[index === 0 ? 1 : 0].board,
      });
  });
};

const emitGameState = ({ socket, payload, gameState }) => {
  console.log(constants.GAME_STATE);

  socket.of('/duel').to(payload.room).emit(constants.GAME_STATE, {
    room: payload.room,
    game: gameState,
  });
};

const onRockPaperScissorsChoice = () => {
  console.log(constants.GAME_ROCK_PAPER_SCISSORS_CHOICE);
};

const onDeckSelected = () => {
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

  socket.of('/duel').to(playerId).emit(constants.GAME_RIVAL_PHASES_DRAW, {
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

const emitTurnSelectionInit = ({ socket, payload }) => {
  console.log(constants.GAME_TURN_SELECTION_INIT);

  socket.of('/duel').to(payload.room).emit(constants.GAME_TURN_SELECTION_INIT, {
    room: payload.room,
    playerId: payload.playerId,
  });
};

const onTurnSelectionChoice = () => {
  console.log(constants.GAME_TURN_SELECTION_CHOICE);
};

const emitTurnSelectionEnd = ({ socket, payload }) => {
  console.log(constants.GAME_TURN_SELECTION_END);

  socket.of('/duel').to(payload.room).emit(constants.GAME_TURN_SELECTION_END, {
    room: payload.room,
  });
};

const emitPhaseMain = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_PHASES_MAIN);

  socket.of('/duel').to(playerId).emit(constants.GAME_PHASES_MAIN, {
    room: payload.room,
  });
};

const emitPhaseMainRival = ({ socket, playerId, payload }) => {
  console.log(constants.GAME_RIVAL_PHASES_MAIN);

  socket.of('/duel').to(playerId).emit(constants.GAME_RIVAL_PHASES_MAIN, {
    room: payload.room,
  });
};

module.exports = {
  emitDuelJoin,
  emitDuelRoomJoin,
  emitDuelInitRockPaperScissors,
  emitDuelRockPaperScissorsResult,
  onRockPaperScissorsChoice,
  onDeckSelected,
  emitTurnSelectionInit,
  onTurnSelectionChoice,
  emitTurnSelectionEnd,
  emitGameState,
  emitMulliganPhase,
  emitRivalMulligan,
  emitMulligan,
  emitGameRefreshPhase,
  emitGameRivalRefreshPhase,
  emitDuelCanceled,
  emitInitialBoardState,
  emitPhaseDraw,
  emitRivalPhaseDraw,
  emitPhaseDon,
  emitRivalPhaseDon,
  emitPhaseMain,
  emitPhaseMainRival,
};
