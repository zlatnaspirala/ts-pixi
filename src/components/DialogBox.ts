import * as PIXI from "pixi.js";
import { getOrientation, isMobile } from "../utils/utils";
import { windowTitleStyle } from "../resources/literails";
import { perToPixHeight, perToPixWidth } from "../core/position";

export class DialogWindow extends PIXI.Container {
  private background: PIXI.Graphics;
  private header: PIXI.Container;
  private contentContainer: PIXI.Container;
  private scrollArea: PIXI.Container;
  private isDragging=false;
  private dragOffset={ x: 0, y: 0 };
  private windowWidth=isMobile()? perToPixWidth(93):700;
  private windowHeight=isMobile()? getOrientation()=="portrait"? perToPixHeight(85):perToPixHeight(80):window.innerHeight*0.8;
  private headerHeight=isMobile()? 45:60;
  private contentHeight: number;
  // mobile
  private isScrolling=false;
  private lastPointerY=0;
  private scrollVelocity=0;
  private friction=0.95;
  private minVelocity=0.1;

  constructor (widthPer: number, heightPer: number) {
    super();

    if(widthPer) this.windowWidth=widthPer;
    if(heightPer) this.windowHeight=heightPer;

    this.contentHeight=this.windowHeight-this.headerHeight-20;
    // Background
    this.background=new PIXI.Graphics();
    this.background.roundRect(0, 0, this.windowWidth, this.windowHeight, 16);
    this.background.fill({ color: 0x1a1a2e, alpha: 0.95 });
    this.background.stroke({ width: 2, color: 0x4a4a6a });
    this.addChild(this.background);
    // Header
    this.header=new PIXI.Container();
    const headerBg=new PIXI.Graphics();
    headerBg.roundRect(0, 0, this.windowWidth, this.headerHeight, 16);
    headerBg.fill({ color: 0x2d2d44, alpha: 1 });
    this.header.addChild(headerBg);
    const title=new PIXI.Text({ text: 'Dialog', style: windowTitleStyle });
    title.x=20;
    title.y=(this.headerHeight-title.height)/2;
    this.header.addChild(title);
    this.header.eventMode='static';
    this.header.cursor='move';
    this.header.on('pointerdown', this.onDragStart, this);
    this.header.on('pointermove', this.onDragMove, this);
    this.header.on('pointerup', this.onDragEnd, this);
    this.header.on('pointerupoutside', this.onDragEnd, this);
    this.addChild(this.header);
    this.scrollArea=new PIXI.Container();
    this.scrollArea.x=15;
    this.scrollArea.y=this.headerHeight+10;
    this.scrollArea.hitArea=new PIXI.Rectangle(0, 0, this.windowWidth-30, this.contentHeight);
    this.scrollArea.eventMode='static';
    this.addChild(this.scrollArea);
    // Content container
    this.contentContainer=new PIXI.Container();
    this.scrollArea.addChild(this.contentContainer);
    const mask=new PIXI.Graphics()
      .rect(0, 0, this.windowWidth-30, this.contentHeight)
      .fill(0xffffff);
    this.scrollArea.addChild(mask);
    this.scrollArea.mask=mask;
    this.setupScrolling();
    this.x=(window.innerWidth-this.windowWidth)/2;
    this.y=(window.innerHeight-this.windowHeight)/2;
  }

  private onDragStart(e: PIXI.FederatedPointerEvent): void {
    this.isDragging=true;
    this.dragOffset.x=e.global.x-this.x;
    this.dragOffset.y=e.global.y-this.y;
    this.eventMode='static';
    this.header.on('pointermove', this.onDragMove, this);
    this.header.on('pointerup', this.onDragEnd, this);
    this.header.on('pointerupoutside', this.onDragEnd, this);
  }

  private onDragMove(e: PIXI.FederatedPointerEvent): void {
    if(!this.isDragging) return;
    this.x=e.global.x-this.dragOffset.x;
    this.y=e.global.y-this.dragOffset.y;
  }

  private onDragEnd(): void {
    this.isDragging=false;
    this.header.off('pointermove', this.onDragMove, this);
    this.header.off('pointerup', this.onDragEnd, this);
    this.header.off('pointerupoutside', this.onDragEnd, this);
  }

  private scrollContent(deltaY: number): void {
    const contentTotalHeight=this.contentContainer.height;
    const visibleHeight=this.contentHeight;

    if(contentTotalHeight<=visibleHeight) return;

    const minScroll=-(contentTotalHeight-visibleHeight);
    const maxScroll=0;

    let newY=this.contentContainer.y-deltaY;

    if(newY>maxScroll) {
      newY=maxScroll;
      this.scrollVelocity=0;
    }

    if(newY<minScroll) {
      newY=minScroll;
      this.scrollVelocity=0;
    }

    this.contentContainer.y=newY;
  }

  private setupScrolling(): void {
    // Desktop
    this.scrollArea.on('wheel', (event: WheelEvent) => {
      if(isMobile()) return;
      event.preventDefault();
      this.scrollContent(event.deltaY);
    });
    // Mobile
    this.scrollArea.eventMode='static';
    this.scrollArea.cursor='default';
    this.scrollArea.on('pointerdown', (e: PIXI.FederatedPointerEvent) => {
      if(!isMobile()) return;
      this.isScrolling=true;
      this.scrollVelocity=0;
      this.lastPointerY=e.global.y;
    });
    this.scrollArea.on('pointermove', (e: PIXI.FederatedPointerEvent) => {
      if(!this.isScrolling||!isMobile()) return;
      const delta=e.global.y-this.lastPointerY;
      this.lastPointerY=e.global.y;
      // store velocity
      this.scrollVelocity=delta;
      this.scrollContent(-delta);
    });
    this.scrollArea.on('pointerup', () => {
      if(!isMobile()) return;
      this.isScrolling=false;
    });
    this.scrollArea.on('pointerupoutside', () => {
      if(!isMobile()) return;
      this.isScrolling=false;
    });
  }

  addChild(...children: any[]): any {
    if(children[0]===this.background||
      children[0]===this.header||
      children[0]===this.scrollArea) {
      return super.addChild(...children);
    }
    return this.contentContainer.addChild(...children);
  }

  private updateInertia(): void {
    if(this.isScrolling) return;
    if(Math.abs(this.scrollVelocity)<this.minVelocity) {
      this.scrollVelocity=0;
      return;
    }
    this.scrollVelocity*=this.friction;
    this.scrollContent(-this.scrollVelocity);
  }

  // Calling from Scene class
  update() {
    this.updateInertia()
  }
}