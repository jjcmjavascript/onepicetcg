/**
 * @param {SocketIoObject} socket
 * @return {Object: {Int id, Object socket, Boolean isPlaying, Int deckId}}
 */
const getConnectedSchema = (socket) => {
  return {
    socket,
    id: socket.id,
    isPlaying: false,
    deckId: null,
  };
};

/**
 * @returns {Object}
 * @property {Object} mulligan
 * @property {Boolean} mulligan.did
 * @property {Boolean} mulligan.available
 * @property {Object} turns
 * @property {Object} turns[turnId][socketEvents]
 */
const gameSchema = (playerA, playerB) => {
  return {
    currentTurnPlayerId: 0,
    currentPhase: 'mulligan',
    currentTurnNumber: 1,
    rockPaperScissorWinner: null,
    playerAId: playerA.id,
    playerBId: playerB.id,
    [playerA.id]: {
      turnPlays: {},
      mulligan: {
        did: false,
        available: true,
      },
    },
    [playerB.id]: {
      turnPlays: {},
      mulligan: {
        did: false,
        available: true,
      },
    },
  };
};

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
    hand: [],
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
    game: gameSchema(playerA, playerB),
  };
};

module.exports = {
  getConnectedSchema,
  getBoardSchema,
  getRoomSchema,
  gameSchema,
};
