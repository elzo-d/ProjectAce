import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../card';

@Component({
  selector: 'app-pcard',
  templateUrl: './pcard.component.html',
  styleUrls: ['./pcard.component.css']
})
export class PcardComponent implements OnInit {

  @Input() card:Card;

  constructor() { }

  ngOnInit() {
  }

}
