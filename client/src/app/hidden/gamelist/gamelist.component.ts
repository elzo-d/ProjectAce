import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../game-data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

class ActiveGame {
  gameType:string;
  name:string;
  players:number;
}

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.css']
})
export class GamelistComponent implements OnInit {

  activeGames:ActiveGame[] = [];

  selectedGame:string;

  finalList:ActiveGame[] = [];
  inGameAlready:boolean = true;

  subscription = undefined;

  constructor(
    private gameDataService:GameDataService,
    private router:Router,
    private http:HttpClient,
    private auth:AuthService
  ) { }

  ngOnInit() {
    this.selectedGame = this.gameDataService.selectedGame.value;

    this.http.post("http://localhost:5000/api/pesten/list", {userId: this.auth.getId()}).subscribe(
      res => this.handleRequest(res),
      err => console.log(err)
    );

    this.subscription = this.gameDataService.selectedGame$.subscribe(n => {
      this.selectedGame = n;
      this.getList();
      this.http.post("http://localhost:5000/api/pesten/list", {userId: this.auth.getId()}).subscribe(
        res => this.handleRequest(res),
        err => console.log(err)
      );
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleRequest(res) {
    this.activeGames = [];
    for(let item of res.data.games) {
      this.activeGames.push({
        gameType: item.game,
        name: item.hash,
        players: item.players
      });
    }
    this.getList();
    this.inGameAlready = res.data.inGame;
    console.log(res.data);
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
    this.finalList = finalList;
  }

  handleGameStart(res) {
    if(res.error !== "success") {
      console.log("Can't join game: " + res.error);
    } else {
      this.router.navigateByUrl("/hidden/pesten");
    }
  }

  joinGame(game) {
    // join the game
    console.log("Joining " + game.name + " (type: " + game.gameType + ")");
    this.http.post("http://localhost:5000/api/pesten", {
      type: 2,
      gameHash: game.name,
      userId: this.auth.getId()
    }).subscribe(
      res => {this.handleGameStart(res)},
      err => console.log(err)
    );
  }

  backToGame(game) {
    // go back to an existing game
    console.log("Going back to game (type: " + this.selectedGame + ")");
    this.router.navigateByUrl("/hidden/pesten");
  }

  joinRandom() {
    // join a random game
    if(this.finalList.length < 1) {
      console.log("No game to join");
      return;
    }
    let n = Math.floor(Math.random() * this.finalList.length);
    this.joinGame(this.finalList[n]);
  }

  newGame() {
    // start new game
    console.log("Starting new game (type: " + this.selectedGame + ")");
    this.http.post("http://localhost:5000/api/pesten", {
      type: 0,
      userId: this.auth.getId()
    }).subscribe(
      res => {this.handleGameStart(res)},
      err => console.log(err)
    );
  }

  getTitle() {
    if(this.selectedGame) {
      return "Lobby - " + this.selectedGame;
    }
    return "Lobby";
  }

}
