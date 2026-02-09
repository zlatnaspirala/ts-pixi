import './libs/hacker-timer.js';
import * as PIXI from "pixi.js";
import { SceneManager } from "./core/sceneManager";
import { MenuScene } from "./scenes/menuScene";
import { LOG_FUNNY, onFirstInteraction } from "./utils/utils";

/**
 * @description
 * This is main instance file content.
 * Prepare FullScreen on first user request/interactions.
 * Handle global events.
 */
const app=new PIXI.Application();

app.init({
  width: innerWidth,
  height: innerHeight,
  backgroundColor: 'black',
  antialias: true
}).then(() => {

  document.body.appendChild(app.canvas);

  SceneManager.init(app);
  SceneManager.change(new MenuScene());

  app.ticker.add((ticker) => {
    SceneManager.update(ticker.deltaTime);
  });

  window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
    SceneManager.onResize();
  });

  window.addEventListener('pointerdown', onFirstInteraction);
  console.log(`%c🚀 Script started with success!`, LOG_FUNNY);

}).catch((err) => {
  console.log(`%cApp error: ${err}`, LOG_FUNNY);
});