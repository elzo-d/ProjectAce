import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from "../card";

@Component({
  selector: 'app-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.css']
})
export class CardTableComponent implements OnInit {

  @Input() stack:Card[];
  @Input() pile:Card[];
  @Output() stackClicked = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  onClick(type) {
    this.stackClicked.emit(type);
  }

}
