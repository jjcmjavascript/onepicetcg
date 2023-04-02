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
}

module.exports = Effects;
