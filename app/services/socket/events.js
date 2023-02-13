const constants = require('./constants');
const methods = require('./methods');

const ioEvents = {
  emitDuelJoin: (socket, payload = {}) => {
    console.log(constants.DUEL_JOIN);
    socket.emit(constants.DUEL_JOIN, payload);
  },
  emitDuelRoomJoin: (socket, payload = {}) => {
    console.log(constants.GAME_ROOM_JOIN);
    socket.to(payload.room).emit(constants.GAME_ROOM_JOIN, payload);
  },
  emitDuelInitRockPaperScissors: (socket, payload = {}) => {
    console.log(constants.GAME_ROCK_SCISSORS_PAPER_START);
    socket
      .of('/duel')
      .to(payload.room)
      .emit(constants.GAME_ROCK_SCISSORS_PAPER_START, payload);
  },
  emitDuelRockPaperScissorsResult: (socket, payload) => {
    console.log(constants.GAME_ROCK_SCISSORS_PAPER_RESULT, payload);
    socket
      .of('/duel')
      .to(payload.room)
      .emit(constants.GAME_ROCK_SCISSORS_PAPER_RESULT, payload);
  },

  onRockPaperScissorsChoise: (mainSocket, clientSocket, payload, state) => {
    console.log(constants.GAME_ROCK_PAPER_SCISSORS_CHOISE, payload);

    const room = state.rooms[payload.room];
    const [playerA, playerB] = Object.values(room);
    const currentPlayer = room[clientSocket.id];

    if (!currentPlayer.rockPaperScissorChoice) {
      currentPlayer.rockPaperScissorChoice = payload.choice;
    }

    if (playerA.rockPaperScissorChoice && playerB.rockPaperScissorChoice) {
      const result = methods.evaluateRockPaperScissors(playerA, playerB);

      ioEvents.emitDuelRockPaperScissorsResult(mainSocket, {
        room: payload.room,
        result: result ? result.socket.id : null,
      });
    }
  },
};

module.exports = ioEvents;
