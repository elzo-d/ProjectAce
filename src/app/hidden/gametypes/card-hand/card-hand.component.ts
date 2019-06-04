import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card, SUITS } from '../card';

@Component({
  selector: 'app-card-hand',
  templateUrl: './card-hand.component.html',
  styleUrls: ['./card-hand.component.css']
})
export class CardHandComponent implements OnInit {

  @Input() cards:Card[];
  @Input() playersCards:boolean;
  @Input() marOff:number;
  @Output() cardClicked = new EventEmitter<Card>();

  constructor() { }

  ngOnInit() {
  }

  clickCard(card):void {
    this.cardClicked.emit(card);
  }

}
