const effects = {
  selectCharacter: {
    name: 'game:selectCharacter',
    description: 'Select a character',
    costs: [],
    effects: (card) => {
      return card;
    },
  },
  draw: {
    name: 'game:draw',
    description: 'Draw a card from the top of the deck',
    costs: [],
    effects: ['draw'],
  },
  discard: {
    name: 'game:discard',
    description: 'Discard a card from the hand',
    costs: [],
    effects: ['discard'],
  },
  addAttack: {
    name: 'game:addAttack',
    description: 'Add attack to a character',
    costs: [],
    effects: ['addAttack'],
  },
};
