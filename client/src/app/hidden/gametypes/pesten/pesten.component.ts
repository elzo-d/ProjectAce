import { Component, OnInit, OnDestroy } from '@angular/core';
import { Card, SUITS } from '../card';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../auth/auth.service';
import { URL } from '../../../config';

@Component({
  selector: 'app-pesten',
  templateUrl: './pesten.component.html',
  styleUrls: ['./pesten.component.css']
})
export class PestenComponent implements OnInit, OnDestroy {

  userCards:Card[] = [];
  opponentLengths:number[] = [];

  pileTop:Card = undefined;

  finished:boolean = false;
  won:number = 0;

  user:number = 0;
  turn:number = 0;

  started:boolean = false;
  waiting:boolean = true;
  userIds:string[] = [];
  players:number = 2;

  intervalId:number = 0;
  scale:number = 1;
  ctx = undefined;
  img = undefined;

  mx:number = 0;
  my:number = 0;

  constructor(private http:HttpClient, private auth:AuthService) { }

  ngOnInit() {
    this.ctx = (<HTMLCanvasElement> document.getElementById("canvas")).getContext("2d");
    this.ctx.canvas.width = this.ctx.canvas.offsetWidth;
    this.ctx.canvas.height = this.ctx.canvas.offsetHeight;
    this.scale = this.ctx.canvas.width < 600 ? 0.5 : 1;
    this.img = document.getElementById("img");
    this.img.onload = () => {this.onImageLoad()};
    window.onresize = () => {this.onResize()};
    this.reset();
    this.intervalId = window.setInterval(() => {this.doUpdateRequest()}, 2000);
    this.doUpdateRequest();
  }

  ngOnDestroy() {
    window.clearInterval(this.intervalId);
  }

  reset() {
    this.started = false;
    this.waiting = true;
    this.userIds = [];
    this.players = 0;
    this.userCards = [];
    this.pileTop = undefined;
    this.finished = false;
    this.opponentLengths = [];
    this.won = 0;
    this.user = 0;
    this.turn = 0;
  }

  doUpdateRequest() {
    this.sendMessage(3, new Card(1, 1));
  }

  handleMessage(res) {
    if(res.error !== "success") {
      this.started = false;
      this.waiting = false;
      this.userIds = [];
      this.players = 0;
      console.log("Error from API: " + res.error);
      this.updateView(this.mx, this.my);
      return;
    }
    this.started = true;
    this.userIds = res.data.joinedUsers;
    this.players = res.data.players;
    if(res.data.waiting) {
      this.waiting = true;
      this.updateView(this.mx, this.my);
      return;
    }
    this.waiting = false;
    this.userCards = [];
    this.user = res.data.user;
    this.turn = res.data.turn;
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

    if(this.finished) {
      window.clearInterval(this.intervalId);
      // notify server we're done
      this.http.post(URL + "/api/game/pesten", {
        type: 3,
        userId: this.auth.getId()
      }).subscribe(
        res => console.log(res),
        err => console.log(err)
      );
    }

    this.updateView(this.mx, this.my);
  }

