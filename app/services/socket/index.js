const { Server } = require('socket.io');
const ioConfig = require('./config');
const ioState = require('./state');
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
    ioState,
    ioEvents,
    ioConstants,
    ioMethods,
    database,
  };

  return () => service(ioObjects);
};