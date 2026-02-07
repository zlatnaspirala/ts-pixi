import * as PIXI from "pixi.js";

export abstract class Scene extends PIXI.Container {
  protected app?: PIXI.Application;
  private updateBound: (ticker: PIXI.Ticker) => void;

  constructor() {
    super();
    
    // Bind update method
    this.updateBound = (ticker: PIXI.Ticker) => {
      this.update(ticker.deltaMS);
    };
  }

  // Called by SceneManager when scene is activated
  onStart(app: PIXI.Application): void {
    this.app = app;
    app.ticker.add(this.updateBound);
  }

  // Called by SceneManager when scene is removed
  onStop(): void {
    if (this.app) {
      this.app.ticker.remove(this.updateBound);
      this.app = undefined;
    }
  }

  abstract update(deltaMS: number): void;
  
  abstract destroyScene(): void;

  destroy(options?: any): void {
    this.onStop();
    this.destroyScene();
    super.destroy(options);
  }
}