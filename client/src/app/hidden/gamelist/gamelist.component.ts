import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../game-data.service';
import { Router } from '@angular/router';

class ActiveGame {
  gameType:string;
  name:string;
}

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.css']
})
export class GamelistComponent implements OnInit {

  activeGames:ActiveGame[] = [
    {gameType: "Pesten", name: "Game 1"},
    {gameType: "Pesten", name: "Game 2"},
    {gameType: "KingMarker", name: "Game 3"},
    {gameType: "KingMarker", name: "hh"},
  ];

  selectedGame:string;

  constructor(
    private gameDataService:GameDataService,
    private router:Router
  ) { }

  ngOnInit() {
    this.selectedGame = this.gameDataService.selectedGame.value;
    this.gameDataService.selectedGame$.subscribe(n => {this.selectedGame = n});
  }

  getList() {
    let finalList = [];
    for(let game of this.activeGames) {
      if(this.selectedGame) {
        if(game.gameType === this.selectedGame) {
          finalList.push(game);
        }
      } else {
        finalList.push(game);
      }
    }
    return finalList;
  }

  joinGame(game) {
    // join the game
    console.log("Joining " + game.name + " (type: " + game.gameType + ")");
  }

  joinRandom() {
    // join a random game
    if(this.selectedGame) {
      console.log("Joining random game (type: " + this.selectedGame + ")");
    } else {
      console.log("Joining random game");
    }
  }

  singlePlayer() {
    // play singleplayer
    console.log("Doing singleplayer game (type: " + this.selectedGame + ")");
    this.router.navigateByUrl("/hidden/pesten");
  }

  getTitle() {
    if(this.selectedGame) {
      return "Lobby - " + this.selectedGame;
    }
    return "Lobby";
  }

}
