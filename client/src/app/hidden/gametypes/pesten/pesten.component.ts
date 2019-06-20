import { Component, OnInit } from '@angular/core';
import { Card, SUITS } from '../card';

@Component({
  selector: 'app-pesten',
  templateUrl: './pesten.component.html',
  styleUrls: ['./pesten.component.css']
})
export class PestenComponent implements OnInit {

  stack:Card[] = [];

  userCards:Card[][] = [];

  pile:Card[] = [];

  turn:number = 0;
  grabCards:number = 1;
  finished:boolean = false;
  won:number = 0;

  ctx = undefined;
  img = undefined;

  constructor() { }

  ngOnInit() {
    this.ctx = (<HTMLCanvasElement> document.getElementById("canvas")).getContext("2d");
    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetHeight;
    this.img = document.getElementById("img");
    this.img.onload = () => {this.onImageLoad()};
    window.onresize = () => {this.onResize()};
    this.reset();
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
    for(let j = 0; j < 4; j++) {
      this.userCards.push([]);
      for(let i = 0; i < 8; i++) {
        let userCard = this.stack.pop();
        userCard.visible = j === 0 ? true : false;
        this.userCards[j].push(userCard);
      }
    }
    let startCard = this.stack.pop();
    startCard.visible = true;
    this.pile.push(startCard);
    //window.setTimeout(() => {this.autoPlay()}, 100);
  }

  autoPlay() {
    this.doOpponentTurn(this.turn);
    this.updateView(0, 0);
    if(!this.finished) {
      window.setTimeout(() => {this.autoPlay()}, 100);
    }
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

  onImageLoad() {
    this.updateView(0, 0);
  }

  onResize() {
    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetHeight;
    window.setTimeout(() => this.updateView(0, 0), 0);
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
        if(card.getSuit() === "Joker" || card.number === 2) {
          this.pile.push(card);
          this.removeCardFromUser(card, user);
          if(card.getSuit() === "Joker") {
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
          card.getSuit() === this.getTopPileCard().getSuit() ||
          card.number === this.getTopPileCard().number ||
          card.number === 11 || card.getSuit() === "Joker" ||
          this.getTopPileCard().getSuit() === "Joker"
        ) {
          this.pile.push(card);
          this.removeCardFromUser(card, user);
          if(card.getSuit() === "Joker") {
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
      if(this.userCards[user][i] === card) {
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
        card.visible = turn === 0 ? true : false;
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
    for(let card of this.stack) {
      card.visible = false;
    }
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
        card.visible = true;
        break;
      }
    }
    if(!found) {
      this.clickStack(user);
    }
  }

  onCanvasMove(e) {
    let mx = e.offsetX;
    let my = e.offsetY;
    this.updateView(mx, my);
  }

  onCanvasClick(e) {
    let mx = e.offsetX;
    let my = e.offsetY;

    if(this.finished) {
      this.reset();
      this.updateView(mx, my);
      return;
    }

    if(my < 164 + 2) {
      // top row of cards
      this.doOpponentTurn(this.turn);
    } else if(my > this.ctx.canvas.height - 164 - 2) {
      // bottom row of cards
      let xPos = (this.ctx.canvas.width / 2) - ((this.userCards[0].length * 62 + 62) / 2);
      if(xPos < 0) {
        xPos += (2 * -xPos) * (1 - (2 * (mx / this.ctx.canvas.width)));
      }
      let pickedCard = undefined;
      for(let card of this.userCards[0]) {
        if(mx > xPos && mx < xPos + (card === this.userCards[0][this.userCards[0].length - 1] ? 124 : 62)) {
          pickedCard = card;
        }
        xPos += 62;
      }
      if(pickedCard) {
        this.clickCard(pickedCard, 0);
      }
    } else {
      // middle of table
      if(
        my > this.ctx.canvas.height / 2 - 82 && my < this.ctx.canvas.height / 2 + 82 &&
        mx > this.ctx.canvas.width / 2 && mx < this.ctx.canvas.width / 2 + 124 + 2
      ) {
        this.clickStack(0);
      }
    }
    this.updateView(mx, my);
  }

  updateView(mx, my) {
    // card: 124 * 164
    // card overlap: 62 px
    let ctx = this.ctx;
    let c = ctx.canvas;
    ctx.fillStyle = "#5ba318";
    ctx.fillRect(0, 0, c.width, c.height);

    this.pile[this.pile.length - 1].draw(ctx, (c.width / 2) - 124 - 2, (c.height / 2) - 82, this.img, false, false);
    let highlight = (
      my > c.height / 2 - 82 && my < c.height / 2 + 82 &&
      mx > c.width / 2 && mx < c.width / 2 + 124 + 2
    );
    this.stack[this.stack.length - 1].draw(ctx, (c.width / 2) + 2, (c.height / 2) - 82, this.img, highlight && !this.finished, false);

    let xPos = (c.height / 2) - ((this.userCards[1].length * 62 + 62) / 2);
    for(let card of this.userCards[1]) {
      card.draw(ctx, 2, xPos, this.img, false, true);
      xPos += 62;
    }

    xPos = (c.width / 2) - ((this.userCards[2].length * 62 + 62) / 2);
    for(let card of this.userCards[2]) {
      card.draw(ctx, xPos, 2, this.img, false, false);
      xPos += 62;
    }

    xPos = (c.height / 2) - ((this.userCards[3].length * 62 + 62) / 2);
    for(let card of this.userCards[3]) {
      card.draw(ctx, c.width - 164 - 2, xPos, this.img, false, true);
      xPos += 62;
    }


    xPos = (c.width / 2) - ((this.userCards[0].length * 62 + 62) / 2);
    if(xPos < 0) {
      xPos += (2 * -xPos) * (1 - (2 * (mx / c.width)));
    }
    for(let card of this.userCards[0]) {
      let highlight = (
        my > c.height - 164 - 2 &&
        mx > xPos && mx < xPos + (card === this.userCards[0][this.userCards[0].length - 1] ? 124 : 62)
      );
      card.draw(ctx, xPos, c.height - 164 - 2, this.img, highlight && !this.finished, false);
      xPos += 62;
    }

    if(this.finished) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      ctx.font = "bold 40px arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      ctx.fillText(this.won === 0 ? "You won!" : "You lost...", c.width / 2, c.height / 2);
      ctx.font = "15px arial";
      ctx.fillText("Click to play again", c.width / 2, c.height / 2 + 30);
    }
  }

}
