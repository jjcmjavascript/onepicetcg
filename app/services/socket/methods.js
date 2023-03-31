const { v4: idGenerator } = require('uuid');

const setPlayersInRoom = ({ playerA, playerB }) => {
  const roomName = idGenerator();

  playerA.isPlaying = true;
  playerB.isPlaying = true;

  playerA.socket.join(roomName);
  playerB.socket.join(roomName);

  return roomName;
};

module.exports = {
  setPlayersInRoom,
};
