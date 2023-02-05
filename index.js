require('dotenv').config();
const path = require('path');
const { server, express, httpServer } = require('./app/services/server');
const { notFound, helmet, morgan, cors } = require('./app/middlewares');
const { v1 } = require('./app/routes');

const { ioServer } = require('./app/services/socket')(httpServer);

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
      console.log('New client connected');

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });

  } catch (error) {
    console.error(error.stack);
  }
})();
