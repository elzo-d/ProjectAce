import { Component, OnInit } from '@angular/core';
import { GameDataService } from '../game-data.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';

import { URL } from '../../config';

class ActiveGame {
  gameType:string;
  name:string;
  players:number;
}

const GAME_DESC = {
  Pesten: "Pesten is a dutch card game that has a weak relationship with the game Crazy Eights.",
  KingMarker: "KingMarker is a card game that happens to be fully identical to Pesten apart from the name."
}

const GAME_RULES = {
  Pesten: `Players take turns. The player who gets rid of all card first, wins.
  If it is your turn, a card needs to be thrown on the pile (on the left),
  or a card needs to be taken from the stack (on the right). A card can only go on the pile if it matches in number or in suit.
  Certain cards have special effects:
  A Joker-card (which can go on any card) means that the next player has to grab 5 cards from the stack.
  A 2 means that the next player has to grab 2 cards from the stack.
  A 7 means that you get to have another turn, an 8 means the same.
  A Jack can be placed on any card.
  If someone needs to grab cards because of a Joker-card or a 2, he can instead also place a Joker-card or 2 on top of it.
  The player after him will then need to grab the total accumulated grab-count (or also place a Joker-card or 2).
  `,
  KingMarker: `Due to strange issues with solar rays, this game is not currently playable.`
}

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.css']
})
export class GamelistComponent implements OnInit {

  activeGames:ActiveGame[] = [];

  rulesOpened:boolean = false;

  selectedGame:string;
  selectedGameDescription:string;
  selectedGameRules:string;

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
    this.selectedGameDescription = GAME_DESC[this.selectedGame];
    this.selectedGameRules = GAME_RULES[this.selectedGame];

    this.http.post(URL + "/api/pesten/list", {userId: this.auth.getId()}).subscribe(
      res => this.handleRequest(res),
      err => console.log(err)
    );

    this.subscription = this.gameDataService.selectedGame$.subscribe(n => {
      this.selectedGame = n;
      this.selectedGameDescription = GAME_DESC[n];
      this.selectedGameRules = GAME_RULES[n];
      this.getList();
      this.http.post(URL + "/api/pesten/list", {userId: this.auth.getId()}).subscribe(
        res => this.handleRequest(res),
        err => console.log(err)
      );
    });
  }

  toggleRules() {
    this.rulesOpened = !this.rulesOpened;
  }

  ngOnDestroy() {
    if(this.subscription && this.subscription.unsubsribe) {
      this.subscription.unsubscribe();
    }
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
    this.http.post(URL + "/api/pesten", {
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
    this.http.post(URL + "/api/pesten", {
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
