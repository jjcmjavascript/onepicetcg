/**
 * @param {Array} deck
 * @param {Object} types
 * @return {Object {don, leader, characters, dons}}
 */
function deckDivider({ deck, types }) {
  const don = deck.find((card) => card.typeId === types.DON);
  const leader = deck.find((card) => card.typeId === types.LEADER);
  const dons = deck.filter((card) => card.typeId === types.DON);
  const characters = deck.filter(
    (card) => card.typeId !== types.DON && card.typeId !== types.LEADER
  );

  return {
    don,
    leader,
    characters,
    dons,
  };
}

module.exports = deckDivider;
