import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameDataService {

  selectedGame:BehaviorSubject<string> = new BehaviorSubject<string>(undefined);

  selectedGame$ = this.selectedGame.asObservable();

  constructor() { }

  selectGame(game) {
    this.selectedGame.next(game);
  }

  deselectGame() {
    this.selectedGame.next(undefined);
  }
}
