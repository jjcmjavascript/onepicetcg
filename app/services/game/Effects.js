class Effects {
  drawFromTop(arr, quantity = 1) {
    const currentArray = [...arr];
    const drawed = currentArray.splice(0, quantity);

    return {
      result: drawed,
      changed: currentArray,
    };
  }
}

module.exports = Effects;
