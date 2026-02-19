import * as PIXI from "pixi.js";
import { Scene } from "../core/scene";
import { Poker } from "./poker";
import { SceneManager } from "../core/sceneManager";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { mainMenuBtnStyle } from "../resources/literails";
import { MagicWords } from "./magicWords";
import { Animations } from "./anims";
import { addFPS } from "../services/helpers-methods";
import { getOrientation, isMobile } from "../utils/utils";
import gsap from "gsap";
import { PhoenixFlameGraphics } from "../components/phoenixFlame";

export class MenuScene extends Scene {
  private buttons: PIXI.Container[]=[];
  private addFPS: Function;
  private fpsText: PIXI.Text|undefined;
  private fpsTitle: PIXI.Text|undefined;
  private graphicsDraws: PhoenixFlameGraphics;
  private graphicsDrawsTop: PhoenixFlameGraphics;

  constructor () {
    super();
    this.addBtn("Ace of Shadows", Poker);
    this.addBtn("Magic Words", MagicWords);
    this.addBtn("Phoenix Flame", Animations);
    // arg are percents
    this.graphicsDraws=new PhoenixFlameGraphics(
      isMobile()? getOrientation()=="landscape"? 50:50:50,
      isMobile()? getOrientation()=="landscape"? 110:100:80,
      "star"
    );
    this.addChild(this.graphicsDraws);
    this.graphicsDrawsTop=new PhoenixFlameGraphics(
      isMobile()? getOrientation()=="landscape"? 50:50:50,
      isMobile()? getOrientation()=="landscape"? -30:-20:0,
      "base", -1);
    this.addChild(this.graphicsDrawsTop);
    this.addFPS=addFPS.bind(this);
    this.fpsText=this.addFPS(this);
    this.fpsTitle=this.getChildByLabel("fpsTitle") as PIXI.Text;
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
    setTimeout(() => {
      const fixedWidth=isMobile()? (getOrientation()==="portrait"? perToPixWidth(60):perToPixWidth(35)):300;
      const fixedHeight=isMobile()? 43:63;
      this.buttons.forEach((container, index) => {
        this.positionButton(container, index);
        const bg=container.getChildAt(0) as PIXI.Graphics;
        if(bg) {
          bg.clear()
            .roundRect(-fixedWidth/2, -fixedHeight/2, fixedWidth, fixedHeight, 15)
            .fill({ color: 0x000000, alpha: 0.6 })
            .stroke({ width: 2, color: 0x3498db, alpha: 1 });
        }
      });
      if(this.fpsText&&this.fpsTitle) {
        this.fpsTitle.x=isMobile()? perToPixWidth(86):perToPixWidth(94);
        this.fpsText.x=isMobile()? perToPixWidth(86)+30:perToPixWidth(94)+30;
      }
    }, 100)
  }
}