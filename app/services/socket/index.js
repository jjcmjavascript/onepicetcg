const { Server } = require('socket.io');
const ioConfig = require('./config');
const ioState = require('./state');

module.exports = (httpServer) => {
  const ioServer = new Server(httpServer, ioConfig);

  return {
    httpServer,
    ioServer,
    ioConfig,
    ioState
  };
};
