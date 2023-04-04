class GameModes {
  constructor() {
    this.ADD_DON_ATTACK = 'addDonAttack';
  }

  static getPhases() {
    return [this.ADD_DON_ATTACK];
  }
}

module.exports = GameModes;
