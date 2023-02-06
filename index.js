require('dotenv').config();
const path = require('path');
const { server, express, httpServer } = require('./app/services/server');
const { notFound, helmet, morgan, cors } = require('./app/middlewares');
const { v1 } = require('./app/routes');

let { ioServer, ioState } = require('./app/services/socket')(httpServer);

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
      console.log('Client connected to duel');

      socket.on('disconnect', () => {
        console.log('Client disconnected from duel');
      });

      socket.on('duel:removeLife', (data) => {
        socket.to(data.room).emit('duel:removeLife', data);
      });

      socket.on('duel:playerSelected', (data) => {
        socket.to(data.room).emit('duel:playerSelected', {});
      });

      if (!ioState.waiterExist(socket)) {
        ioState.setWaiter(socket);
      }

      setInterval(() => {
        let connecteds = Object.values(ioState.connecteds);
        let notPlaying = connecteds.filter((player) => !player.isPlaying);

        while (notPlaying.length !== 0 && notPlaying.length % 2 === 0) {
          const [playerOne, playerTwo] = notPlaying.splice(0, 2);

          const roomName = ioState.setPlayersInRoom(playerOne, playerTwo);

          socket.to(roomName).emit('duel:connected', { room: roomName });

          socket.emit('duel:started', {});
        }
      }, 1000);
    });
  } catch (error) {
    console.error(error.stack);
  }
})();
