import { Scene } from "../core/scene";
import { CardStack } from "../components/card-stack";
import { Card } from "../components/card";
import { loadTexture } from "../resources/textures";
import { createButton } from "../services/helpers-methods";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { MenuScene } from "./menuScene";
import { SceneManager } from "../core/sceneManager";

export class AceOfShadowsScene extends Scene {
  private entities: any[]=[];
  private stack1: CardStack|any;
  private stack2: CardStack|any;
  private totalStackCards=144;

  constructor () {
    super();

    loadTexture("/assets/textures/card1.webp").then((cardTexture) => {
      this.stack1=new CardStack();
      this.stack2=new CardStack();
      this.stack1.position.set(window.innerWidth/3, window.innerHeight/3);
      this.stack2.position.set(window.innerWidth/3*2, window.innerHeight/3);
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
    btnBack.position.y=perToPixHeight(5);
    btnBack.position.x=perToPixWidth(5);
    this.addChild(btnBack);
  }

  update(deltaMS: number) {
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
  }

  startCardMovement() {
    let task1=setInterval(() => {
      if(!this.stack1||this.stack1.cards.length===0) return;
      const card=this.stack1.top();
      if(!card) {
        clearInterval(task1);
        task1=0;
        return;
      }
      const worldPos=card.getGlobalPosition();
      this.stack1.pop();
      this.stack2.addChild(card);
      this.stack2.cards.push(card);
      const localPos=this.stack2.toLocal(worldPos);
      card.pos.setPosition(localPos.x, localPos.y);
      const targetY=(this.stack2.cards.length-1)*4;
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
}