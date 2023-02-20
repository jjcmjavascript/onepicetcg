function deckDivider({ deck, types }) {
  const don = deck.find((card) => card.type_id === types.DON);
  const leader = deck.find((card) => card.type_id === types.LEADER);
  const dons = deck.filter((card) => card.type_id === types.DON);
  const characters = deck.filter(
    (card) => card.type_id !== types.DON && card.type_id !== types.LEADER
  );

  return {
    don,
    leader,
    characters,
    dons,
  };
}

module.exports = deckDivider;
