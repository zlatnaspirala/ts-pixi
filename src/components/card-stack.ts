import * as PIXI from "pixi.js";
import { Card } from "./card";
import { getOrientation, isMobile } from "../utils/utils";

/**
 * @description
 * CardStack is the parent container for the cards.
 * It is not necessary (we can use var for store this info) 
 * but it is good for manipulation of whole stack/deck of cards.
 */
export class CardStack extends PIXI.Container {
  cards: Card[]=[];
  private YOffset: number=3;
  constructor () {
    super();
    this.YOffset=(isMobile()? getOrientation()==="landscape"? 2:2:3);
    this.sortableChildren=true;
  }
  push(card: Card) {
    const offsetY=this.cards.length*this.YOffset;
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