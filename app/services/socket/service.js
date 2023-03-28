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
            stateId: payload.room,
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

      const state = Game.getStateById({ stateId: payload.room });
      const playerA = state.playerA;
      const playerB = state.playerB;

      ioEvents.emitInitialBoardState({
        socket: ioServer,
        payload,
        players: [playerA, playerB],
      });

      ioEvents.emitGameState({ socket: ioServer, payload, game: state.game });

      RockPaperScissors.destroy({ roomId: payload.room });

      ioEvents.emitMulliganPhase({ socket: ioServer, payload });
    });

    socket.on(ioConstants.GAME_MULLIGAN, (payload) => {
      Game.mulliganPhase({
        stateId: payload.room,
        playerId: socket.id,
        didMulligan: payload.mulligan,
      });

      const state = Game.getStateById({ stateId: payload.room });
      const [player, opponent] = state.getCurrentPlayerAndOpponent({
        playerId: socket.id,
      });

      ioEvents.emitMulligan({
        socket: ioServer,
        playerId: player.id,
        payload: {
          room: payload.room,
          board: player.board,
        },
      });

      ioEvents.emitRivalMulligan({
        socket: ioServer,
        playerId: opponent.id,
        payload: {
          room: payload.room,
          board: player.board,
        },
      });

      console.log('opponent', opponent);

      const isAvailable = Game.isMulliganAvailable({
        stateId: payload.room,
      });

      if (!isAvailable) {
        const _payload = {
          room: payload.room,
          playerId: player.board,
        };

        ioEvents.emitGameRefreshPhase({
          socket: ioServer,
          playerId: player.id,
          payload: _payload,
        });

        ioEvents.emitGameRivalRefreshPhase({
          socket: ioServer,
          playerId: opponent.id,
          payload: _payload,
        });
      }
    });

    socket.on(ioConstants.GAME_PHASES_REFRESH_END, (payload) => {
      Game.drawPhase({ stateId: payload.room });

      const state = Game.getStateById({ stateId: payload.room });

      const playerOnTurn = state.getPlayerOnTurn();

      const rivalPlayerId = state.getOtherPlayerById({
        playerId: playerOnTurn.id,
      }).id;

      ioEvents.emitPhaseDraw({
        socket: ioServer,
        playerId: playerOnTurn.id,
        payload: {
          room: payload.room,
          board: playerOnTurn.board,
        },
      });

      ioEvents.emitRivalPhaseDraw({
        socket: ioServer,
        playerId: rivalPlayerId,
        payload: {
          room: payload.room,
          board: playerOnTurn.board,
        },
      });
    });

    // socket.on(ioConstants.GAME_PHASES_DRAW_END, (payload) => {
    //   ioMethods.donPhase({
    //     socket: ioServer,
    //     clientSocket: socket,
    //     payload,
    //     ioState,
    //     callbacks: {
    //       emitPhaseDon: ioEvents.emitPhaseDon,
    //       emitRivalPhaseDon: ioEvents.emitRivalPhaseDon,
    //     },
    //   });
    // });

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
        stateId: roomId,
        playerAId: playerA.id,
        playerBId: playerB.id,
        callback: () => {
          ioEvents.emitDuelInitRockPaperScissors({
            socket: ioServer,
            payload: {
              room: roomId,
            },
          });

          const state = Game.getStateById({ stateId: roomId });
          const playerA = state.playerA;
          const playerB = state.playerB;

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
