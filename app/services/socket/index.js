const { Server } = require('socket.io');
const ioConfig = require('./ioConfig');

module.exports = (httpServer) => {
  const ioServer = new Server(httpServer, ioConfig);

  return {
    httpServer,
    ioServer,
  };
};
