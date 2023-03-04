// EMMITS
const DUEL_JOIN = 'duel:join';
const GAME_ROOM_JOIN = 'game:room_join';
const GAME_ROOM_CANCEL = 'game:cancel';
const GAME_ROCK_SCISSORS_PAPER_START = 'game:initRockPaperScissors';
const GAME_ROCK_SCISSORS_PAPER_RESULT = 'game:rockScissorsPaperResult';
const GAME_BOARD_STATE = 'game:boardState';
const GAME_STATE = 'game:gameState';

//hybrid
const GAME_TURN_START = 'game:turnStart';
const GAME_TURN_WAIT = 'game:turnWait';
const GAME_TURN_END = 'game:turnEnd';
const GAME_PHASES_REFRESH = 'game:phasesRefresh';
const GAME_PHASES_DRAW = 'game:phasesRefresh';
const GAME_PHASES_MULLIGAN = 'game:phasesMulligan';

// LISTENERS
const GAME_ROCK_PAPER_SCISSORS_CHOISE = 'game:rockPaperScissorsChoise';
const GAME_DECK_SELECTED = 'game:deckSelected';
const GAME_MULLIGAN = 'game:mulligan';

module.exports = {
  DUEL_JOIN,
  GAME_ROOM_JOIN,
  GAME_ROCK_SCISSORS_PAPER_START,
  GAME_ROCK_PAPER_SCISSORS_CHOISE,
  GAME_ROCK_SCISSORS_PAPER_RESULT,
  GAME_ROOM_CANCEL,
  GAME_DECK_SELECTED,
  GAME_BOARD_STATE,
  GAME_STATE,
  GAME_PHASES_MULLIGAN,
  GAME_TURN_START,
  GAME_TURN_WAIT,
  GAME_TURN_END,
  GAME_PHASES_REFRESH,
  GAME_PHASES_DRAW,

  GAME_MULLIGAN,
};
