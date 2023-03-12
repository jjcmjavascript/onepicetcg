const draw = (board, quantity = 1) => {
  const deck = [...board.deck];
  const hand = [...board.hand];

  board.hand = [...hand, ...deck.splice(0, quantity)];
  board.deck = deck;

  return {
    ...board,
  };
};

const drawDon = (board, quantity = 1) => {
  const { dons, costs } = board;

  board.costs = [...costs, ...dons.splice(0, quantity)];

  return board;
};

const removeDon = (board, quantity = 1) => {
  const { dons, costs } = board;

  board.dons = [...dons, ...costs.splice(0, quantity)];
};
module.exports = {
  draw,
  drawDon,
  removeDon,
};
