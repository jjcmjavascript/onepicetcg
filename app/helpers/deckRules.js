const DON_ID = 1;
const LEADER_ID = 2;

const isFull = (deck) => deck.cards.length === 52;

const isMaxCardQuanotityAllowed = (card, deck) => {
  return (
    deck.cards.filter((currentCard) => currentCard.code === card.code).length >=
    4
  );
};

const doesNotHasDon = (deck) =>
  deck.cards.filter((card) => card.type_id === DON_ID).length === 0;

const hasOneDon = (deck) =>
  deck.cards.filter((card) => card.type_id === DON_ID).length === 1;

const doesNotHasLeader = (deck) =>
  deck.cards.filter((card) => card.type_id === LEADER_ID).length === 0;

const hasOneLeader = (deck) =>
  deck.cards.filter((card) => card.type_id === LEADER_ID).length === 1;

const isAllowed = (card, deck) => {
  const generalRule = !isFull(deck) && !isMaxCardQuanotityAllowed(card, deck);
  const allowedInDonCase = card.type_id === DON_ID && doesNotHasDon(deck);
  const allowedInLeaderCase =
    card.type_id === LEADER_ID && doesNotHasLeader(deck);

  return (
    generalRule &&
    (![DON_ID, LEADER_ID].includes(card.type_id) ||
      ([DON_ID, LEADER_ID].includes(card.type_id) &&
        (allowedInDonCase || allowedInLeaderCase)))
  );
};

const isValidDeck = (deck) => {
  return hasOneDon(deck) && hasOneLeader(deck) && isFull(deck) && deck.name;
};

module.exports = {
  isFull,
  isAllowed,
  doesNotHasDon,
  doesNotHasLeader,
  isValidDeck,
  hasOneDon,
  hasOneLeader,
  isMaxCardQuanotityAllowed,
};
