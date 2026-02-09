import { perToPixWidth } from "../core/position";
import * as PIXI from "pixi.js";

/**
 * @description
 * Small set of 'helper' methods
 * To avoid complexity in class hierarhy.
 * Only rule function must be standalone 
 * or single responsibilly.
 */
export function createButton(label: string, onClick: () => void): PIXI.Text {
  const btn=new PIXI.Text({
    text: label,
    style: {
      fontSize: 18,
      fill: 0xffffff
    }
  });

  btn.eventMode='static';
  btn.cursor='pointer';
  btn.on('pointerdown', onClick);
  return btn;
}

/**
 * Bind this function in any scene class.
 * @param parent 
 * @returns 
 */
export function addFPS(parent: PIXI.Container) {
  const fpsStyle=new PIXI.TextStyle({
    fontFamily: 'monospace',
    fontSize: 12,
    fill: '#15ff00',
    stroke: { color: '#000000', width: 4 },
    fontWeight: 'bold'
  });
  const fpsTitle=new PIXI.Text({ text: 'FPS:', style: fpsStyle });
  fpsTitle.label = "fpsTitle";
  const fpsText=new PIXI.Text({ text: '', style: fpsStyle });
  fpsTitle.x=perToPixWidth(94);
  fpsTitle.y=1;
  fpsText.x=perToPixWidth(94) + 30;
  fpsText.y=1;
  parent.addChild(fpsTitle);
  parent.addChild(fpsText);
  return fpsText;
}

export function genFramesFromTex(ROWS: number, COLS: number, texture: PIXI.Texture) {
  let frames = [];
  const frameWidth = texture.width / COLS;
  const frameHeight = texture.height / ROWS;
  for(let y=0; y<ROWS; y++) {
    for(let x=0; x<COLS; x++) {
      frames.push(
        new PIXI.Texture({
          source: texture.source,
          frame: new PIXI.Rectangle(x*frameWidth, y*frameHeight, frameWidth, frameHeight),
        })
      );
    }
  }
  return frames;
}