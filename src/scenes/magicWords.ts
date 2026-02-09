import * as PIXI from "pixi.js";
import { getDataFromLink, isMobile } from "../utils/utils";
import { Scene } from "../core/scene";
import { loadTexture, loadUrlTexture } from "../resources/textures";
import { Avatar, Emoji, DialogLine } from "../types/appDefinitions";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { addFPS, createButton } from "../services/helpers-methods";
import gsap from "gsap";
import { MenuScene } from "./menuScene";
import { SceneManager } from "../core/sceneManager";
import { createGlowFilter } from "../shaders/base";
import { magicWordsTextStyle } from "../resources/literails";
import { DialogWindow } from "../components/dialogBox";

export class MagicWords extends Scene {
  private link1: string="https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";
  private avatars=new Map<string, Avatar>();
  private avatarTextures=new Map<string, PIXI.Texture>();
  private emojiTextures=new Map<string, PIXI.Texture>();
  private dialogLines: DialogLine[]=[];
  private dialogAppearInterval: number=350;
  private winDialog: DialogWindow|null;
  private testFilters: any[]=[];
  private addFPS: Function;
  private fpsText: PIXI.Text|undefined;

  constructor () {
    super();
    this.winDialog=null;

    loadTexture('./assets/textures/default.png').then((tex) => {
      this.avatarTextures.set('default', tex);
    });

    getDataFromLink(this.link1).then((r: any) => {
      // console.log(r.avatars)
      const avatarPromises=r.avatars.map((a: Avatar) =>
        loadUrlTexture(a.url).then((tex) => {
          this.avatarTextures.set(a.name, tex);
          this.avatars.set(a.name, a);
        })
      );
      const emojiPromises=r.emojies.map((emoji: Emoji) =>
        loadUrlTexture(emoji.url).then((tex) => { this.emojiTextures.set(emoji.name, tex) })
      );
      Promise.all([...avatarPromises, ...emojiPromises]).then(() => {
        this.dialogLines=r.dialogue;
        this.renderDialog();
      });
    });
    let btnBack=createButton("Back to menu", () => {
      SceneManager.change(new MenuScene());
    });
    btnBack.position.y=perToPixHeight(5);
    btnBack.position.x=perToPixWidth(5);
    this.addChild(btnBack);
    this.addFPS=addFPS.bind(this);
    this.fpsText=this.addFPS(this);
  }

  private renderDialog() {
    let yPos=20;
    this.winDialog=new DialogWindow();
    const contentWidth=isMobile()? perToPixWidth(90):665;

    this.dialogLines.forEach((line, i) => {
      const dialogBox=this.createDialogBox(line, contentWidth);
      const targetY=yPos;
      yPos+=dialogBox.height+15;
      dialogBox.y=0;
      dialogBox.alpha=0;
      dialogBox.scale.set(0.95);
      if(this.winDialog) this.winDialog.addChild(dialogBox);
      const baseDelay=i*this.dialogAppearInterval/1000;
      gsap.to(dialogBox, {
        y: targetY,
        alpha: 1,
        scale: 1,
        duration: 0.45,
        delay: baseDelay,
        ease: "power3.out",
        onStart: () => {
          const mask=(dialogBox as any)._textMask;
          const fullWidth=(dialogBox as any)._textWidth;
          if(mask&&fullWidth) {
            gsap.fromTo(mask, { width: 0 },
              {
                width: fullWidth,
                duration: 0.2,
                delay: baseDelay+0.2,
                ease: "none"
              }
            );
          }
        }
      });
    });
    this.addChild(this.winDialog);
  }

