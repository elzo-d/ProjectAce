import { Component, OnInit } from '@angular/core';
import { Card, SUITS } from '../card';
import { HttpClient } from '@angular/common/http';

const PLAYERS = 4;

@Component({
  selector: 'app-pesten',
  templateUrl: './pesten.component.html',
  styleUrls: ['./pesten.component.css']
})
export class PestenComponent implements OnInit {

  userCards:Card[] = [];
  opponentLengths:number[] = [];

  pileTop:Card = undefined;

  finished:boolean = false;
  won:number = 0;

  user:number = 0;

  started:boolean = false;

  ctx = undefined;
  img = undefined;

  mx:number = 0;
  my:number = 0;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.ctx = (<HTMLCanvasElement> document.getElementById("canvas")).getContext("2d");
    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetHeight;
    this.img = document.getElementById("img");
    this.img.onload = () => {this.onImageLoad()};
    window.onresize = () => {this.onResize()};
    this.reset();
  }

  reset() {
    this.started = false;
    this.userCards = [];
    this.pileTop = undefined;
    this.finished = false;
    this.opponentLengths = [];
    this.won = 0;
    this.user = 0;
    //window.setTimeout(() => {this.autoPlay()}, 100);

    // TEMP: testing server connection
    this.http.post<Test>("http://localhost:5000/api/pesten", {
      // type: 1,
      // card: [1, 1],
      // moveType: 1,
      // user: 0
      type: 0,
      user: this.user
    }).subscribe(
      res => this.handleMessage(res),
      err => console.log(err)
    );
  }

  handleMessage(res) {
    this.started = true;
    this.userCards = [];
    for(let arr of res.data.userCards) {
      let c = new Card(1, 1);
      c.setFromArray(arr);
      c.visible = true;
      this.userCards.push(c);
    }
    let c = new Card(1, 1);
    c.setFromArray(res.data.pileTop);
    c.visible = true;
    this.pileTop = c;
    this.opponentLengths = res.data.otherCards;
    this.finished = res.data.finished;
    this.won = res.data.won;

    this.updateView(this.mx, this.my);
    console.log(res)
  }

  sendMessage(type, card, user) {
    this.http.post<Test>("http://localhost:5000/api/pesten", {
      type: 1,
      card: card.getArray(),
      moveType: type,
      user: user
    }).subscribe(
      res => this.handleMessage(res),
      err => console.log(err)
    );
  }

  onImageLoad() {
    this.updateView(0, 0);
  }

  onResize() {
    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetHeight;
    window.setTimeout(() => this.updateView(0, 0), 0);
  }

  onCanvasMove(e) {
    let mx = e.offsetX;
    let my = e.offsetY;
    this.updateView(mx, my);
    this.mx = mx;
    this.my = my;
  }

  onCanvasClick(e) {
    let mx = e.offsetX;
    let my = e.offsetY;

    if(this.finished) {
      this.reset();
      this.updateView(mx, my);
      return;
    }

    if(my < 164 + 2) {
      // top row of cards
      this.sendMessage(2, new Card(1, 1), 0);
    } else if(my > this.ctx.canvas.height - 164 - 2) {
      // bottom row of cards
      let xPos = (this.ctx.canvas.width / 2) - ((this.userCards.length * 62 + 62) / 2);
      if(xPos < 0) {
        xPos += (2 * -xPos) * (1 - (2 * (mx / this.ctx.canvas.width)));
      }
      let pickedCard = undefined;
      for(let card of this.userCards) {
        if(mx > xPos && mx < xPos + (card === this.userCards[this.userCards.length - 1] ? 124 : 62)) {
          pickedCard = card;
        }
        xPos += 62;
      }
      if(pickedCard) {
        this.sendMessage(0, pickedCard, this.user);
      }
    } else {
      // middle of table
      if(
        my > this.ctx.canvas.height / 2 - 82 && my < this.ctx.canvas.height / 2 + 82 &&
        mx > this.ctx.canvas.width / 2 && mx < this.ctx.canvas.width / 2 + 124 + 2
      ) {
        this.sendMessage(1, new Card(1, 1), this.user);
      }
    }
    this.updateView(mx, my);
  }

  getCardArray(num) {
    let ret = [];
    for(let i = 0; i < num; i++) {
      ret.push(new Card(1, 1));
    }
    return ret;
  }

  updateView(mx, my) {
    // card: 124 * 164
    // card overlap: 62 px
    let ctx = this.ctx;
    let c = ctx.canvas;
    ctx.fillStyle = "#5ba318";
    ctx.fillRect(0, 0, c.width, c.height);

    this.pileTop.draw(ctx, (c.width / 2) - 124 - 2, (c.height / 2) - 82, this.img, false, false);
    let highlight = (
      my > c.height / 2 - 82 && my < c.height / 2 + 82 &&
      mx > c.width / 2 && mx < c.width / 2 + 124 + 2
    );
    let stackTop = new Card(1, 1);
    stackTop.draw(ctx, (c.width / 2) + 2, (c.height / 2) - 82, this.img, highlight && !this.finished, false);

    let user1cards = this.getCardArray(this.opponentLengths[0]);
    let xPos = (c.height / 2) - ((user1cards.length * 62 + 62) / 2);
    for(let card of user1cards) {
      card.draw(ctx, 2, xPos, this.img, false, true);
      xPos += 62;
    }
    if(PLAYERS > 2) {
      let user2cards = this.getCardArray(this.opponentLengths[1]);
      xPos = (c.width / 2) - ((user2cards.length * 62 + 62) / 2);
      for(let card of user2cards) {
        card.draw(ctx, xPos, 2, this.img, false, false);
        xPos += 62;
      }
    }
    if(PLAYERS > 3) {
      let user3cards = this.getCardArray(this.opponentLengths[2]);
      xPos = (c.height / 2) - ((user3cards.length * 62 + 62) / 2);
      for(let card of user3cards) {
        card.draw(ctx, c.width - 164 - 2, xPos, this.img, false, true);
        xPos += 62;
      }
    }


    xPos = (c.width / 2) - ((this.userCards.length * 62 + 62) / 2);
    if(xPos < 0) {
      xPos += (2 * -xPos) * (1 - (2 * (mx / c.width)));
    }
    for(let card of this.userCards) {
      let highlight = (
        my > c.height - 164 - 2 &&
        mx > xPos && mx < xPos + (card === this.userCards[this.userCards.length - 1] ? 124 : 62)
      );
      card.draw(ctx, xPos, c.height - 164 - 2, this.img, highlight && !this.finished, false);
      xPos += 62;
    }

    if(this.finished) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      ctx.font = "bold 40px arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      ctx.fillText(this.won === this.user ? "You won!" : "You lost...", c.width / 2, c.height / 2);
      ctx.font = "15px arial";
      ctx.fillText("Click to play again", c.width / 2, c.height / 2 + 30);
    }
  }

}

interface Test {
  error:string,
  message:string
}
