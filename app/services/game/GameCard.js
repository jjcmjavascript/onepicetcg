class GameCard {
  constructor(cardObject) {
    this.id = cardObject.id;
    this.asiaUsable = cardObject.asia_usable;
    this.attackType = cardObject.attack_type;
    this.banish = cardObject.banish;
    this.blocker = cardObject.blocker;
    this.cardNumber = cardObject.card_number;
    this.cardText = cardObject.card_text;
    this.code = cardObject.code;
    this.cost = cardObject.cost;
    this.counter = cardObject.counter;
    this.createdAt = cardObject.createdAt;
    this.donRemove = cardObject.don_remove;
    this.donRest = cardObject.don_rest;
    this.donSet = cardObject.don_set;
    this.doubleAttack = cardObject.double_attack;
    this.euUsable = cardObject.eu_usable;
    this.fullImageId = cardObject.full_image_id;
    this.imageId = cardObject.image_id;
    this.isAlternative = cardObject.is_alternative;
    this.lives = cardObject.lives;
    this.name = cardObject.name;
    this.otherName = cardObject.other_name;
    this.packId = cardObject.pack_id;
    this.pivot_decks_cards = cardObject.pivot_decks_cards;
    this.power = cardObject.power;
    this.rush = cardObject.rush;
    this.trigger = cardObject.trigger;
    this.typeId = cardObject.type_id;
    this.updatedAt = cardObject.updatedAt;
    this.uuid = cardObject.uuid;
    this._categories = cardObject._categories;
    this._colors = cardObject._colors;
    this._image = cardObject._image;
    this._image_full = cardObject._image_full;
    this._type = cardObject._type;

    // Game attributes
    this.underCardId = cardObject.underCardId || null;
    this.overCards = cardObject.overCards || [];
    this.rested = cardObject.rested || false;
    this.powerAdded = cardObject.powerAdded || [];
    this.toSelect = cardObject.toSelect || false;
    this.selected = cardObject.selected || false;
  }

  get newId() {
    return 'my id_' + this.id;
  }

  static create = (cardObject) => {
    return new GameCard(cardObject);
  };
}

module.exports = GameCard;
