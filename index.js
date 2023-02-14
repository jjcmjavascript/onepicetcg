require('dotenv').config();
const path = require('path');
const { server, express, httpServer } = require('./app/services/server');
const { notFound, helmet, morgan, cors } = require('./app/middlewares');
const { v1 } = require('./app/routes');
const db = require('./app/services/database');

let { ioServer, ioState, ioEvents, ioConstants } =
  require('./app/services/socket')(httpServer);

(async () => {
  try {
    server.use('/public', express.static(path.join(__dirname, 'public')));
    server.use(cors());
    server.use(helmet());
    server.use(express.json({ limit: '2mb' }));
    server.use(
      express.urlencoded({ extended: false, limit: '2mb', parameterLimit: 100 })
    );
    server.use(morgan('tiny'));

    server.use('/v1', v1);

    server.use('*', notFound);

    httpServer.listen(process.env.APP_PORT, () => {
      console.log(`Listening on port ${process.env.APP_PORT}`);
    });

    ioServer.on('connection', (socket) => {
      console.log('Client connected');

      socket.on('disconnect', () => {
        delete ioState.connecteds[socket.id];
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

      setInterval(() => {
        let connecteds = Object.values(ioState.connecteds).filter(
          (player) => player.socket.connected
        );
        let notPlaying = connecteds.filter((player) => !player.isPlaying);

        console.log('Players connected:', connecteds.length);
        console.log('Players Playing:', connecteds.length - notPlaying.length);

        while (notPlaying.length !== 0 && notPlaying.length % 2 === 0) {
          const [playerOne, playerTwo] = notPlaying.splice(0, 2);

          const roomName = ioState.setPlayersInRoom(playerOne, playerTwo);

          ioEvents.emitDuelRoomJoin(socket, { room: roomName });

          ioEvents.emitDuelInitRockPaperScissors(ioServer, { room: roomName });
        }
      }, 1000);

      // CHECK GAME CANCELED
      setInterval(() => {
        Object.values(ioState.rooms).map((room) => {
          const [playerA, playerB] = Object.values(room);
          if (!playerA.socket.connected || !playerB.socket.connected) {
            ioEvents.emitDuelCanceled(ioServer, {
              room: roomName,
            });
          }
        });
      }, 10000);
    });
  } catch (error) {
    console.error(error.stack);
  }
})();
