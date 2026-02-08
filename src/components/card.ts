import { isMobile } from "../utils/utils";
import { perToPixHeight, perToPixWidth, Position } from "../core/position";
import * as PIXI from "pixi.js";

/**
 * @description
 * I use absolute innerHeight for referent value in 
 * diametric scale (Self adaptive on any resolutions).
 * Meaning of "diametric scale/response" is it simple 
 * always use percent not numbers/pixels.
 * I will not force this aproach in other examples.
 */
export class Card extends PIXI.Sprite {
  public pos;
  private aspectRatio: number=1.532;
  constructor (texture: PIXI.Texture) {
    super(texture);
    this.anchor.set(0.5);
    this.width=isMobile()? 100:perToPixHeight(12);
    this.height=isMobile()? 153:perToPixHeight(12)*this.aspectRatio;
    this.pos=new Position(50, 50);
  }
}