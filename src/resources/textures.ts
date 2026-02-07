import { Assets } from "pixi.js";
import * as PIXI from "pixi.js";

/**
 * @description
 * Rule is force webp format if supported if not
 * use same path same filename with diff exstension png.
 * @param path 
 * @returns 
 * PIXI texture object
 */
export async function loadTexture(path: string): Promise<PIXI.Texture> {
  await Assets.load(path);
  const tex=Assets.get(path);
  if(!tex) {
    path = path.replace(".webp", ".png");
    await Assets.load(path);
    const pngTex=Assets.get(path);
    if(!pngTex) throw new Error(`Texture not loaded for path: ${path}!`);
  }
  return tex;
}

/**
 * @description
 * Simple url texture loader for PIXI.
 * Parser enum values: loadTextures, loadImageBitmap
 * @param url
 * @param parser 
 * @returns PIXI texture object
 */
export async function loadUrlTexture(url: string , parser = "loadTextures"): Promise<PIXI.Texture> {
  await PIXI.Assets.load({
    src: url,
    parser: parser,
  });
  return PIXI.Assets.get(url);
}

// CORS or auth Fix solution
export async function loadUrlTexture2(url: string): Promise<PIXI.Texture> {
  const res = await fetch(url);
  const blob = await res.blob();
  const img = URL.createObjectURL(blob);
  return PIXI.Texture.from(img);
}