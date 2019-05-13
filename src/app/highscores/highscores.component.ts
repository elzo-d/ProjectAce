import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.css']
})
export class HighscoresComponent implements OnInit {

  entries: Entry[];

  constructor() { }

  ngOnInit() {
    this.fillEntries();
  }

  fillEntries() {
    // TODO: get from database
    this.entries = [
      { rank: 1, name: 'coolkid94', score: 9001 },
      { rank: 2, name: 'parkieteigenaar', score: 8999 },
      { rank: 3, name: 'elzUser', score: 8500 },
      { rank: 4, name: 'knoalboy', score: 7400 },
      { rank: 5, name: 'Henk', score: 7345 },
      { rank: 6, name: 'Gerard', score: 6296 },
      { rank: 7, name: 'Piet', score: 5190 },
    ]
  }
}

interface Entry {
  rank: number;
  name: string;
  score: number;
}