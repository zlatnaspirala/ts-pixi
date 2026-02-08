import * as PIXI from "pixi.js";
import { Scene } from "../core/scene";
import { addFPS, createButton, genFramesFromTex } from "../services/helpers-methods";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { MenuScene } from "./menuScene";
import { SceneManager } from "../core/sceneManager";

interface FlameSprite {
  sprite: PIXI.AnimatedSprite;
  baseX: number; // Store relative X
  baseY: number; // Store relative Y
  waveSpeed: number;
  waveAmount: number;
  scaleBase: number;
}

export class PhoenixFlameScene extends Scene {
  private addFPS: Function;
  private fpsText: PIXI.Text|undefined;
  private flames: FlameSprite[]=[];
  private elapsedTime=0;
  private phoenixContainer: PIXI.Container;

  constructor () {
    super();

    this.phoenixContainer=new PIXI.Container();
    this.addChild(this.phoenixContainer);

    let btnBack=createButton("Back to menu", () => {
      SceneManager.change(new MenuScene());
    });
    btnBack.position.y=perToPixHeight(5);
    btnBack.position.x=perToPixWidth(5);
    this.addChild(btnBack);

    this.addFPS=addFPS.bind(this);
    this.fpsText=this.addFPS(this);
    this.createFlame();
  }

  async createFlame() {
    const texture=await PIXI.Assets.load('./assets/textures/flame1.webp');
    const textureBody=await PIXI.Assets.load('./assets/textures/flame2.webp');
    const COLS=6;
    const ROWS=5;
    let frames=[];
    let framesBody=[];
    frames.push(...genFramesFromTex(ROWS, COLS, texture));
    framesBody.push(...genFramesFromTex(3, 3, textureBody));
    const centerX=window.innerWidth/2;
    const centerY=window.innerHeight*0.5;
    const positions=[
      // HEAD & NECK
      { x: 0, y: -150, scale: 1.8, alpha: 1, rot: 0 },    // Head
      // MAIN BODY
      { x: 10, y: -85, scale: -3.1, alpha: 1, rot: 0 },    // Core Chest
      // LEFT WING (Arching up and out)
      { x: -60, y: -80, scale: 2.0, alpha: 0.9, rot: -0.4 },
      { x: -130, y: -110, scale: 2.9, alpha: 0.8, rot: -0.9 },
      { x: -100, y: 10, scale: 1.7, alpha: 0.8, rot: -0.2 }, // Lower wing part

      // RIGHT WING (Mirror)
      { x: 60, y: -70, scale: 2.0, alpha: 0.9, rot: 0.4 },
      { x: 130, y: -110, scale: 2.9, alpha: 0.8, rot: 0.9 },
      { x: 100, y: 10, scale: 1.7, alpha: 0.8, rot: 0.2 },

      // TAIL (Flowing down)
      { x: -40, y: 160, scale: 1.8, alpha: 0.7, rot: 0.2 }, // Tail left feather
      { x: 40, y: 160, scale: 1.8, alpha: 0.7, rot: -0.2 }, // Tail right feather
      { x: 0, y: 220, scale: 1.5, alpha: 0.6, rot: 0 },   // Tail tip
    ];

    positions.forEach((pos, index) => {
      let flame;
      if(index==1) {
        flame=new PIXI.AnimatedSprite(framesBody);
      } else {
        flame=new PIXI.AnimatedSprite(frames);
      }
      flame.anchor.set(0.5, 0.8); // Set anchor to bottom of flame
      flame.x=centerX+pos.x;
      flame.y=centerY+pos.y;
      flame.scale.set(pos.scale);
      flame.rotation=pos.rot;
      flame.alpha=pos.alpha;
      flame.animationSpeed=0.3+Math.random()*0.3;
      flame.blendMode='add';

      const blurFilter=new PIXI.BlurFilter();
      blurFilter.blur=1.1;
      flame.filters=[blurFilter];

      flame.play();

      this.phoenixContainer.addChild(flame);

      this.flames.push({
        sprite: flame,
        baseX: centerX+pos.x,
        baseY: centerY+pos.y,
        waveSpeed: 1+Math.random(),
        waveAmount: 4+Math.random()*5,
        scaleBase: pos.scale
      });
    });
  }

  update(deltaMS: number) {
    this.elapsedTime+=deltaMS/1000;

    if(this.app&&this.fpsText) {
      this.fpsText.text=`${Math.round(this.app.ticker.FPS)}`;
    }

    this.flames.forEach((flameData, index) => {
      const sprite=flameData.sprite;

      // Horizontal swaying (Wind effect)
      const waveX=Math.sin(this.elapsedTime*2+index)*(flameData.waveAmount);
      sprite.x=flameData.baseX+waveX;

      // Vertical "Breathing" / Bobbing
      const bobY=Math.cos(this.elapsedTime*1.5+index)*5;
      sprite.y=flameData.baseY+bobY;

      // Pulse the scale slightly to make the fire feel alive
      const pulse=Math.sin(this.elapsedTime*3+index)*0.05;
      sprite.scale.set(flameData.scaleBase+pulse);

      // Flickering Alpha
      sprite.alpha=0.7+Math.random()*0.3;
    });
  }

  destroyScene() {
    this.flames.forEach(f => f.sprite.destroy());
    this.flames=[];
  }
}