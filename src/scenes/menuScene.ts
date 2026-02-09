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

export class MenuScene extends Scene {
  private buttons: PIXI.Text[]=[];
  private addFPS: Function;
  private fpsText: PIXI.Text|undefined;
  private welcomeDialog: DialogWindow|undefined;
  private welcomeText: PIXI.Text|undefined;

  constructor () {
    super();
    this.addBtn("Ace of Shadows", AceOfShadowsScene);
    this.addBtn("Magic Words", MagicWords);
    this.addBtn("Phoenix Flame", PhoenixFlameScene);

    if(localStorage.getItem('first-touch')===null&&isMobile()===true) {
      this.welcomeDialog=new DialogWindow();
      // const welcomeText=new PIXI.Text({ text: "Welcome here \n run fullscreen and start the game \n Click any where!", style: mainMenuBtnStyle }) as PIXI.Text;
      this.welcomeText=new PIXI.Text({ text: "Welcome here Play for free  \nClick/Tap anywhere to start!", style: isMobile()? windowTitleStyle:mainMenuBtnStyle }) as PIXI.Text;
      this.welcomeDialog.eventMode='static';
      this.welcomeDialog.cursor='pointer';
      this.welcomeDialog.on("pointerdown", () => {
        localStorage.setItem('first-touch', "true");
        if(this.welcomeDialog) this.removeChild(this.welcomeDialog);
      });
      this.welcomeDialog.addChild(this.welcomeText);
      this.welcomeText.position.x=this.welcomeDialog.width/2;
      this.welcomeText.position.y=this.welcomeDialog.height/4;
      this.welcomeText.anchor.set(0.5);
      this.addChild(this.welcomeDialog);
    }

    this.addFPS=addFPS.bind(this);
    this.fpsText=this.addFPS(this);
  }

  addBtn(t: string, Class: new () => Scene) {
    const bText=new PIXI.Text({ text: t, style: mainMenuBtnStyle }) as PIXI.Text;
    bText.anchor.set(0.5);
    // Middle of screen - Avoid pixels absolute numbers -
    // in percentage we can make response scene for all devices 
    // with same code.
    this.positionButton(bText, this.buttons.length);
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
      isMobile()==true?
        getOrientation()==="landscape"? perToPixHeight(30+index*16):perToPixHeight(30+index*8)
        :perToPixHeight(30+index*8)
    );
  }

  update(_: number) {
    if(this.app&&this.fpsText) this.fpsText.text=`${Math.round(this.app.ticker.FPS)}`;
  }

  destroyScene() {}

  onResize() {
    this.buttons.forEach((btn, index) => { this.positionButton(btn, index); });

    if(this.welcomeText&&this.welcomeDialog) {
      this.welcomeText.position.x=this.welcomeDialog.width/2;
      this.welcomeText.position.y=this.welcomeDialog.height/4;
    }
  }
}
