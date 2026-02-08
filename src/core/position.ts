import { EasingFn } from "./types";

const Easing: Record<string, EasingFn>={
  linear: t => t,
  easeIn: t => t*t,
  easeOut: t => t*(2-t),
  easeInOut: t =>
    t<0.5? 2*t*t:-1+(4-2*t)*t
};

export class Position {
  x: number;
  y: number;
  z: number;
  _from: { x: number; y: number; z: number; };
  _to: { x: number; y: number; z: number; };
  _startTime: number;
  _duration: number;
  _ease: any;
  _active: boolean;
  onStart?: (pos: Position) => void;
  onUpdate?: (pos: Position, t: number) => void;
  onComplete?: (pos: Position) => void;

  constructor (x=0, y=0, z=0) {
    this.x=x;
    this.y=y;
    this.z=z;

    this._from={ x, y, z };
    this._to={ x, y, z };

    this._startTime=0;
    this._duration=0;
    this._ease=Easing.linear;

    this._active=false;
  }

  setPosition(x: number, y: number, z: number) {
    this.x=x;
    this.y=y;
    this.z=z;
    if(this.onComplete) this.onComplete(this);
  }

  // GSAP-like tween
  to(options={}) {
    const {
      x=this.x,
      y=this.y,
      z=this.z,
      duration=1,
      ease='linear',
      onStart,
      onUpdate,
      onComplete
    }: any=options;
    this._from={ x: this.x, y: this.y, z: this.z };
    this._to={ x, y, z };
    this._duration=Math.max(0.0001, duration)*1000;
    this._startTime=performance.now();
    this._ease=typeof ease==='function'? ease:(Easing[ease]||Easing.linear);
    this.onStart=onStart;
    this.onUpdate=onUpdate;
    this.onComplete=onComplete;
    this._active=true;
    if(this.onStart) this.onStart(this);
  }

  update(time=performance.now()) {
    if(!this._active) return;
    const elapsed=time-this._startTime;
    const t=Math.min(elapsed/this._duration, 1);
    const k=this._ease(t);

    this.x=this._from.x+(this._to.x-this._from.x)*k;
    this.y=this._from.y+(this._to.y-this._from.y)*k;
    this.z=this._from.z+(this._to.z-this._from.z)*k;

    if(t>=1) {
      this._active=false;
      this.x=this._to.x;
      this.y=this._to.y;
      this.z=this._to.z;
      if(this.onComplete) this.onComplete(this);
    }
  }
}

export function perToPixWidth(p: number) {
  return window.innerWidth/100*p;
}

export function perToPixHeight(p: number) {
  return window.innerHeight/100*p;
}