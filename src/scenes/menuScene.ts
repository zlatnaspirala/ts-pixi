import * as PIXI from "pixi.js";
import { Scene } from "../core/scene";
import { AceOfShadowsScene } from "./aceOfShadowsScene";
import { SceneManager } from "../core/sceneManager";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { mainMenuBtnStyle, windowTitleStyle } from "../resources/literails";
import { MagicWords } from "./magicWords";
import { PhoenixFlameScene } from "./phoenixFlame";
import { addFPS } from "../services/helpers-methods";
import { getOrientation, isMobile } from "../utils/utils";
import { DialogWindow } from "../components/dialogBox";
import gsap from "gsap";
import { PhoenixFlameGraphics } from "../components/phoenixFlame";

export class MenuScene extends Scene {
  private buttons: PIXI.Container[]=[];
  private addFPS: Function;
  private fpsText: PIXI.Text|undefined;
  private fpsTitle: PIXI.Text|undefined;
  private welcomeDialog: DialogWindow|undefined;
  private welcomeText: PIXI.Text|undefined;
  private graphicsDraws: PhoenixFlameGraphics;
  private graphicsDrawsTop: PhoenixFlameGraphics;

  constructor () {
    super();
    this.addBtn("Ace of Shadows", AceOfShadowsScene);
    this.addBtn("Magic Words", MagicWords);
    this.addBtn("Phoenix Flame", PhoenixFlameScene);
    this.renderDialog();
    // arg are percents
    this.graphicsDraws=new PhoenixFlameGraphics(
      isMobile()? getOrientation()=="landscape"? 50:50:50,
      isMobile()? getOrientation()=="landscape"? 140:130:80,
      "star"
    );
    this.addChild(this.graphicsDraws);
    this.graphicsDrawsTop=new PhoenixFlameGraphics(
      isMobile()? getOrientation()=="landscape"? 50:50:50,
      isMobile()? getOrientation()=="landscape"? -50:-30:80,
      "base", -1);
    this.addChild(this.graphicsDrawsTop);
    this.addFPS=addFPS.bind(this);
    this.fpsText=this.addFPS(this);
    this.fpsTitle=this.getChildByLabel("fpsTitle") as PIXI.Text;

    this.hitArea=new PIXI.Rectangle(0, 0, perToPixWidth(100), perToPixHeight(100));
    this.eventMode='static';
    this.on("pointerdown", () => {
      this.removeDialog()
    });

    if(screen.orientation) {
      screen.orientation.addEventListener('change', () => {
        console.log(`Current orientation is ${screen.orientation.type}`);
        // this.rebuildDialog()
          this.removeDialog()
      });
    }
  }

  private renderDialog() {
    if(localStorage.getItem('first-touch')===null&&isMobile()===true) {
      this.welcomeDialog=new DialogWindow(
        isMobile()? getOrientation()=="portrait"? perToPixWidth(80):perToPixWidth(50):700,
        isMobile()? getOrientation()=="portrait"? perToPixHeight(46):perToPixHeight(80):window.innerHeight*0.8
      );
      // const welcomeText=new PIXI.Text({ text: "Welcome here \n run fullscreen and start the game \n Click any where!", style: mainMenuBtnStyle }) as PIXI.Text;
      this.welcomeText=new PIXI.Text({ text: "  Welcome user    \n  Play for free    \nTap anywhere to start!", style: isMobile()? windowTitleStyle:mainMenuBtnStyle }) as PIXI.Text;
      this.welcomeDialog.eventMode='static';
      this.welcomeDialog.cursor='pointer';
      this.welcomeDialog.on("pointerdown", () => {
        localStorage.setItem('first-touch', "true");
        if(this.welcomeDialog) this.removeChild(this.welcomeDialog);
      });
      this.welcomeDialog.addChild(this.welcomeText);
      this.welcomeDialog.position.y=isMobile()? getOrientation()==="portrait"? perToPixHeight(20):perToPixHeight(10):perToPixHeight(20);
      this.welcomeText.position.x=this.welcomeDialog.width/2;
      this.welcomeText.position.y=this.welcomeDialog.height/4;
      this.welcomeText.anchor.set(0.5);
      this.addChild(this.welcomeDialog);
    }
  }

  private removeDialog() {
    if(this.welcomeDialog) {
      // keeps textures alive
      this.welcomeDialog?.removeChildren();
      this.removeChild(this.welcomeDialog);
      this.welcomeDialog=undefined;
    }
  }

  private rebuildDialog() {
    this.removeDialog();
    this.renderDialog();
  }

  addBtn(t: string, Class: new () => Scene) {
    const container=new PIXI.Container();
    const bText=new PIXI.Text({ text: t, style: mainMenuBtnStyle });
    bText.anchor.set(0.5);
    const fixedWidth=isMobile()? getOrientation()==="portrait"? perToPixWidth(60):perToPixWidth(35):300;
    const fixedHeight=isMobile()? 43:63;
    const background=new PIXI.Graphics();
    background.roundRect(-fixedWidth/2, -fixedHeight/2, fixedWidth, fixedHeight, 15)
      .fill({ color: 0x000000, alpha: 0.6 })
      .stroke({ width: 2, color: 0x3498db, alpha: 1 });
    container.addChild(background);
    container.addChild(bText);
    // Interaction
    container.eventMode='static';
    container.cursor='pointer';
    container.on("pointerdown", () => SceneManager.change(new Class()));
    // Animation
    container.on("pointerover", () => {
      gsap.to(container.scale, { x: 1.05, y: 1.05, duration: 0.2 });
      background.tint=0x00ffcc;
    });
    container.on("pointerout", () => {
      gsap.to(container.scale, { x: 1, y: 1, duration: 0.2 });
      background.tint=0xffffff;
    });
    this.positionButton(container, this.buttons.length);
    this.buttons.push(container as any);
    this.addChild(container);
  }

  private positionButton(btn: PIXI.Container, index: number) {
    // Determine vertical spacing based on device
    const spacing=isMobile()&&getOrientation()==="landscape"? 16:10;
    btn.position.set(
      perToPixWidth(50),
      perToPixHeight(35+index*spacing)
    );
  }

  update(_: number) {
    if(this.graphicsDraws) this.graphicsDraws.update(_);
    if(this.graphicsDrawsTop) this.graphicsDrawsTop.update(_);
    if(this.app&&this.fpsText) this.fpsText.text=`${Math.round(this.app.ticker.FPS)}`;
  }

  destroyScene() {}

  onResize() {
    this.buttons.forEach((btn, index) => { this.positionButton(btn, index); });
    if(this.welcomeText&&this.welcomeDialog) {
      this.welcomeText.position.x=this.welcomeDialog.width/2;
      this.welcomeText.position.y=this.welcomeDialog.height/4;
    }
    if(this.fpsText&&this.fpsTitle) {
      this.fpsTitle.x=isMobile()? perToPixWidth(86):perToPixWidth(94);
      this.fpsText.x=isMobile()? perToPixWidth(86)+30:perToPixWidth(94)+30;
    }
  }
}
