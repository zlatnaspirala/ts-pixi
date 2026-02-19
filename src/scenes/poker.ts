import * as PIXI from "pixi.js";
import { Scene } from "../core/scene";
import { CardStack } from "../components/card-stack";
import { Card } from "../components/card";
import { loadTexture } from "../resources/textures";
import { addFPS, createButton } from "../services/helpers-methods";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { MenuScene } from "./menuScene";
import { SceneManager } from "../core/sceneManager";
import { lockLandscape, getOrientation, isMobile, lockPortrait } from "../utils/utils";
import { FORCE_MOBILE_LOCK_SCREEN } from "../appConfig";

export class Poker extends Scene {
  private entities: any[]=[];
  private stack1: CardStack|any;
  private stack2: CardStack|any;
  private totalStackCards=144;
  private addFPS: Function;
  private fpsText: PIXI.Text|undefined;
  private fpsTitle: PIXI.Text|undefined;
  private task1: any=0;

  constructor () {
    super();
    loadTexture("./assets/textures/card1.webp").then((cardTexture) => {
      this.stack1=new CardStack();
      this.stack2=new CardStack();
      this.stack1.position.set(
        window.innerWidth/3,
        isMobile()? getOrientation()==="portrait"? window.innerHeight/4:window.innerHeight/100*15:window.innerHeight/4
      );
      this.stack2.position.set(
        window.innerWidth/3*2,
        isMobile()? getOrientation()==="portrait"? window.innerHeight/4:window.innerHeight/100*15:window.innerHeight/4
      );
      this.addChild(this.stack1);
      this.addChild(this.stack2);
      for(let i=0; i<this.totalStackCards; i++) {
        const card=new Card(cardTexture);
        this.stack1.push(card);
      }
      this.startCardMovement();
    });
    let btnBack=createButton("Back to menu", () => {
      SceneManager.change(new MenuScene());
    });
    btnBack.position.y=perToPixHeight(1);
    btnBack.position.x=perToPixWidth(5);
    this.addChild(btnBack);
    this.addFPS=addFPS.bind(this);
    this.fpsText=this.addFPS(this);
    this.fpsTitle=this.getChildByLabel("fpsTitle") as PIXI.Text;


    if(screen.orientation) {
      screen.orientation.addEventListener('change', () => {
        console.log(`Current orientation is ${screen.orientation.type}`);
      });
    }

    // One of options
    // Lock orientation - Easy by not ultimate solution.
    // Not 100% safe - WOrks only after first user request (touch event).
    if(FORCE_MOBILE_LOCK_SCREEN===true) {
      if(getOrientation()==="landscape") {
        lockLandscape().then(() => {
          console.info('lock pass!')
        }).catch(() => {
          console.info('lock fail!')
        });
      } else {
        lockPortrait().then(() => {
          console.info('lock pass!')
        }).catch(() => {
          console.info('lock fail!')
        });
      }
    }
  }

  update(_deltaMS: number) {
    const now=performance.now();
    if(this.stack1) for(const e of this.stack1.cards) {
      if(e.pos) {
        e.pos.update(now);
        e.position.set(e.pos.x, e.pos.y);
      }
    }
    if(this.stack2) for(const e of this.stack2.cards) {
      if(e.pos) {
        e.pos.update(now);
        e.position.set(e.pos.x, e.pos.y);
      }
    }
    if(this.app&&this.fpsText) this.fpsText.text=`${Math.round(this.app.ticker.FPS)}`;
  }

  startCardMovement() {
    this.task1=setInterval(() => {
      if(!this.stack1||this.stack1.cards.length===0) return;
      const card=this.stack1.top();
      if(!card) {
        clearInterval(this.task1);
        this.task1=0;
        return;
      }
      let worldPos;
      try {
        worldPos=card.getGlobalPosition();
      } catch(err) {
        clearInterval(this.task1);
        this.task1=0
        return;
      }
      this.stack1.pop();
      this.stack2.addChild(card);
      this.stack2.cards.push(card);
      const localPos=this.stack2.toLocal(worldPos);
      card.pos.setPosition(localPos.x, localPos.y);
      const targetY=(this.stack2.cards.length-1)*this.stack1.YOffset;
      card.pos.to({
        x: 0,
        y: targetY,
        duration: 2,
        ease: 'easeInOut'
      });
      // card.zIndex=-this.stack2.cards.length;
      card.zIndex=this.stack2.cards.length;
      this.stack2.sortChildren();
    }, 1000);
  }

  destroyScene() {
    this.entities.length=0;
    this.stack1.destroy({ children: true });
  }

  onResize() {
    const isPortrait=getOrientation()==="portrait";
    const stackY=isMobile()? (isPortrait? perToPixHeight(25):perToPixHeight(15)):perToPixHeight(25);
    if(this.stack1) this.stack1.position.set(window.innerWidth/3, stackY);
    if(this.stack2) this.stack2.position.set((window.innerWidth/3)*2, stackY);
    const allStacks=[this.stack1, this.stack2];
    allStacks.forEach(stack => {
      if(!stack) return;
      stack.cards.forEach((card: Card) => {
        card.updateLayout();
        const index=stack.cards.indexOf(card);
        const targetY=index*stack.YOffset;
        if(!card.pos._active) {
          card.y=targetY;
          card.pos.y=targetY;
        } else {
          card.pos._to.y=targetY;
        }
      });
    });
  }
}