/**
 * @param {SocketIoObject} socket
 * @return {Object}
 * @return object.socket
 * @return object.id
 * @return object.isPlaying
 * @return object.deckId
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
 * @property {Boolean} mulligan.avaible
 * @property {Object} turns
 * @property {Object} turns[turnId][socketEvents]
 */
const gameSchema = (playerA, playerB) => {
  return {
    rockPaperScissorWinner: null,
    currentTurnNumber: 1,
    playerAId: playerA.id,
    playerBId: playerB.id,
    currentTurnPlayerId: 0,
    currentPhase: "mulligan",
    [playerA.id]: {
      turnPlays: {},
    },
    [playerB.id]: {
      turnPlays: {},
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
