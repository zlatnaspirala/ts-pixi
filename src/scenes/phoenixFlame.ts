import { Scene } from "../core/scene";
import { loadTexture } from "../resources/textures";
import { createButton } from "../services/helpers-methods";
import { perToPixHeight, perToPixWidth } from "../core/position";
import { MenuScene } from "./menuScene";
import { SceneManager } from "../core/sceneManager";

export class PhoenixFlameScene extends Scene {

  constructor () {
    super();

    let btnBack=createButton("Back to menu", () => {
      SceneManager.change(new MenuScene());
    });
    btnBack.position.y=perToPixHeight(5);
    btnBack.position.x=perToPixWidth(5);
    this.addChild(btnBack);
  }

  update(deltaMS: number) {}

  destroyScene() {}
}