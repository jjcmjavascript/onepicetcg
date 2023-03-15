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
  get notPlayingArr() {
    return this.connectedArr.filter((player) => !player.isPlaying);
  },
  get connectedCount() {
    return this.connectedArr.length;
  },
  get notPlayingCount() {
    return this.notPlayingArr.length;
  },
  get playingCount() {
    return this.connectedCount - this.notPlayingCount;
  },
};

module.exports = state;
