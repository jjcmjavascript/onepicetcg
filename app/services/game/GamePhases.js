class GamePhases {
  constructor() {
    this.MULLIGAN = 'mulligan';
    this.REFRESH = 'refresh';
    this.DRAW = 'draw';
    this.DON = 'don';
    this.MAIN = 'main';
    this.END = 'end';
  }

  static getPhases() {
    return [
      this.MULLIGAN,
      this.REFRESH,
      this.DRAW,
      this.DON,
      this.MAIN,
      this.END,
    ];
  }
}

module.exports = GamePhases;
