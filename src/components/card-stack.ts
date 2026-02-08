import * as PIXI from "pixi.js";
import { Card } from "./card";

/**
 * @description
 * CardStack is the parent container for the cards.
 * It is not necessary (we can use var for store this info) 
 * but it is good for manipulation of whole stack/deck of cards.
 */
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