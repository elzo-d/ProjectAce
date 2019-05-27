import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';

import Entry from './Entry';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css']
})
export class HighscoresComponent implements OnInit {

  entries: Entry[];
  username = new FormControl('');
  score = new FormControl('');

  constructor() {}

  ngOnInit() {
    this.fillEntries();
  }

  fillEntries(): void {
    // TODO: get from database
    this.entries = [
      {rank: 1, name: 'coolkid94', score: 9001},
      {rank: 2, name: 'parkieteigenaar', score: 8999},
      {rank: 3, name: 'elzUser', score: 8500},
      {rank: 4, name: 'knoalboy', score: 7400},
      {rank: 5, name: 'Henk', score: 7345},
      {rank: 6, name: 'Gerard', score: 6296},
      {rank: 7, name: 'Piet', score: 5190},
    ]
    this.sortEntries();
  }

  addScore(): void {
    this.entries.push({
      rank: this.entries.length + 1,
      name: this.username.value,
      score: this.score.value
    })

    this.sortEntries();
  }

  sortEntries(): void {
    this.entries.sort((a, b) => (a.score < b.score) ? 1 : -1);

    let index: number = 1;
    for (let entry of this.entries) {
      entry.rank = index++;
    }
  }
}