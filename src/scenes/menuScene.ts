import * as PIXI from "pixi.js";
import { Scene } from "../core/scene";
import { AceOfShadowsScene } from "./aceOfShadowsScene";
import { SceneManager } from "../core/sceneManager";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { mainMenuBtnStyle } from "../resources/literails";
import { MagicWords } from "./magicWords";
import { PhoenixFlameScene } from "./phoenixFlame";
import { addFPS } from "../services/helpers-methods";

export class MenuScene extends Scene {
  private buttons: PIXI.Text[]=[];
  private addFPS: Function;
  private fpsText: PIXI.Text|undefined;

  constructor () {
    super();
    this.addBtn("Ace of Shadows", AceOfShadowsScene);
    this.addBtn("Magic Words", MagicWords);
    this.addBtn("Phoenix Flame", PhoenixFlameScene);

    this.addFPS=addFPS.bind(this);
    this.fpsText=this.addFPS(this);
  }

  addBtn(t: string, Class: new () => Scene) {
    const bText=new PIXI.Text({ text: t, style: mainMenuBtnStyle }) as PIXI.Text;
    bText.anchor.set(0.5);
    // Middle of screen - Avoid pixels absolute numbers -
    // in percentage we can make response scene for all devices 
    // with same code.
    // bText.position.set(perToPixWidth(50), perToPixHeight(30+this.children.length*8));
    this.positionButton(bText, this.buttons.length-1);
    bText.interactive=true;
    bText.cursor="pointer";
    bText.on("pointerdown", () => {
      SceneManager.change(new Class());
    });
    this.buttons.push(bText);
    this.addChild(bText);
  }

  private positionButton(btn: PIXI.Text, index: number) {
    btn.position.set(
      perToPixWidth(50),
      perToPixHeight(30+index*8)
    );
  }

  update(_: number) {
    if(this.app&&this.fpsText) this.fpsText.text=`${Math.round(this.app.ticker.FPS)}`;
  }

  destroyScene() {}

  onResize() {
    this.buttons.forEach((btn, index) => { this.positionButton(btn, index); });
  }
}
