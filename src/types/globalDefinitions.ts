import * as PIXI from 'pixi.js';

export interface MyParticleSprite {
  sprite: PIXI.Sprite;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  scale: number;
  rotation: number;
}