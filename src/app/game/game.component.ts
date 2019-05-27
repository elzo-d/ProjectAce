import { Component, OnInit } from '@angular/core';
import { Card, SUITS } from '../card';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  stack:Card[] = [];

  userCards:Card[] = [];

  opponentCards:Card[] = [];

  pile:Card[] = [];

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

  clickCard(card) {
    this.pile.push(card);
    let i;
    for(i = 0; i < this.userCards.length; i++) {
      if(this.userCards[i] === card) {
        break;
      }
    }
    this.userCards.splice(i, 1);
  }

  clickTable(stack) {
    if(stack) {
      let card = this.stack.pop();
      card.visible = true;
      this.userCards.push(card);
    }
  }

}
