require('dotenv').config();

const path = require('path');
const { server, express, httpServer } = require('./app/services/server');
const {
  notFound,
  helmet,
  morgan,
  cors,
  manualValidationPassport,
} = require('./app/middlewares');
const { v1 } = require('./app/routes');
const db = require('./app/services/database');
const passport = require('passport');
const ioService = require('./app/services/socket')({
  httpServer,
  database: db,
});

require('./app/config/passport')(passport);

(async () => {
  try {
    server.use(cors());
    server.use(helmet());
    server.use(morgan('tiny'));
    server.use(express.json({ limit: '2mb' }));
    server.use(
      express.urlencoded({ extended: false, limit: '2mb', parameterLimit: 100 })
    );
    server.use(passport.initialize());

    // server.use(manualValidationPassport);

    server.use('/public', express.static(path.join(__dirname, 'public')));
    server.use('/v1', v1);
    server.use('*', notFound);

    httpServer.listen(process.env.APP_PORT, () => {
      console.log(`Listening on port ${process.env.APP_PORT}`);
    });

    ioService();
  } catch (error) {
    console.error(error.stack);
  }
})();
