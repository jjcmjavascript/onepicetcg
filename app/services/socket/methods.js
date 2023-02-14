const { v4: uuidv4 } = require('uuid');

const results = [
  { name: 'rock', beats: 'scissors' },
  { name: 'paper', beats: 'rock' },
  { name: 'scissors', beats: 'paper' },
];

const getBoardSchema = () => {
  return {
    leader: null,
    don: null,
    stage: null,
    characters: [],
    costs: [],
    trash: [],
    dons: [],
    lives: [],
    deck: [],
  };
};

const getRoomSchema = (playerA, playerB) => {
  return {
    [playerA.id]: {
      socket: playerA.socket,
      board: getBoardSchema(),
      rockPaperScissorChoice: null,
    },
    [playerB.id]: {
      socket: playerB.socket,
      board: getBoardSchema(),
      rockPaperScissorChoice: null,
    },
  };
};

const evaluateRockPaperScissors = (playerOne, playerTwo) => {
  const playerOneResult = results.find(
    (result) => result.name === playerOne.rockPaperScissorChoice
  );
  const playerTwoResult = results.find(
    (result) => result.name === playerTwo.rockPaperScissorChoice
  );

  if (playerOneResult.beats === playerTwoResult.name) {
    return playerOne;
  }
  if (playerTwoResult.beats === playerOneResult.name) {
    return playerTwo;
  }

  return null;
};

const removePlayerFromRoom = (socket, ioState) => {
  const roomsEntries = Object.entries(ioState.rooms);
  const roomIndex = roomsEntries.findIndex(([key, room]) => room[socket.id]);
  const [roomKey, room] = rooms[roomIndex];

  if (room) {
    const [playerOne, playerTwo] = Object.values(room);

    playerOne && (playerOne.isPlaying = false);
    playerTwo && (playerTwo.isPlaying = false);
    delete ioState.rooms[roomKey];
  }
};

const setPlayersInRoom = ({ playerOne, playerTwo, ioState }) => {
  const roomName = uuidv4();
  ioState.rooms[roomName] = getRoomSchema(playerOne, playerTwo);

  playerOne.isPlaying = true;
  playerTwo.isPlaying = true;
  playerOne.socket.join(roomName);
  playerTwo.socket.join(roomName);

  return roomName;
};

module.exports = {
  evaluateRockPaperScissors,
  removePlayerFromRoom,
  setPlayersInRoom,
};
