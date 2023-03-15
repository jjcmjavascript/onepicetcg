const Game = require('../game/GameCore');
const RockPaperScissors = require('../rockPaperScissor');

module.exports = (ioObjects) => {
  const { ioServer, ioState, ioEvents, ioConstants, ioMethods } = ioObjects;

  ioServer.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', (a) => {
      console.log('Client disconnected');
      delete ioState.connected[socket.id];
    });
  });

  ioServer.of('/duel').on('connection', (socket) => {
    if (!Game.playerIsWaiting({ playerId: socket.id })) {
      Game.setPlayerToWait({ clientSocket: socket });
    }

    /************************************************/
    // LISTENERS
    /************************************************/
    socket.on(ioConstants.GAME_DECK_SELECTED, (payload) => {
      ioEvents.onDeckSelected({
        payload,
        clientSocket: socket,
        callback: (id, deckId) => {
          Game.setDeckIdToConnectedPlayer({
            playerId: id,
            deckId: deckId,
          });
        },
      });
    });

    socket.on(ioConstants.GAME_ROCK_PAPER_SCISSORS_CHOISE, (payload) => {
      ioEvents.onRockPaperScissorsChoise(ioServer, socket, payload, ioState);
    });

    socket.on(ioConstants.GAME_MULLIGAN, (payload) => {
      ioMethods.mulligan({
        socket: ioServer,
        clientSocket: socket,
        payload,
        ioState,
        callbacks: {
          emitMulligan: ioEvents.emitMulligan,
          emitRivalMulligan: ioEvents.emitRivalMulligan,
        },
      });

      ioMethods.checkMulliganEnd({
        socket: ioServer,
        clientSocket: socket,
        payload,
        ioState,
        callbacks: {
          emitGameRefreshPhase: ioEvents.emitGameRefreshPhase,
          emitGameRivalRefreshPhase: ioEvents.emitGameRivalRefreshPhase,
        },
      });
    });

    socket.on(ioConstants.GAME_PHASES_REFRESH_END, (payload) => {
      ioMethods.drawPhase({
        socket: ioServer,
        clientSocket: socket,
        payload,
        ioState,
        callbacks: {
          emitPhaseDraw: ioEvents.emitPhaseDraw,
          emitRivalPhaseDraw: ioEvents.emitRivalPhaseDraw,
        },
      });
    });

    socket.on(ioConstants.GAME_PHASES_DRAW_END, (payload) => {
      ioMethods.donPhase({
        socket: ioServer,
        clientSocket: socket,
        payload,
        ioState,
        callbacks: {
          emitPhaseDon: ioEvents.emitPhaseDon,
          emitRivalPhaseDon: ioEvents.emitRivalPhaseDon,
        },
      });
    });

    socket.on('disconnect', () => {
      // ioMethods.removePlayerFromRoom(socket);
    });

    // if (!ioMethods.waiterExist(ioState, socket)) {
    //   ioMethods.setWaiter(ioState, socket);
    // }

    /************************************************/
    // EMMITS
    /************************************************/

    ioEvents.emitDuelJoin(ioServer);

    // CHECK GAME CANCELED
    // setInterval(() => {
    //   Object.values(ioState.rooms).map((room) => {
    //     const [playerA, playerB] = Object.values(room);
    //     if (!playerA.socket.connected || !playerB.socket.connected) {
    //       ioMethods.removePlayerFromRoom(playerA.socket, ioState);

    //       ioEvents.emitDuelCanceled(ioServer, {
    //         players: [playerA.socket.id, playerB.socket.id],
    //       });
    //     }
    //   });
    // }, 10000);
  });

  /************************************************/
  // CHECK PLAYERS
  /************************************************/
  const checkPlayers = () => {
    const notPlaying = Game.avaiblesToPlay;

    console.log('Players connected:', Game.connectedCount);
    console.log('Players Playing:', Game.playingCount);

    while (notPlaying.length !== 0 && notPlaying.length % 2 === 0) {
      const [playerA, playerB] = notPlaying.splice(0, 2);

      const roomName = ioMethods.setPlayersInRoom({
        playerA,
        playerB,
      });

      ioEvents.emitDuelRoomJoin(ioServer, { room: roomName });

      Game.initNewGame({
        boardId: roomName,
        playerAId: playerA.id,
        playerBId: playerB.id,
        callback: () => {
          ioEvents.emitDuelInitRockPaperScissors(ioServer, {
            room: roomName,
          });
        },
      });
    }

    callTimeOut(checkPlayers, 2000);
  };

  const callTimeOut = (callback, time) => {
    setTimeout(() => {
      callback();
    }, time);
  };

  callTimeOut(checkPlayers, 2000);
};
