class SocketManager {
  constructor(io) {
    this.io = io;
    this.io.on('connection', (socket) => {

      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });
  }
}
