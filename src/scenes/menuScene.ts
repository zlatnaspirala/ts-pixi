import * as PIXI from "pixi.js";
import { Scene } from "../core/scene";
import { AceOfShadowsScene } from "./aceOfShadowsScene";
import { SceneManager } from "../core/sceneManager";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { mainMenuBtnStyle } from "../resources/literails";
import { MagicWords } from "./magicWords";
import { PhoenixFlameScene } from "./phoenixFlame";

export class MenuScene extends Scene {
  constructor () {
    super();
    this.addBtn("Ace of Shadows", AceOfShadowsScene);
    this.addBtn("Magic Words", MagicWords);
    this.addBtn("Phoenix Flame", PhoenixFlameScene);
  }

  addBtn(t: string, Class: new () => Scene) {
    const offSetY=this.children.length;
    const bText=new PIXI.Text({
      text: t,
      style: mainMenuBtnStyle
    }) as PIXI.Text;
    bText.anchor.set(0.5);
    console.log('TEST', bText)
    // Middle of screen - Avoid pixels absolute numbers -
    // in percentage we can make response scene for all devices 
    // with same code.
    bText.position.set(perToPixWidth(50), perToPixHeight(30+offSetY*8));
    bText.interactive=true;
    bText.cursor="pointer";
    bText.on("pointerdown", () => {
      SceneManager.change(new Class());
    });
    this.addChild(bText);
  }

  update(_: number) {}
  destroyScene() {}
}
