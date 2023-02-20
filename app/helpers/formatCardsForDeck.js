function formatCardsForDeck({ deck, idGenerator }) {
  const don = deck._cards.find((card) => card.type_id === DON);
  const cards = [];

  deck._cards.forEach((card) => {
    const quantity = card.pivot_decks_cards.quantity;
    for (let i = 0; i < quantity; i++) {
      cards.push({
        ...card,
        uuid: idGenerator(),
      });
    }
  });

  for (let i = 0; i < 9; i++) {
    cards.push({
      ...don,
      uuid: idGenerator(),
    });
  }

  return decks;
};

module.exports = formatCardsForDeck;
