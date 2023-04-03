class Effects {
  drawFromTop(arr, quantity = 1) {
    const currentArray = [...arr];
    const drawed = currentArray.splice(0, quantity);

    return {
      result: drawed,
      changed: currentArray,
    };
  }

  refresh(arr) {
    const currentArray = [...arr];

    currentArray.forEach((card) => {
      card.rested = false;
      card.underCardId = null;
    });

    return currentArray;
  }

  sumAttack({ card, mount = 1000 }) {
    const newCard = { ...card };
    newCard.powerAdded.push(mount);

    return {
      result: newCard,
    };
  }

  pushUnder({ card, underCard }) {
    const newCard = { ...card, overCards: [...card.overCards, underCard.uuid] };
    const newUnderCard = { ...underCard, underCardId: newCard.uuid };

    return {
      card: newCard,
      underCard: newUnderCard,
    };
  }
}

module.exports = Effects;
