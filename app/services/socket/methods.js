const { v4: idGenerator } = require('uuid');

const setPlayersInRoom = ({ playerA, playerB }) => {
  const roomName = idGenerator();

  if (playerA) {
    playerA.isPlaying = true;
    playerA.socket.join(roomName);
  }

  if (playerB) {
    playerB.isPlaying = true;
    playerB.socket.join(roomName);
  }

  return roomName;
};

module.exports = {
  setPlayersInRoom,
};
