import * as PIXI from "pixi.js";
import { SceneManager } from "./core/sceneManager";
import { MenuScene } from "./scenes/menuScene";
import { onFirstInteraction } from "./utils/utils";

/**
 * @description
 * This is main instance file content.
 * Prepare FullScreen on first user request/interactions.
 * Handle global events.
 */
async function start() {
  const app=new PIXI.Application();

  await app.init({
    width: innerWidth,
    height: innerHeight,
    backgroundColor: 0x1e1e1e,
    antialias: true
  });

  document.body.appendChild(app.canvas);

  SceneManager.init(app);
  SceneManager.change(new MenuScene());

  app.ticker.add((ticker) => {
    SceneManager.update(ticker.deltaTime);
  });

  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
  });

  // window.addEventListener('pointerdown', onFirstInteraction);
}

start();