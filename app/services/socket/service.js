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
    if (!ioState.waiterExist(socket)) {
      ioState.setWaiter(socket);
    }

    socket.on(ioConstants.GAME_ROCK_PAPER_SCISSORS_CHOISE, (payload) => {
      ioEvents.onRockPaperScissorsChoise(ioServer, socket, payload, ioState);
    });

    ioEvents.emitDuelJoin(ioServer);

    socket.on('duel:playerSelected', async (data) => {
      const currentRoom = ioState.rooms[data.room];
      const decks = await db.decks.findAll({
        include: [
          '_image',
          '_image_full',
          {
            model: db.colors,
            as: '_colors',
          },
          {
            model: db.types,
            as: '_type',
          },
          {
            model: db.categories,
            as: '_categories',
          },
        ],
      });

      for (const playerId in currentRoom) {
        const formatCardsForDeck = ioState.formatCardsForDeck(decks[0]);
        const separeDeck = ioState.shuffle(
          ioState.separeDeck(formatCardsForDeck)
        );
        const player = currentRoom[playerId];

        player.board = {
          ...player.board,
          ...separeDeck,
        };

        console.log(player.board);
        ioServer.of('/duel').to(data.room).emit('duel:setBoard', {
          player: playerId,
          board: player.board,
        });
      }
    });

    socket.on('disconnect', () => {
      // ioMethods.removePlayerFromRoom(socket);
    });

    socket.on(ioConstants.GAME_DECK_SELECTED, (data) => {
      ioEvents.onDeckSelected(socket, data, ioState);
    });

    // check if there are players waiting for a duel
    setInterval(() => {
      let notPlaying = ioState.notPlayingArr;
      console.log('Players connected:', ioState.connectedCount);
      console.log('Players Playing:', ioState.playingCount);

      while (notPlaying.length !== 0 && notPlaying.length % 2 === 0) {
        const [playerOne, playerTwo] = notPlaying.splice(0, 2);

        const roomName = ioMethods.setPlayersInRoom({playerOne, playerTwo, ioState});

        ioEvents.emitDuelRoomJoin(ioServer, { room: roomName });

        ioEvents.emitDuelInitRockPaperScissors(ioServer, { room: roomName });
      }
    }, 1000);

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
};
