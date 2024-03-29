const { v4: idGenerator } = require('uuid');

/**
 * @param {DeckModel} deck
 * @param {Object} types
 * @returns
 */
function formatCardsForDeck({ deck, types, cardModel }) {
  const don = deck._cards.find((card) => card.type_id === types.DON);
  const cards = [];

  deck._cards.forEach((card) => {
    const quantity = card.pivot_decks_cards.quantity;
    for (let i = 0; i < quantity; i++) {
      cards.push(
        new cardModel({
          ...card,
          uuid: idGenerator(),
        })
      );
    }
  });

  for (let i = 0; i < 9; i++) {
    cards.push(
      new cardModel({
        ...don,
        uuid: idGenerator(),
      })
    );
  }

  return cards;
}

module.exports = formatCardsForDeck;
