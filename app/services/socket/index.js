const { Server } = require('socket.io');
const ioConfig = require('./config');
const ioState = require('./state');
const ioEvents = require('./events');
const ioConstants = require('./constants');

module.exports = (httpServer) => {
  const ioServer = new Server(httpServer, ioConfig);

  return {
    httpServer,
    ioServer,
    ioConfig,
    ioState,
    ioEvents,
    ioConstants
  };
};