  sendMessage(type, card) {
    this.http.post(URL + "/api/game/pesten", {
      type: 1,
      card: card.getArray(),
      moveType: type,
      userId: this.auth.getId()
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
    this.scale = this.ctx.canvas.width < 600 ? 0.5 : 1;
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
      return;
    }

    let cardWidth = 124 * this.scale;
    let cardHeight = 164 * this.scale;
    let cardOverlap = cardWidth / 2;

    if(my < cardHeight + 2) {
      // top row of cards
      // this.sendMessage(2, new Card(1, 1));
    } else if(my > this.ctx.canvas.height - cardHeight - 2) {
      // bottom row of cards
      let xPos = (this.ctx.canvas.width / 2) - ((this.userCards.length * cardOverlap + cardOverlap) / 2);
      if(xPos < 0) {
        xPos += (2 * -xPos) * (1 - (2 * (mx / this.ctx.canvas.width)));
      }
      let pickedCard = undefined;
      for(let card of this.userCards) {
        if(mx > xPos && mx < xPos + (card === this.userCards[this.userCards.length - 1] ? cardWidth : cardOverlap)) {
          pickedCard = card;
        }
        xPos += cardOverlap;
      }
      if(pickedCard) {
        this.sendMessage(0, pickedCard);
      }
    } else {
      // middle of table
      if(
        my > this.ctx.canvas.height / 2 - (cardHeight / 2) && my < this.ctx.canvas.height / 2 + (cardHeight / 2) &&
        mx > this.ctx.canvas.width / 2 && mx < this.ctx.canvas.width / 2 + cardWidth + 2
      ) {
        this.sendMessage(1, new Card(1, 1));
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

  drawTriangle(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();
  }

  drawUserBox(ctx, highlight) {
    // draw box for joined users
    let c = ctx.canvas;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillRect(c.width - 200, 0, 200, 80);
    ctx.fillStyle = "#000000";
    ctx.font = "15px arial";
    ctx.textAlign = "center";
    let yPos = 16;
    let index = 0;
    for(let id of this.userIds) {
      if(index === this.turn && highlight) {
        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.fillRect(c.width - 200, yPos - 16, 200, 20);
      }
      ctx.fillStyle = "#000000";
      ctx.fillText(id, c.width - 100, yPos);
      yPos += 20;
      index++;
    }
  }

  updateView(mx, my) {
    // card: 124 * 164
    // card overlap: 62 px
    let ctx = this.ctx;
    let c = ctx.canvas;
    ctx.fillStyle = "#5ba318";
    ctx.fillRect(0, 0, c.width, c.height);

    let cardWidth = 124 * this.scale;
    let cardHeight = 164 * this.scale;
    let cardOverlap = cardWidth / 2;

    if(!this.started || this.waiting) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      ctx.textAlign = "center";
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      ctx.font = "15px arial";
      ctx.fillText(this.started ? "Waiting for players..." : "Connecting...", c.width / 2, c.height / 2 - 20);
      ctx.fillText(this.started ? this.userIds.length + " / " + this.players + " users joined" : "", c.width / 2, c.height / 2 + 20);

      this.drawUserBox(ctx, false);
      return;
    }

    let user1cards = this.getCardArray(this.opponentLengths[0]);
    let xPos = (c.height / 2) - ((user1cards.length * cardOverlap + cardOverlap) / 2);
    for(let card of user1cards) {
      card.draw(ctx, 2, xPos, this.img, false, true, this.scale);
      xPos += cardOverlap;
    }
    if(this.players > 2) {
      let user2cards = this.getCardArray(this.opponentLengths[1]);
      xPos = (c.width / 2) - ((user2cards.length * cardOverlap + cardOverlap) / 2);
      for(let card of user2cards) {
        card.draw(ctx, xPos, 2, this.img, false, false, this.scale);
        xPos += cardOverlap;
      }
    }
    if(this.players > 3) {
      let user3cards = this.getCardArray(this.opponentLengths[2]);
      xPos = (c.height / 2) - ((user3cards.length * cardOverlap + cardOverlap) / 2);
      for(let card of user3cards) {
        card.draw(ctx, c.width - cardHeight - 2, xPos, this.img, false, true, this.scale);
        xPos += cardOverlap;
      }
    }

    this.pileTop.draw(ctx, (c.width / 2) - cardWidth - 2, (c.height / 2) - (cardHeight / 2), this.img, false, false, this.scale);
    let highlight = (
      my > c.height / 2 - (cardHeight / 2) && my < c.height / 2 + (cardHeight / 2) &&
      mx > c.width / 2 && mx < c.width / 2 + cardWidth + 2
    );
    let stackTop = new Card(1, 1);
    stackTop.draw(ctx, (c.width / 2) + 2, (c.height / 2) - (cardHeight / 2), this.img, highlight && !this.finished, false, this.scale);

    // draw turn-triangles
    if(this.turn === (this.user + 1) % this.players && !this.finished) {
      this.drawTriangle(
        ctx,
        cardHeight + 6, c.height / 2,
        cardHeight + 6 + 10, c.height / 2 - 20,
        cardHeight + 6 + 10, c.height / 2 + 20
      );
    }
    if(this.turn === (this.user + 2) % this.players && !this.finished && this.players > 2) {
      this.drawTriangle(
        ctx,
        c.width / 2, cardHeight + 6,
        c.width / 2 - 20, cardHeight + 6 + 10,
        c.width / 2 + 20, cardHeight + 6 + 10
      );
    }
    if(this.turn === (this.user + 3) % this.players && !this.finished && this.players > 3) {
      this.drawTriangle(
        ctx,
        c.width - (cardHeight + 6), c.height / 2,
        c.width - (cardHeight + 6) - 10, c.height / 2 - 20,
        c.width - (cardHeight + 6) - 10, c.height / 2 + 20
      );
    }

    this.drawUserBox(ctx, !this.finished);

    xPos = (c.width / 2) - ((this.userCards.length * cardOverlap + cardOverlap) / 2);
    if(xPos < 0) {
      xPos += (2 * -xPos) * (1 - (2 * (mx / c.width)));
    }
    for(let card of this.userCards) {
      let highlight = (
        my > c.height - cardHeight - 2 &&
        mx > xPos && mx < xPos + (card === this.userCards[this.userCards.length - 1] ? cardWidth : cardOverlap)
      );
      card.draw(ctx, xPos, c.height - cardHeight - 2, this.img, highlight && !this.finished, false, this.scale);
      xPos += cardOverlap;
    }
    if(this.turn === this.user && !this.finished) {
      // draw triangle
      this.drawTriangle(
        ctx,
        c.width / 2, c.height - (cardHeight + 6),
        c.width / 2 - 20, c.height - (cardHeight + 6) - 10,
        c.width / 2 + 20, c.height - (cardHeight + 6) - 10
      );
    }

    if(this.finished) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      ctx.font = "bold 40px arial";
      ctx.textAlign = "center";
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(c.width / 2 - 100, c.height / 2 - 60, 200, 120);
      if(this.won === this.user) {
        ctx.fillText("You won!", c.width / 2, c.height / 2 + 10);
      } else {
        ctx.fillText("You lost.", c.width / 2, c.height / 2 + 5);
        ctx.font = "15px arial";
        ctx.fillText(this.userIds[this.won] + " won", c.width / 2, c.height / 2 + 25);
      }
      // ctx.font = "15px arial";
      // ctx.fillText("Click to play again", c.width / 2, c.height / 2 + 30);
    }
  }

}
