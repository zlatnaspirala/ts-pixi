import * as PIXI from "pixi.js";
import { Scene } from "../core/scene";
import { addFPS, createButton, genFramesFromTex } from "../services/helpers-methods";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { MenuScene } from "./menuScene";
import { SceneManager } from "../core/sceneManager";
import { isMobile } from "../utils/utils";
// import { PhoenixFlameGraphics } from "../components/phoenixFlame";

interface FlameSprite {
  sprite: PIXI.AnimatedSprite;
  baseX: number;
  baseY: number;
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
  private positions: any[]=[];
  // bonus
  // private graphicsDraws:PhoenixFlameGraphics;

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

    // this.graphicsDraws = new PhoenixFlameGraphics(perToPixWidth(50), perToPixHeight(50));
    // this.addChild(this.graphicsDraws);
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

    this.positions=this.getShemaPos();

    this.positions.forEach((pos, index) => {
      let flame=new PIXI.AnimatedSprite(index==1? framesBody:frames);
      flame.anchor.set(0.5, 0.8);
      flame.x=centerX+pos.x;
      flame.y=centerY+pos.y;
      flame.scale.set(pos.scale);
      flame.rotation=pos.rot;
      flame.alpha=pos.alpha;
      flame.animationSpeed=0.3+Math.random()*0.3;
      flame.blendMode='add';
      // const blurFilter=new PIXI.BlurFilter();
      // blurFilter.blur=1.1;
      // flame.filters=[blurFilter];
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

  getShemaPos() {
    let scaleMobileFactor=1;
    if(isMobile()==true) {
      scaleMobileFactor=0.5;
    }
    return this.positions=[
      // HEAD
      { x: 0*scaleMobileFactor, y: -150*scaleMobileFactor, scale: 1.8*scaleMobileFactor, alpha: 1, rot: 0 },
      // MAIN BODY
      { x: 10*scaleMobileFactor, y: -85*scaleMobileFactor, scale: -3.1*scaleMobileFactor, alpha: 1, rot: 0 },
      // LEFT WING
      { x: -60*scaleMobileFactor, y: -80*scaleMobileFactor, scale: 2.0*scaleMobileFactor, alpha: 0.9, rot: -0.4 },
      { x: -130*scaleMobileFactor, y: -110*scaleMobileFactor, scale: 2.9*scaleMobileFactor, alpha: 0.8, rot: -0.9 },
      // Lower wing part
      // RIGHT WING (Mirror)
      { x: 60*scaleMobileFactor, y: -70*scaleMobileFactor, scale: 2.0*scaleMobileFactor, alpha: 0.9, rot: 0.4 },
      { x: 130*scaleMobileFactor, y: -110*scaleMobileFactor, scale: 2.9*scaleMobileFactor, alpha: 0.8, rot: 0.9 },
      // TAIL (Flowing down)
      { x: -40*scaleMobileFactor, y: 160*scaleMobileFactor, scale: 1.8*scaleMobileFactor, alpha: 0.7, rot: 0.2 },
      { x: 40*scaleMobileFactor, y: 160*scaleMobileFactor, scale: 1.8*scaleMobileFactor, alpha: 0.7, rot: -0.2 },
      { x: 0*scaleMobileFactor, y: 220*scaleMobileFactor, scale: 1.5*scaleMobileFactor, alpha: 0.6, rot: 0 }
    ];
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

    // if (this.graphicsDraws) this.graphicsDraws.update(deltaMS);
  }

  onResize() {
    const newCenterX=window.innerWidth/2;
    const newCenterY=window.innerHeight*0.5;
    this.flames.forEach((flameData, index) => {
      const pos=this.positions[index];
      if(pos) {
        flameData.baseX=newCenterX+pos.x;
        flameData.baseY=newCenterY+pos.y;
        flameData.sprite.x=flameData.baseX;
        flameData.sprite.y=flameData.baseY;
      }
    });
  }

  destroyScene() {
    this.flames.forEach(f => f.sprite.destroy());
    this.flames=[];
  }
}