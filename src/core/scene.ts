import * as PIXI from "pixi.js";

export abstract class Scene extends PIXI.Container {
  abstract update(delta: number): void;
  abstract destroyScene(): void;
}