
const PLAYERS = 2;

class Pesten {
  constructor() {
    this.stack = [];
    this.pile = [];
    this.userCards = [];
    this.turn = 0;
    this.grabCards = 1;
    this.finished = false;
    this.won = 0;
    this.reset();

    this.joinedUsers = [];
  }

  reset() {
    this.stack = [];
    this.userCards = [];
    this.pile = [];
    this.turn = 0;
    this.grabCards = 1;
    this.finished = false;
    this.won = 0;
    this.addPackToStack();
    this.addPackToStack();
    this.shuffle(this.stack);
    for(let j = 0; j < PLAYERS; j++) {
      this.userCards.push([]);
      for(let i = 0; i < 8; i++) {
        let userCard = this.stack.pop();
        this.userCards[j].push(userCard);
      }
    }
    let startCard = this.stack.pop();
    this.pile.push(startCard);
  }

  addPackToStack() {
    for(let i = 1; i <= 13; i++) {
      this.stack.push(new Card(i, SUITS.HEARTS));
      this.stack.push(new Card(i, SUITS.DIAMONDS));
      this.stack.push(new Card(i, SUITS.SPADES));
      this.stack.push(new Card(i, SUITS.CLUBS));
    }
    this.stack.push(new Card(1, SUITS.JOKER));
    this.stack.push(new Card(2, SUITS.JOKER));
  }

  shuffle(arr) {
    for(let i = 0; i < arr.length; i++) {
      let r = Math.floor(Math.random() * (arr.length - i));
      let temp = arr[arr.length - i - 1];
      arr[arr.length - i - 1] = arr[r];
      arr[r] = temp;
    }
    return arr;
  }

  clickCard(card, user) {

    if(this.turn === user && !this.finished) {
      // it's our turn
      if(this.grabCards > 1) {
        // a grab-card was thrown, we need to grab or throw a grab-card of our own
        if(card.suit === SUITS.JOKER || card.number === 2) {
          this.pile.push(card);
          this.removeCardFromUser(card, user);
          if(card.suit === SUITS.JOKER) {
            this.grabCards += 5;
          } else {
            this.grabCards += 2;
          }
          // finish turn
          this.nextTurn();
          return true;
        } else {
          return false;
        }
      } else {
        // normal turn
        if(
          card.suit === this.getTopPileCard().suit ||
          card.number === this.getTopPileCard().number ||
          card.number === 11 || card.suit === SUITS.JOKER ||
          this.getTopPileCard().suit === SUITS.JOKER
        ) {
          this.pile.push(card);
          this.removeCardFromUser(card, user);
          if(card.suit === SUITS.JOKER) {
            this.grabCards = 5;
          } else if(card.number === 2) {
            this.grabCards = 2;
          }
          if(card.number !== 7 && card.number !== 8) {
            // finish turn
            this.nextTurn();
          }
          return true;
        } else {
          return false;
        }
      }
    }
  }

  getTopPileCard() {
    return this.pile[this.pile.length - 1];
  }

  removeCardFromUser(card, user) {
    let i;
    for(i = 0; i < this.userCards[user].length; i++) {
      if(this.userCards[user][i].equals(card)) {
        break;
      }
    }
    this.userCards[user].splice(i, 1);
    if(this.userCards[user].length === 0) {
      this.finished = true;
      this.won = user;
    }
  }

  clickStack(turn) {
    if(this.turn === turn && !this.finished) {
      // it's our turn

      for(let i = 0; i < this.grabCards; i++) {
        let card = this.stack.pop();
        if(this.stack.length === 0) {
          this.newStack();
        }
        this.userCards[turn].push(card);
      }
      this.grabCards = 1;
      // finish turn
      this.nextTurn();
    }
  }

  newStack() {
    if(this.pile.length < 2) {
      this.stack = [];
      this.addPackToStack();
      this.shuffle(this.stack);
      console.log(
        "New stack generated - Added new pack of cards to stack: Stack length: " + this.stack.length +
        ", Pile length: " + this.pile.length
      );
      return;
    }
    this.stack = this.pile.splice(0, this.pile.length - 1);
    this.shuffle(this.stack);
    console.log(
      "New stack generated: Stack length: " + this.stack.length +
      ", Pile length: " + this.pile.length
    );
  }

  nextTurn() {
    this.turn = (this.turn + 1) % this.userCards.length;
  }

  doOpponentTurn(user) {
    let found = false;
    for(let i = 0; i < this.userCards[user].length; i++) {
      let card = this.userCards[user][i];
      if(this.clickCard(card, user)) {
        found = true;
        break;
      }
    }
    if(!found) {
      this.clickStack(user);
    }
  }

  doUpdate(type, card, user) {
    switch(type) {
      case MOVE_TYPE.HAND_CARD: {
        this.clickCard(card, user);
        break;
      }
      case MOVE_TYPE.STACK_CARD: {
        this.clickStack(user);
        break;
      }
      case MOVE_TYPE.OPPONENT: {
        this.doOpponentTurn(this.turn);
        break;
      }
      case MOVE_TYPE.UPDATE: {
        // don't change game state, only requesting new state
        break;
      }
    }
  }

  getState(user) {
    let cardList = [];
    for(let card of this.userCards[user]) {
      cardList.push(card.getArray());
    }
    let otherLengths = [];
    for(let i = 1; i < PLAYERS; i++) {
      let ind = (user + i) % PLAYERS;
      otherLengths.push(this.userCards[ind].length);
    }
    return {
      waiting: false,
      userCards: cardList,
      otherCards: otherLengths,
      pileTop: this.getTopPileCard().getArray(),
      turn: this.turn,
      finished: this.finished,
      won: this.won,
      user: user,
      joinedUsers: this.joinedUsers
    }
  }
}

const SUITS = {
  JOKER: 0,
  SPADES: 1,
  HEARTS: 2,
  DIAMONDS: 3,
  CLUBS: 4
}

const MOVE_TYPE = {
  HAND_CARD: 0,
  STACK_CARD: 1,
  OPPONENT: 2,
  UPDATE: 3
}

class Card {
  constructor(number, suit) {
    this.suit = suit;
    this.number = number;
  }

  setFromArray(arr) {
    this.suit = arr[0];
    this.number = arr[1];
  }

  getArray() {
    return [this.suit, this.number];
  }

  equals(card) {
    return this.suit === card.suit && this.number === card.number
  }
}

module.exports = {
  Pesten: Pesten,
  SUITS: SUITS,
  MOVE_TYPE: MOVE_TYPE,
  Card: Card,
  PLAYERS: PLAYERS
}
