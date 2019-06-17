
export const SUITS = {
  JOKER: 0,
  SPADES: 1,
  HEARTS: 2,
  DIAMONDS: 3,
  CLUBS: 4
}

export class Card {

  visible:boolean = false;

  constructor(public number:number, public suit:number) { }

  getSuit():string {
    const names = ["Joker", "Spades", "Hearts", "Diamonds", "Clubs"];
    return names[this.suit];
  }

  getCoords():number[] {
    if(!this.visible) {
      return [124 * 0, 164 * 4];
    }
    if(this.suit === SUITS.JOKER) {
      if(this.number === 1) {
        return [124 * 1, 164 * 4];
      } else {
        return [124 * 2, 164 * 4];
      }
    }
    return [124 * (this.number - 1), 164 * (this.suit - 1)];
  }

  getUnicode():string {
    if(!this.visible) {
      return String.fromCodePoint(0x1f0a0);
    }
    let base = 0x1f0a0;
    if(this.suit === SUITS.JOKER) {
      return String.fromCodePoint(0x1f0df);
    }
    base += (this.suit - 1) * 0x10;
    base += this.number;
    if(this.number > 11) {
      base++;
    }
    return String.fromCodePoint(base);
  }

  getColor():string {
    if(!this.visible) {
      return "black";
    }
    if(this.suit === SUITS.JOKER && this.number === 2) {
      return "red";
    }
    if(this.suit === SUITS.HEARTS || this.suit === SUITS.DIAMONDS) {
      return "red";
    }
    return "black";
  }

  draw(ctx, x, y, img, highlight):void {
    let coords = this.getCoords();
    ctx.drawImage(
      img,
      coords[0], coords[1], 124, 164,
      x, y, 124, 164
    );
    if(highlight) {
      ctx.fillStyle = "rgba(200, 200, 255, 0.7)";
      ctx.fillRect(x, y, 124, 164);
    }
  }
}
