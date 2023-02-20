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

const onRockPaperScissorsChoise = (
  mainSocket,
  clientSocket,
  payload,
  state
) => {
  console.log(constants.GAME_ROCK_PAPER_SCISSORS_CHOISE, payload);

  const room = state.rooms[payload.room];
  const [playerA, playerB] = Object.values(room);
  const currentPlayer = room[clientSocket.id];

  if (!currentPlayer.rockPaperScissorChoice) {
    currentPlayer.rockPaperScissorChoice = payload.choice;
  }

  if (playerA.rockPaperScissorChoice && playerB.rockPaperScissorChoice) {
    const result = methods.evaluateRockPaperScissors(playerA, playerB);

    emitDuelRockPaperScissorsResult(mainSocket, {
      room: payload.room,
      result: result ? result.socket.id : null,
    });

    // Si hay empate
    if (!result) {
      playerA.rockPaperScissorChoice = null;
      playerB.rockPaperScissorChoice = null;
    }
  }
};

const onDeckSelected = (socket, payload, ioState) => {
  console.log(constants.GAME_DECK_SELECTED, payload);
  ioState.connected[socket.id].deck = payload.deckId;
};

module.exports = {
  emitDuelJoin,
  emitDuelRoomJoin,
  emitDuelInitRockPaperScissors,
  emitDuelRockPaperScissorsResult,
  emitDuelCanceled,
  onRockPaperScissorsChoise,
  onDeckSelected,
};
