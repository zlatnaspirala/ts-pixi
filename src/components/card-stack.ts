import * as PIXI from "pixi.js";
import { Card } from "./card";

export class CardStack extends PIXI.Container {
  cards: Card[]=[];

  constructor () {
    super();
    this.sortableChildren=true;
  }

  push(card: Card) {
    const offsetY=this.cards.length*3;
    card.pos.setPosition(0, offsetY, 0);
    card.zIndex=this.cards.length;
    this.cards.push(card);
    this.addChild(card);
  }
  pop(): Card|undefined {
    const card=this.cards.pop();
    if(card) this.removeChild(card);
    return card;
  }

  top(): Card|undefined {
    return this.cards[this.cards.length-1];
  }
}