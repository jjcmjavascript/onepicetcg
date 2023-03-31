const { Server } = require('socket.io');
const ioConfig = require('./config');
const ioEvents = require('./events');
const ioConstants = require('./constants');
const ioMethods = require('./methods');
const service = require('./service');

module.exports = ({ httpServer, database }) => {
  const ioServer = new Server(httpServer, ioConfig);
  const ioObjects = {
    httpServer,
    ioConfig,
    ioServer,
    ioEvents,
    ioConstants,
    ioMethods,
    database,
  };

  return () => service(ioObjects);
};
