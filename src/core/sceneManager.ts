import * as PIXI from "pixi.js";
import { Scene } from "./scene";

export class SceneManager {
  private static app: PIXI.Application;
  private static currentScene?: Scene;

  static init(app: PIXI.Application) {
    this.app = app;
  }

  static change(scene: Scene) {
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
      this.currentScene.destroyScene();
    }

    this.currentScene = scene;
    this.app.stage.addChild(scene);
  }

  static update(delta: number) {
    this.currentScene?.update(delta);
  }
}
