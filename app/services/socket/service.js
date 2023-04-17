const GameCore = require('../game/GameCore');
const RockPaperScissors = require('../rockPaperScissor');

module.exports = (ioObjects) => {
  const Game = new GameCore();

  const { ioServer, ioEvents, ioConstants, ioMethods } = ioObjects;

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
    console.log('Client connected to duel:', socket.id);

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

      const state = Game.getStateById({ stateId: payload.room });
      const playerA = state.playerA;
      const playerB = state.playerB;

      state.setPlayerTurnFromPlayerChoice({
        playerId: socket.id,
        choice: payload.choice,
      });

      ioEvents.emitTurnSelectionEnd({
        socket: ioServer,
        payload,
      });

      ioEvents.emitGameState({
        socket: ioServer,
        payload: {
          room: payload.room,
          game: state.game,
        },
      });

      ioEvents.emitInitialBoardState({
        socket: ioServer,
        payload,
        players: [playerA, playerB],
      });

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

      const _payload = {
        room: payload.room,
        board: player,
      };

      ioEvents.emitMulligan({
        socket: ioServer,
        playerId: player.id,
        payload: _payload,
      });

      ioEvents.emitRivalMulligan({
        socket: ioServer,
        playerId: opponent.id,
        payload: _payload,
      });

      const isAvailable = Game.isMulliganAvailable({
        stateId: payload.room,
      });

      if (!isAvailable) {
        Game.refreshPhase({ stateId: payload.room });

        const playerOnTurn = state.getPlayerOnTurn();
        const opponent = state.getOtherPlayerById({
          playerId: playerOnTurn.id,
        });

        ioEvents.emitGameState({
          socket: ioServer,
          payload: {
            room: payload.room,
            game: state.game,
          },
        });

        ioEvents.emitGameRefreshPhase({
          socket: ioServer,
          playerId: playerOnTurn.id,
          payload: {
            room: payload.room,
            board: playerOnTurn,
          },
        });

        ioEvents.emitGameRivalRefreshPhase({
          socket: ioServer,
          playerId: opponent.id,
          payload: {
            room: payload.room,
            board: playerOnTurn,
          },
        });
      }
    });

    socket.on(ioConstants.GAME_PHASES_REFRESH_END, (payload) => {
      Game.drawPhase({ stateId: payload.room });

      const state = Game.getStateById({ stateId: payload.room });
      const playerOnTurn = state.getPlayerOnTurn();
      const opponent = state.getOtherPlayerById({
        playerId: playerOnTurn.id,
      });

      ioEvents.emitPhaseDraw({
        socket: ioServer,
        playerId: playerOnTurn.id,
        payload: {
          room: payload.room,
          board: playerOnTurn,
        },
      });

      ioEvents.emitRivalPhaseDraw({
        socket: ioServer,
        playerId: opponent.id,
        payload: {
          room: payload.room,
          board: playerOnTurn,
        },
      });

      ioEvents.emitGameState({
        socket: ioServer,
        payload: {
          room: payload.room,
          game: state.game,
        },
      });
    });

    socket.on(ioConstants.GAME_PHASES_DRAW_END, (payload) => {
      Game.donPhase({ stateId: payload.room });

      const state = Game.getStateById({ stateId: payload.room });
      const playerOnTurn = state.getPlayerOnTurn();
      const opponent = state.getOtherPlayerById({
        playerId: playerOnTurn.id,
      });

      ioEvents.emitPhaseDon({
        socket: ioServer,
        playerId: playerOnTurn.id,
        payload: {
          room: payload.room,
          board: playerOnTurn,
        },
      });

      ioEvents.emitRivalPhaseDon({
        socket: ioServer,
        playerId: opponent.id,
        payload: {
          room: payload.room,
          board: playerOnTurn,
        },
      });

      ioEvents.emitGameState({
        socket: ioServer,
        payload: {
          room: payload.room,
          game: state.game,
        },
      });
    });

    socket.on(ioConstants.GAME_PHASES_DON_END, (payload) => {
      Game.mainPhase({ stateId: payload.room });

      const state = Game.getStateById({ stateId: payload.room });
      const playerOnTurn = state.getPlayerOnTurn();
      const opponent = state.getOtherPlayerById({
        playerId: playerOnTurn.id,
      });

      ioEvents.emitPhaseMain({
        socket: ioServer,
        playerId: playerOnTurn.id,
        payload,
      });

      ioEvents.emitPhaseMainRival({
        socket: ioServer,
        playerId: opponent.id,
        payload,
      });

      ioEvents.emitGameState({
        socket: ioServer,
        payload: {
          room: payload.room,
          game: state.game,
        },
      });
    });

    // MAIN PHASE

    // socket.on(ioConstants.GAME_DON_PLUS, (payload) => {
    //   console.log(ioConstants.GAME_DON_PLUS, payload);

    //   Game.enterToPhaseSumAttackFromDon({
    //     stateId: payload.room,
    //     donUuid: payload.donUuid,
    //   });

    //   const state = Game.getStateById({ stateId: payload.room });
    //   const playerOnTurn = state.getPlayerOnTurn();

    //   ioServer.to(payload.room).emit(ioConstants.GAME_DON_PLUS, {
    //     room: payload.room,
    //     board: playerOnTurn,
    //     game: state.game,
    //   });
    // });

    /************************************************/
    // EMMITS
    /************************************************/
    ioEvents.emitDuelJoin({ socket: ioServer });

    /************************************************/
    // DANGER FAKE STATE FOR TEST
    /************************************************/
    socket.on(ioConstants.GAME_FAKE_STATE_CREATE, (payload) => {
      if (!process.env.TEST_BOARD) return;

      socket.join(socket.id);

      Game.createFakeGame({
        stateId: socket.id,
        playerBoard: payload.playerBoard,
        gameState: payload.gameState,
        playerAId: socket.id,
      });

      const state = Game.getStateById({ stateId: socket.id });
      const currentPlayer = state.getPlayerOnTurn();

      socket.emit(ioConstants.GAME_FAKE_STATE_CREATED, {
        room: socket.id,
        board: currentPlayer,
        game: state.game,
      });

      console.log('Fake state created');
    });
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
