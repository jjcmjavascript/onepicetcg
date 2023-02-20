const { v4: idGenerator } = require('uuid');
const types = require('../../helpers/cardTypes');
const { shuffle, deckDivider, formatCardsForDeck } = require('../../helpers');

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
      deckId: playerA.deckId,
    },
    [playerB.id]: {
      socket: playerB.socket,
      board: getBoardSchema(),
      rockPaperScissorChoice: null,
      deckId: playerB.deckId,
    },
  };
};

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

const removePlayerFromRoom = (socket, ioState) => {
  const roomsEntries = Object.entries(ioState.rooms);
  const roomIndex = roomsEntries.findIndex(([key, room]) => room[socket.id]);
  const [roomKey, room] = rooms[roomIndex];

  if (room) {
    const [playerA, playerB] = Object.values(room);

    playerA && (playerA.isPlaying = false);
    playerB && (playerB.isPlaying = false);
    delete ioState.rooms[roomKey];
  }
};

const setPlayersInRoom = ({ playerA, playerB, ioState }) => {
  const roomName = idGenerator();
  ioState.rooms[roomName] = getRoomSchema(playerA, playerB);

  playerA.isPlaying = true;
  playerB.isPlaying = true;

  playerA.socket.join(roomName);
  playerB.socket.join(roomName);

  return roomName;
};

const preparePlayerState = async ({
  playerA,
  playerB,
  ioState,
  database,
  callback,
}) => {
  let decks = await database.decks.scope(['structureForDeck']).findAll({
    where: {
      id: [playerA.deckId, playerB.deckId],
    },
  });

  decks = decks.map((deck) => deck.toJSON());

  const playerADeck = decks.find((deck) => deck.id === playerA.deckId);
  const playerBDeck = decks.find((deck) => deck.id === playerB.deckId);

  console.log(playerADeck);

  let playerADeckStructure = formatCardsForDeck({
    deck: playerADeck,
    idGenerator,
    types,
  });

  console.log(playerADeckStructure)
};

module.exports = {
  evaluateRockPaperScissors,
  removePlayerFromRoom,
  setPlayersInRoom,
  preparePlayerState
};
