const constants = require('./constants');

module.exports = {
  emitDuelJoin: (payload = {}) => {
    console.log(constants.DUEL_JOIN);
    socket.on(constants.DUEL_JOIN, payload);
  },
  emitDuelRoomJoin: (payload = {}) => {
    console.log(constants.GAME_ROOM_JOIN);
    socket.to(roomName).emit(constants.GAME_ROOM_JOIN, payload);
  },
  emitDuelInitRockPaperScissors: (payload = {}) => {
    console.log(constants.GAME_INIT_ROCK_PAPER_SCISSORS);
    socket.to(roomName).emit(constants.GAME_INIT_ROCK_PAPER_SCISSORS, payload);
  },
};
