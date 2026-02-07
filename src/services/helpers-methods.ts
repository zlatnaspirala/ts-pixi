import * as PIXI from "pixi.js";
import gsap from 'gsap';

/**
 * @description
 * Small set of 'helper' methods
 * To avoid complexity in class hierarhy.
 * Only rule function must be standalone 
 * or single responsibilly.
 */

export function createButton(label: string, onClick: () => void): PIXI.Text {
  const btn = new PIXI.Text({
    text: label,
    style: {
      fontSize: 14,
      fill: 0xffffff
    }
  });

  btn.eventMode = 'static';
  btn.cursor = 'pointer';
  btn.on('pointerdown', onClick);
  return btn;
}

export function makeDraggable(handle: PIXI.Container) {
  let dragging = false;
  const offset = new PIXI.Point();

  handle.eventMode = "static";
  handle.cursor = "grab";

  handle.on("pointerdown", (e) => {
    dragging = true;
    offset.set(
      e.global.x - this.x,
      e.global.y - this.y
    );
    handle.cursor = "grabbing";
  });

  handle.on("pointerup", () => {
    dragging = false;
    handle.cursor = "grab";
  });

  handle.on("pointermove", (e) => {
    if (!dragging) return;
    this.position.set(
      e.global.x - offset.x,
      e.global.y - offset.y
    );
  });
}