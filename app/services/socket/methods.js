const results = [
  { name: 'rock', beats: 'scissors' },
  { name: 'paper', beats: 'rock' },
  { name: 'scissors', beats: 'paper' },
];

const evaluateRockPaperScissors = (playerA, playerB) => {
  const playerAResult = results.find(
    (result) => result.name === playerA.rockPaperScissorChoice
  );
  const playerBResult = results.find(
    (result) => result.name === playerB.rockPaperScissorChoice
  );

  if (playerAResult.beats === playerBResult.name) {
    return playerA;
  }
  if (playerBResult.beats === playerAResult.name) {
    return playerB;
  }

  return null;
};

const removePlayerFromRoom = (socket) => {
  const roomsEntries = Object.entries(state.rooms);
  const roomIndex = roomsEntries.findIndex(([key, room]) => room[socket.id]);
  const [roomKey, room] = rooms[roomIndex];

  if (room) {
    const [playerA, playerB] = Object.values(room);

    playerA && (playerA.isPlaying = false);
    playerB && (playerB.isPlaying = false);
    delete state.rooms[roomKey];
  }
};

module.exports = {
  evaluateRockPaperScissors,
  removePlayerFromRoom
};
