const constants = require('./constants');
const methods = require('./methods');

module.exports = {
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
    socket.to(payload.room).emit(constants.GAME_ROCK_SCISSORS_PAPER_START, payload);
  },

  onRockPaperScissorsChoise: (mainSocket, clientSocket, payload, state) => {
    console.log(constants.GAME_ROCK_PAPER_SCISSORS_CHOISE);

    const room = state.rooms[payload.room];
    const currentPlayer = room[clientSocket.id];

    if(!currentPlayer.rockPaperScissorChoose){
      currentPlayer.rockPaperScissorChoose = payload.choise;
    }

    const players = Object.values(room);

    if(players[0].rockPaperScissorChoose && players[1].rockPaperScissorChoose){
      const evaluateRockPaperSciissors = methods.evaluateRockPaperSciissors(players[0], players[1]);
      ioEvents.emitDuelInitRockPaperScissors(evaluateRockPaperSciissors);
    }
  },
};
