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
const gameSchema = (player) => {
  return {
    [playerA.id]: {
      mulligan: {
        did: false,
        avaible: true,
      },
      turns: {},
    },
    [playerB.id]: {
      mulligan: {
        did: false,
        avaible: true,
      },
      turns: {},
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
    currentTurnNumber: 1,
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

module.exports = {
  getConnectedSchema,
  getBoardSchema,
  getRoomSchema,
  gameSchema,
};
