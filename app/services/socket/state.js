const state = {
  connected: {},
  rooms: {},
  get connectedArr() {
    return (
      Object.values(this.connected).filter(
        (player) => player.socket.connected
      ) || []
    );
  },
};

module.exports = state;
