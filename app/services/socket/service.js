module.exports = (ioObjects) => {
  const { ioServer, ioState, ioEvents, ioConstants, ioMethods, database } =
    ioObjects;

  ioServer.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', (a) => {
      console.log('Client disconnected');
      delete ioState.connected[socket.id];
    });
  });

  ioServer.of('/duel').on('connection', (socket) => {
    if (!ioMethods.waiterExist(ioState, socket)) {
      ioMethods.setWaiter(ioState, socket);
    }

    /************************************************/
    // LISTENERS
    /************************************************/

    socket.on('disconnect', () => {
      // ioMethods.removePlayerFromRoom(socket);
    });

    socket.on(ioConstants.GAME_DECK_SELECTED, (data) => {
      ioEvents.onDeckSelected(socket, data, ioState);
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
        callback: ioEvents.emitMulligan,
      });

      ioMethods.checkMulliganEnd({
        socket: ioServer,
        clientSocket: socket,
        payload,
        ioState,
        callback: ioEvents.emitGameRegreshPhase,
      });
    });

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

    checkPlayers();
  });

  /************************************************/
  // CHECK PLAYERS
  /************************************************/
  const checkPlayers = () => {
    let notPlaying = ioState.notPlayingArr;
    console.log('Players connected:', ioState.connectedCount);
    console.log('Players Playing:', ioState.playingCount);

    while (notPlaying.length !== 0 && notPlaying.length % 2 === 0) {
      const [playerA, playerB] = notPlaying.splice(0, 2);

      const roomName = ioMethods.setPlayersInRoom({
        playerA,
        playerB,
        ioState,
      });

      ioEvents.emitDuelRoomJoin(ioServer, { room: roomName });

      ioMethods.preparePlayerState({
        playerA,
        playerB,
        ioState,
        database,
        roomName,
        callback: async () => {
          ioEvents.emitDuelInitRockPaperScissors(ioServer, {
            room: roomName,
          });
        },
      });
    }
  };
};
