export enum DialogSide {
  LEFT="left",
  RIGHT="right"
}

export interface Avatar {
  name: string;
  url: string;
  position: DialogSide
}

export interface Emoji {
  name: string;
  url: string;
}

export interface DialogLine {
  name: string;
  text: string;
}