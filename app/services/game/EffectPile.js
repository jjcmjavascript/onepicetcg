const effects = {
  draw: {
    name: 'game:draw',
    description: 'Draw a card from the top of the deck',
    costs: [],
    effects: [draw]
  },
  discard: {
    name: 'game:discard',
    description: 'Discard a card from the hand',
    costs: [],
    effects: [discard]
  }
}
