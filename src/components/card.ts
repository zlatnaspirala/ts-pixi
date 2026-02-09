import { getOrientation, isMobile } from "../utils/utils";
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
    const shouldFlip=isMobile()&&getOrientation()==="landscape";

    let baseW=isMobile()? 90:perToPixHeight(12);
    let baseH=isMobile()? 147:perToPixHeight(12)*this.aspectRatio;

    if(shouldFlip) {
      this.angle=90;
      // this.width=baseH;
      // this.height=baseW;
      this.width=baseW;
      this.height=baseH;
    } else {
      this.angle=0;
      this.width=baseW;
      this.height=baseH;
    }
    this.pos=new Position(50, 50);
  }
}