const { formatCardsForDeck, deckDivider, shuffle } = require('../../helpers');
const types = require('../../helpers/cardTypes');
const GameCard = require('./GameCard');
class Player {
  /**
   * @param {Object{ id , deckId}} player
   */
  constructor(player) {
    this.id = player.id;
    this.deckId = player.deckId;
    this.rockPaperScissorChoice = player.rockPaperScissorChoice || null;
    this.didMulligan = player.didMulligan || false;
    this.mulliganAvailable = player.mulliganAvailable || true;
    this.locked = player.locked || false;
    this.mode = player.mode || null;
    this.pedingEffects = player.pedingEffects || [];
    this.continuesEffects = player.continuesEffects || [];

    this.leader = player.leader || null;
    this.don = player.don || null;
    this.stage = player.stage || null;
    this.characters = player.characters || [];
    this.costs = player.costs || [];
    this.trash = player.trash || [];
    this.dons = player.dons || [];
    this.lives = player.lives || [];
    this.deck = player.deck || [];
    this.hand = player.hand || [];
  }

  get board() {
    return {
      leader: this.leader,
      don: this.don,
      stage: this.stage,
      characters: this.characters,
      costs: this.costs,
      trash: this.trash,
      dons: this.dons,
      lives: this.lives,
      deck: this.deck,
      hand: this.hand,
    };
  }

  static factoryFromObject(schema) {
    const player = new Player({});
    player.setDataFromObject(schema);

    return player;
  }

  setBoardFromDeckModel(deck) {
    this.setDataFromObject(this.getFormatedBoard(deck));
  }

  setDataFromObject(schema) {
    Object.keys(schema).forEach((key) => {
      let value = schema[key];
      if (Array.isArray(value)) {
        value = [...value];
      } else if (value && typeof value === 'object') {
        value = { ...value };
      }
      this[key] = value;
    });
  }

  /**
   * @param {Array [CardModel]} deck
   */
  getFormatedBoard(deck) {
    const playerDeckStructure = formatCardsForDeck({
      deck,
      types,
      cardModel: GameCard,
    });

    const playerDeckSplitted = deckDivider({
      deck: playerDeckStructure,
      types,
    });

    const playerDeckShuffled = shuffle(playerDeckSplitted.characters);
    const hand = playerDeckShuffled.splice(0, 5);

    return {
      hand,
      deck: playerDeckShuffled,
      don: playerDeckSplitted.don,
      leader: playerDeckSplitted.leader,
      dons: playerDeckSplitted.dons,
      lives: [],
      trash: [],
      stage: null,
      characters: [],
      costs: [],
    };
  }

  setHand(hand) {
    this.hand = hand;
  }

  setDeck(deck) {
    this.deck = deck;
  }

  setLives(lives) {
    this.lives = lives;
  }

  setMulligan(didMulligan) {
    this.didMulligan = didMulligan;
    this.mulliganAvailable = false;
  }

  setCosts(costs) {
    this.costs = costs;
  }

  setDons(dons) {
    this.dons = dons;
  }

  changeCharacter(card) {
    const characters = this.characters.map((character) => {
      if (character.uuid === card.uuid) {
        return card;
      }
      return character;
    });

    this.characters = characters;
    º;
  }

  changeCost(card) {
    const costs = this.costs.map((cost) => {
      if (cost.uuid === card.uuid) {
        return card;
      }
      return cost;
    });

    this.costs = costs;
  }

  setLock(locked) {
    this.locked = locked;
  }

  setSelectionMode(mode) {
    this.selectionMode = mode;
  }

  setPedingEffects(pedingEffects) {
    this.pedingEffects = pedingEffects;
  }

  setContinuesEffects(continuesEffects) {
    this.continuesEffects = continuesEffects;
  }

  merge(playerState) {
    return new Player({
      ...this,
      ...playerState,
    });
  }
}

module.exports = Player;
