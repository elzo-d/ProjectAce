import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../game-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gamebar',
  templateUrl: './gamebar.component.html',
  styleUrls: ['./gamebar.component.css']
})
export class GamebarComponent implements OnInit {

  constructor(
    private gameDataService:GameDataService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  selectGame(game) {
    this.router.navigateByUrl("/hidden/lobby");
    if(game) {
      this.gameDataService.selectGame(game);
    } else {
      this.gameDataService.deselectGame();
    }
  }

}
