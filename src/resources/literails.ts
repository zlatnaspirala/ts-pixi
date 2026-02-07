import { isMobile } from "../utils/utils";
import * as PIXI from "pixi.js";

/**
 * @description
 * Predefinited objects, vars.
 * Define ones.
 */
export const mainMenuBtnStyle : PIXI.TextStyleOptions ={
  fill: 0xffffff,
  fontSize: isMobile() ? 26 : 36,
  align: "center"
}