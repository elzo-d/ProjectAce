import { Component, OnInit } from '@angular/core';
import { Card, SUITS } from '../card';

@Component({
  selector: 'app-pesten',
  templateUrl: './pesten.component.html',
  styleUrls: ['./pesten.component.css']
})
export class PestenComponent implements OnInit {

  stack:Card[] = [];

  userCards:Card[] = [];

  opponentCards:Card[] = [];

  pile:Card[] = [];

  offset:number;

  yourTurn:boolean = true;
  grabCards:number = 1;
  finished:boolean = false;
  won:boolean = false;

  ctx = undefined;
  img = undefined;

  constructor() { }

  ngOnInit() {
    for(let i = 1; i <= 13; i++) {
      this.stack.push(new Card(i, SUITS.HEARTS));
      this.stack.push(new Card(i, SUITS.DIAMONDS));
      this.stack.push(new Card(i, SUITS.SPADES));
      this.stack.push(new Card(i, SUITS.CLUBS));
    }
    this.stack.push(new Card(1, SUITS.JOKER));
    this.stack.push(new Card(2, SUITS.JOKER));
    this.shuffle(this.stack);
    for(let i = 0; i < 8; i++) {
      let userCard = this.stack.pop();
      userCard.visible = true;
      this.userCards.push(userCard);
      this.opponentCards.push(this.stack.pop());
    }
    let startCard = this.stack.pop();
    startCard.visible = true;
    this.pile.push(startCard);
    this.ctx = (<HTMLCanvasElement> document.getElementById("canvas")).getContext("2d");
    this.ctx.canvas.width = 800;
    this.ctx.canvas.height = 600;
    this.img = document.getElementById("img");
    this.img.onload = () => {this.onImageLoad()};
  }

  onImageLoad() {
    this.updateView(0, 0);
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

    if(this.yourTurn === user && !this.finished) {
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
          this.yourTurn = !this.yourTurn;
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
            this.yourTurn = !this.yourTurn;
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
    if(user) {
      let i;
      for(i = 0; i < this.userCards.length; i++) {
        if(this.userCards[i] === card) {
          break;
        }
      }
      this.userCards.splice(i, 1);
      if(this.userCards.length === 0) {
        this.finished = true;
        this.won = true;
      }
    } else {
      let i;
      for(i = 0; i < this.opponentCards.length; i++) {
        if(this.opponentCards[i] === card) {
          break;
        }
      }
      this.opponentCards.splice(i, 1);
      if(this.opponentCards.length === 0) {
        this.finished = true;
        this.won = false;
      }
    }
  }

  clickTable(stack, turn) {
    if(this.yourTurn === turn && stack && !this.finished) {
      // it's our turn

      for(let i = 0; i < this.grabCards; i++) {
        if(stack) {
          let card = this.stack.pop();
          if(this.stack.length === 0) {
            this.newStack();
          }
          if(turn) {
            card.visible = true;
            this.userCards.push(card);
          } else {
            this.opponentCards.push(card);
          }
        }
      }
      this.grabCards = 1;
      // finish turn
      this.yourTurn = !this.yourTurn
    }
  }

  newStack() {
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

  doOpponentTurn() {
    let found = false;
    for(let i = 0; i < this.opponentCards.length; i++) {
      let card = this.opponentCards[i];
      if(this.clickCard(card, false)) {
        found = true;
        card.visible = true;
        break;
      }
    }
    if(!found) {
      this.clickTable(true, false);
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
    if(my < 164 + 2) {
      // top row of cards
      this.doOpponentTurn();
    } else if(my > this.ctx.canvas.height - 164 - 2) {
      // bottom row of cards
      let xPos = (this.ctx.canvas.width / 2) - ((this.userCards.length * 62 + 62) / 2);
      if(xPos < 0) {
        xPos += (2 * -xPos) * (1 - (2 * (mx / this.ctx.canvas.width)));
      }
      let pickedCard = undefined;
      for(let card of this.userCards) {
        if(mx > xPos && mx < xPos + (card === this.userCards[this.userCards.length - 1] ? 124 : 62)) {
          pickedCard = card;
        }
        xPos += 62;
      }
      if(pickedCard) {
        this.clickCard(pickedCard, true);
      }
    } else {
      // middle of table
      if(
        my > this.ctx.canvas.height / 2 - 82 && my < this.ctx.canvas.height / 2 + 82 &&
        mx > this.ctx.canvas.width / 2 && mx < this.ctx.canvas.width / 2 + 124 + 2
      ) {
        this.clickTable(true, true);
      }
    }
    this.updateView(mx, my);
  }

  updateView(mx, my) {
    // card: 124 * 164
    // card overlap: 62 px
    let ctx = this.ctx;
    let c = ctx.canvas;
    ctx.fillStyle = "#009900";
    ctx.fillRect(0, 0, c.width, c.height);

    this.pile[this.pile.length - 1].draw(ctx, (c.width / 2) - 124 - 2, (c.height / 2) - 82, this.img, false);
    let highlight = (
      my > c.height / 2 - 82 && my < c.height / 2 + 82 &&
      mx > c.width / 2 && mx < c.width / 2 + 124 + 2
    );
    this.stack[this.stack.length - 1].draw(ctx, (c.width / 2) + 2, (c.height / 2) - 82, this.img, highlight && !this.finished);

    let xPos = (c.width / 2) - ((this.opponentCards.length * 62 + 62) / 2);
    for(let card of this.opponentCards) {
      card.draw(ctx, xPos, 2, this.img, false);
      xPos += 62;
    }
    xPos = (c.width / 2) - ((this.userCards.length * 62 + 62) / 2);
    if(xPos < 0) {
      xPos += (2 * -xPos) * (1 - (2 * (mx / c.width)));
    }
    for(let card of this.userCards) {
      let highlight = (
        my > c.height - 164 - 2 &&
        mx > xPos && mx < xPos + (card === this.userCards[this.userCards.length - 1] ? 124 : 62)
      );
      card.draw(ctx, xPos, c.height - 164 - 2, this.img, highlight && !this.finished);
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
      ctx.fillText(this.won ? "You won!" : "You lost...", c.width / 2, c.height / 2 + 10);
    }
  }

}
