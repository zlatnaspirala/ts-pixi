import { isMobile } from "../utils/utils";
import * as PIXI from "pixi.js";

/**
 * @description
 * Predefinited objects, vars.
 * Define ones.
 */
export const mainMenuBtnStyle: PIXI.TextStyleOptions={
  fill: 0xffffff,
  fontSize: isMobile()? 30:36,
  align: "center"
}

export const windowTitleStyle: PIXI.TextStyleOptions={
  fontFamily: 'Arial',
  fontSize: 24,
  fill: 0xffffff,
  fontWeight: 'bold'
}

export const magicWordsTextStyle: PIXI.TextStyleOptions={
  fontFamily: 'Arial',
  fontSize: 18,
  fill: 0xffffff,
}