  private createDialogBox(line: DialogLine, stageWidth=800): PIXI.Container {
    const container=new PIXI.Container();
    let avatarInfo;
    if(this.avatars.get(line.name)==null||this.avatars.get(line.name)==undefined) {
      console.log("NO AVATAR REGISTRED NAME DETECT")
      avatarInfo={
        name: line.name,
        url: "",
        position: 'left' // must be left or right
      };
    } else {
      avatarInfo=this.avatars.get(line.name);
    }

    const nameTag=new PIXI.Text({
      text: avatarInfo?.name||line.name,
      style: {
        ...magicWordsTextStyle,
        fontSize: 12,
        fill: 0xffffff,
        fontWeight: 'bold'
      }
    });
    nameTag.alpha=0.7;

    const side=avatarInfo?.position??"left";

    const maxWidth=stageWidth*0.65;
    const padding=14;
    const avatarSize=80;
    const gap=12;

    const textContainer=this.parseText(line.text, maxWidth-padding*2);

    // Bubble with neon glow
    const bubble=new PIXI.Graphics();
    const bubbleColor=side==="left"? 0x3498db:0x2ecc71;

    const bubbleWidth=textContainer.width+padding*2;
    const bubbleHeight=textContainer.height+padding*2;

    bubble.roundRect(0, 0, bubbleWidth, bubbleHeight, 12);
    bubble.fill({ color: bubbleColor, alpha: 0.2 });
    bubble.stroke({ width: 2, color: bubbleColor, alpha: 0.8 });

    const innerBubble=new PIXI.Graphics();
    innerBubble.roundRect(3, 3, bubbleWidth-6, bubbleHeight-6, 10);
    innerBubble.fill({ color: bubbleColor, alpha: 0.9 });

    // Avatar - LARGER and more visible
    let avatar: PIXI.Sprite|null=null;

    const avatarContainer=new PIXI.Container();
    if(this.avatarTextures.has(line.name)) {
      avatar=new PIXI.Sprite(this.avatarTextures.get(line.name)!);
    } else {
      avatar=new PIXI.Sprite(this.avatarTextures.get('default')!);
    }
    avatar.width=avatar.height=avatarSize;
    avatarContainer.addChild(avatar);
    let myF=createGlowFilter();
    this.testFilters.push(myF)
    avatar.filters=[myF];
    const avatarMask=new PIXI.Graphics();
    avatarMask.circle(avatarSize/2, avatarSize/2, avatarSize/2);
    avatarMask.fill(0xffffff);
    avatarContainer.addChild(avatarMask);
    avatar.mask=avatarMask;
    // Neon ring around avatar - THICKER
    const avatarRing=new PIXI.Graphics();
    avatarRing.circle(avatarSize/2, avatarSize/2, avatarSize/2);
    avatarRing.stroke({ width: 4, color: bubbleColor, alpha: 0.9 });
    avatarContainer.addChild(avatarRing);
    avatar=avatarContainer as any;
    if(side==="left") {
      if(avatar) {
        avatar.x=5;
        avatar.y=0;
        container.addChild(avatar);
        bubble.x=avatarSize+gap;
        innerBubble.x=bubble.x;
        innerBubble.y=bubble.y;

        nameTag.x=avatar.x+(avatarSize/2)-(nameTag.width/2);
        nameTag.y=avatarSize+5;
        container.addChild(nameTag);

      } else {
        bubble.x=0;
        innerBubble.x=0;
        innerBubble.y=0;
      }
    } else {
      // RIGHT SIDE - align to winDialog edge
      const totalWidth=bubbleWidth+(avatar? avatarSize+gap:0);
      const startX=stageWidth-totalWidth;

      bubble.x=startX;
      innerBubble.x=bubble.x;
      innerBubble.y=bubble.y;

      if(avatar) {
        avatar.x=startX+bubbleWidth+gap; // Avatar after bubble
        avatar.y=0;
        container.addChild(avatar);

        nameTag.x=avatar.x+(avatarSize/2)-(nameTag.width/2);
        nameTag.y=avatarSize+5;
        container.addChild(nameTag);
      }
    }

    textContainer.x=bubble.x+padding;
    textContainer.y=padding;

    container.addChild(bubble);
    container.addChild(innerBubble);
    container.addChild(textContainer);

    const textMask=new PIXI.Graphics();
    textMask.rect(
      textContainer.x,
      textContainer.y,
      textContainer.width,
      textContainer.height
    );
    textMask.fill(0xffffff);

    container.addChild(textMask);
    textContainer.mask=textMask;

    (container as any)._textMask=textMask;
    (container as any)._textMaskStartX=textContainer.x;
    (container as any)._textWidth=textContainer.width;
    return container;
  }

  private createText(text: string): PIXI.Text {
    return new PIXI.Text({
      text: text,
      style: magicWordsTextStyle
    });
  }

  // Perfomance care
  private parseText(text: string, maxWidth: number=400): PIXI.Container {
    const container=new PIXI.Container();
    const emojiRegex=/\{(\w+)\}/g;

    const parts: Array<{ type: 'text'|'emoji', content: string }>=[];
    let lastIndex=0;
    let match;

    // Parse into parts
    while((match=emojiRegex.exec(text))!==null) {
      if(match.index>lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }
      parts.push({
        type: 'emoji',
        content: match[1]
      });
      lastIndex=match.index+match[0].length;
    }

    if(lastIndex<text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }
    // Layout with word wrapping
    let xPos=0;
    let yPos=0;
    const lineHeight=24;
    parts.forEach(part => {
      if(part.type==='text') {
        const words=part.content.split(' ');
        words.forEach((word, i) => {
          const textSprite=this.createText(word+(i<words.length-1? ' ':''));
          // Word wrap
          if(xPos+textSprite.width>maxWidth&&xPos>0) {
            xPos=0;
            yPos+=lineHeight;
          }
          textSprite.x=xPos;
          textSprite.y=yPos;
          container.addChild(textSprite);
          xPos+=textSprite.width;
        });
      } else if(part.type==='emoji') {
        if(this.emojiTextures.has(part.content)) {
          const emoji=new PIXI.Sprite(this.emojiTextures.get(part.content)!);
          emoji.width=20;
          emoji.height=20;
          // Word wrap for emoji
          if(xPos+emoji.width>maxWidth&&xPos>0) {
            xPos=0;
            yPos+=lineHeight;
          }
          emoji.x=xPos;
          emoji.y=yPos;
          container.addChild(emoji);
          xPos+=emoji.width+2;
        }
      }
    });
    return container;
  }

  update(deltaMS: number) {
    this.winDialog?.update();
    if(this.testFilters) {
      this.testFilters.forEach((f) => {
        f.resources.timeUniforms.uniforms.uTime+=0.001*(deltaMS/16.67);
        f.resources.timeUniforms.update()
      })
    }
    if(this.app&&this.fpsText) this.fpsText.text=`${Math.round(this.app.ticker.FPS)}`;
  }

  destroyScene() {}
  onResize() {}
}