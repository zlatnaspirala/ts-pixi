import { windowTitleStyle } from "../resources/literails";
import * as PIXI from "pixi.js";

export class DialogWindow extends PIXI.Container {
  private background: PIXI.Graphics;
  private header: PIXI.Container;
  private contentContainer: PIXI.Container;
  private scrollArea: PIXI.Container;
  private isDragging=false;
  private dragOffset={ x: 0, y: 0 };

  private windowWidth=700;
  private windowHeight=window.innerHeight*0.9;
  private headerHeight=60;
  private contentHeight: number;

  constructor () {
    super();
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
    const title=new PIXI.Text({
      text: 'Dialog',
      style: windowTitleStyle
    });
    title.x=20;
    title.y=(this.headerHeight-title.height)/2;
    this.header.addChild(title);

    this.header.eventMode='static';
    this.header.cursor='move';
    this.header.on('pointerdown', (e) => this.onDragStart(e));
    this.addChild(this.header);

    this.scrollArea=new PIXI.Container();
    this.scrollArea.x=15;
    this.scrollArea.y=this.headerHeight+10;
    // Set bounds for hitArea
    this.scrollArea.hitArea=new PIXI.Rectangle(
      0,
      0,
      this.windowWidth-30,
      this.contentHeight
    );
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

  private onDragStart(event: PIXI.FederatedPointerEvent): void {
    this.isDragging=true;
    const position=event.global;
    this.dragOffset.x=position.x-this.x;
    this.dragOffset.y=position.y-this.y;

    this.header.on('pointermove', (e) => this.onDragMove(e));
    this.header.on('pointerup', () => this.onDragEnd());
    this.header.on('pointerupoutside', () => this.onDragEnd());
  }

  private onDragMove(event: PIXI.FederatedPointerEvent): void {
    if(this.isDragging) {
      const position=event.global;
      this.x=position.x-this.dragOffset.x;
      this.y=position.y-this.dragOffset.y;
    }
  }

  private onDragEnd(): void {
    this.isDragging=false;
    this.header.off('pointermove');
    this.header.off('pointerup');
    this.header.off('pointerupoutside');
  }

  private setupScrolling(): void {
    this.scrollArea.on('wheel', (event: any) => {
      event.preventDefault();
      const scrollSpeed=1.0;
      const scrollAmount=event.deltaY*scrollSpeed;
      const contentTotalHeight=this.contentContainer.height;
      const visibleHeight=this.contentHeight;
      if(contentTotalHeight>visibleHeight) {
        const newY=this.contentContainer.y-scrollAmount;
        const minScroll=-(contentTotalHeight-visibleHeight);
        const maxScroll=0;
        this.contentContainer.y=Math.max(minScroll, Math.min(maxScroll, newY));
      }
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
}