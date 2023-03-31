// EMMITS
const DUEL_JOIN = 'duel:join';
const GAME_ROOM_JOIN = 'game:room_join';
const GAME_ROOM_CANCEL = 'game:cancel';
const GAME_ROCK_SCISSORS_PAPER_START = 'game:initRockPaperScissors';
const GAME_ROCK_SCISSORS_PAPER_RESULT = 'game:rockScissorsPaperResult';
const GAME_INITIAL_BOARD_STATE = 'game:boardState';
const GAME_STATE = 'game:gameState';
const GAME_TURN_SELECTION_INIT = 'game:turnSelectionInit';
const GAME_TURN_SELECTION_CHOICE = 'game:turnSelectionChoice';
const GAME_TURN_SELECTION_END = 'game:turnSelectionEnd';

//hybrid
const GAME_TURN_START = 'game:turnStart';
const GAME_TURN_WAIT = 'game:turnWait';
const GAME_TURN_END = 'game:turnEnd';
const GAME_PHASES_REFRESH = 'game:phasesRefresh';
const GAME_PHASES_MULLIGAN = 'game:phasesMulligan';
const GAME_PHASES_REFRESH_END = 'game:phasesRefreshEnd';
const GAME_PHASES_DRAW = 'game:phasesDraw';
const GAME_PHASES_DRAW_END = 'game:phasesDrawEnd';
const GAME_PHASES_DON = 'game:phasesDon';
const GAME_PHASES_DON_END = 'game:phasesDonEnd';
const GAME_PHASES_MAIN = 'game:phasesMain';
const GAME_PHASES_MAIN_END = 'game:phasesMainEnd';
const GAME_PHASE_END = 'game:phaseEnd';

const GAME_RIVAL_MULLIGAN = 'game:rivalMulligan';
const GAME_RIVAL_PHASES_REFRESH = 'game:rivalPhasesRefresh';
const GAME_RIVAL_PHASES_DRAW = 'game:rivalPhasesDraw';
const GAME_RIVAL_PHASES_DON = 'game:rivalPhasesDon';
const GAME_RIVAL_PHASES_MAIN = 'game:rivalPhasesMain';
const GAME_RIVAL_PHASES_END = 'game:rivalPhasesEnd';

// LISTENERS
const GAME_ROCK_PAPER_SCISSORS_CHOICE = 'game:rockPaperScissorsChoice';
const GAME_DECK_SELECTED = 'game:deckSelected';
const GAME_MULLIGAN = 'game:mulligan';

module.exports = {
  DUEL_JOIN,
  GAME_ROOM_JOIN,
  GAME_ROCK_SCISSORS_PAPER_START,
  GAME_ROCK_PAPER_SCISSORS_CHOICE,
  GAME_ROCK_SCISSORS_PAPER_RESULT,
  GAME_ROOM_CANCEL,
  GAME_DECK_SELECTED,
  GAME_INITIAL_BOARD_STATE,
  GAME_STATE,
  GAME_PHASES_MULLIGAN,
  GAME_TURN_START,
  GAME_TURN_WAIT,
  GAME_TURN_END,
  GAME_PHASES_REFRESH,
  GAME_MULLIGAN,
  GAME_RIVAL_PHASES_REFRESH,
  GAME_PHASES_REFRESH_END,
  GAME_PHASES_DRAW,
  GAME_PHASES_DRAW_END,
  GAME_RIVAL_PHASES_DRAW,
  GAME_RIVAL_MULLIGAN,
  GAME_PHASES_DON,
  GAME_RIVAL_PHASES_DON,
  GAME_PHASES_DON_END,
  GAME_PHASES_MAIN,

  GAME_PHASES_MAIN_END,
  GAME_PHASE_END,
  GAME_RIVAL_PHASES_MAIN,
  GAME_RIVAL_PHASES_END,
  GAME_TURN_SELECTION_INIT,
  GAME_TURN_SELECTION_CHOICE,
  GAME_TURN_SELECTION_END,
};
