import { Component, OnInit } from '@angular/core';
import { Card, SUITS } from '../card';

@Component({
  selector: 'app-card-hand',
  templateUrl: './card-hand.component.html',
  styleUrls: ['./card-hand.component.css']
})
export class CardHandComponent implements OnInit {

  cards:Card[] = [
    new Card(1, SUITS.HEARTS),
    new Card(11, SUITS.DIAMONDS),
    new Card(12, SUITS.SPADES),
    new Card(13, SUITS.CLUBS),
  ];

  selectedCard:Card;

  constructor() { }

  ngOnInit() {
  }

  addCard(card):void {
    this.cards.push(card);
  }

  clickCard(card):void {
    this.selectedCard = card;
  }

}
