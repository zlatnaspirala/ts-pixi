import './libs/hacker-timer.js';
import * as PIXI from "pixi.js";
import { SceneManager } from "./core/sceneManager";
import { MenuScene } from "./scenes/menuScene";
import { getIsFullscreen, isMobile, LOG_FUNNY, onFirstInteraction } from "./utils/utils";

/**
 * @description
 * This is main instance file content.
 * Prepare FullScreen on first user request/interactions.
 * Handle global events.
 */
const app=new PIXI.Application();

app.init({
  autoDensity: false,
  width: screen.width,
  height: screen.height,
  backgroundColor: 'black',
  antialias: true
}).then(() => {
  document.body.appendChild(app.canvas);

  SceneManager.init(app);
  SceneManager.change(new MenuScene());
  app.ticker.add((ticker) => { SceneManager.update(ticker.deltaTime) });

  function resize() {
    const dpr=getIsFullscreen()==true? 1:window.devicePixelRatio;
    const w: any=window.screen.width;
    const h: any=window.screen.height;
    app.renderer.resolution=dpr;
    app.renderer.resize(w, h);
    SceneManager.onResize();
  }

  window.addEventListener('resize', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    resize();
  });

  resize();

  document.body.style.touchAction="manipulation";
  document.body.style.webkitTextSizeAdjust="100%";

  localStorage.removeItem('first-touch');
  document.addEventListener('fullscreenchange', (e) => {
    e.preventDefault();
  });

  isMobile()? window.addEventListener('touchend', onFirstInteraction):
    window.addEventListener('click', onFirstInteraction);
  console.log(`%c🚀 Script started with success!`, LOG_FUNNY);

}).catch((err) => {
  console.log(`%cApp error: ${err}`, LOG_FUNNY);
});