const Game = require('../game/GameCore');
const RockPaperScissors = require('../rockPaperScissor');

module.exports = (ioObjects) => {
  const { ioServer, ioState, ioEvents, ioConstants, ioMethods } = ioObjects;

  /************************************************/
  // NAMESPACE: DEFAULT
  /************************************************/
  ioServer.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
  });

  /************************************************/
  // NAMESPACE: DUEL
  /************************************************/
  ioServer.of('/duel').on('connection', (socket) => {
    if (!Game.playerIsWaiting({ playerId: socket.id })) {
      Game.setPlayerToWait({ clientSocket: socket });
    }

    socket.on('disconnect', (socket) => {
      console.log('Client disconnected:', socket);
    });

    /************************************************/
    // LISTENERS
    /************************************************/
    socket.on(ioConstants.GAME_DECK_SELECTED, (payload) => {
      ioEvents.onDeckSelected();

      Game.setDeckIdToConnectedPlayer({
        playerId: socket.id,
        deckId: payload.deckId,
      });
    });

    socket.on(ioConstants.GAME_ROCK_PAPER_SCISSORS_CHOICE, (payload) => {
      ioEvents.onRockPaperScissorsChoice();

      RockPaperScissors.setChoice({
        choice: payload.choice,
        roomId: payload.room,
        playerId: socket.id,
      });

      const avaibleToEval = RockPaperScissors.avaibleToEval({
        roomId: payload.room,
      });

      if (avaibleToEval) {
        const result = RockPaperScissors.evaluate({
          currentPlayerId: socket.id,
          roomId: payload.room,
        });

        ioEvents.emitDuelRockPaperScissorsResult({
          socket: ioServer,
          payload: {
            room: payload.room,
            result: result ? result.id : null,
          },
        });

        !result && RockPaperScissors.clearChoice({ roomId: payload.room });

        if (result) {
          Game.setPlayerWinnerFromSelectorTurnGame({
            roomId: payload.room,
            playerId: result.id,
          });

          ioEvents.emitTurnSelectionInit({
            socket: ioServer,
            payload: {
              room: payload.room,
              playerId: result.id,
            },
          });
        }
      }
    });

    socket.on(ioConstants.GAME_TURN_SELECTION_CHOICE, (payload) => {
      ioEvents.onTurnSelectionChoice();

      ioEvents.emitTurnSelectionEnd({
        socket: ioServer,
        payload,
      });

      const board = Game.getBoardById({ roomId: payload.room });
      const playerA = board.playerA;
      const playerB = board.playerB;

      ioEvents.emitInitialBoardState({
        socket: ioServer,
        payload,
        players: [playerA, playerB],
      });

      ioEvents.emitGameState({ socket: ioServer, payload, game: board.game });

      ioEvents.emitMulliganPhase({ socket: ioServer, payload });

      RockPaperScissors.destroy({ roomId: payload.room });
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

    /************************************************/
    // EMMITS
    /************************************************/
    ioEvents.emitDuelJoin({ socket: ioServer });
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

      const roomId = ioMethods.setPlayersInRoom({
        playerA,
        playerB,
      });

      ioEvents.emitDuelRoomJoin({
        socket: ioServer,
        payload: { room: roomId },
      });

      Game.initNewGame({
        boardId: roomId,
        playerAId: playerA.id,
        playerBId: playerB.id,
        callback: () => {
          ioEvents.emitDuelInitRockPaperScissors({
            socket: ioServer,
            payload: {
              room: roomId,
            },
          });

          const board = Game.getBoardById({ roomId });
          const playerA = board.playerA;
          const playerB = board.playerB;

          RockPaperScissors.init({
            playerA,
            playerB,
            roomId,
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
