import * as PIXI from "pixi.js";
import { Scene } from "./scene";

export class SceneManager {
  private static app: PIXI.Application;
  private static currentScene?: Scene;

  static init(app: PIXI.Application): void {
    this.app=app;
  }

  static change(newScene: Scene): void {
    // Stop and remove old scene
    if(this.currentScene) {
      this.currentScene.onStop(); // ← Stop ticker
      this.app.stage.removeChild(this.currentScene);
      this.currentScene.destroy();
    }
    // Add and start new scene
    this.currentScene=newScene;
    this.app.stage.addChild(newScene);
    this.currentScene.onStart(this.app); // ← Start ticker
  }

  static getCurrentScene(): Scene|undefined {
    return this.currentScene;
  }

  static update(delta: number) {
    this.currentScene?.update(delta);
  }
}
