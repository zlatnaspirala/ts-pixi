import { Position } from "./position";

export class TweenManager {
  private static _instance: TweenManager;
  private positions: Set<Position> = new Set();

  private constructor() {}

  static get instance() {
    if (!this._instance) this._instance = new TweenManager();
    return this._instance;
  }

  register(pos: Position) {
    this.positions.add(pos);
  }

  unregister(pos: Position) {
    this.positions.delete(pos);
  }

  update(deltaMS: number) {
    const now = performance.now();
    for (const pos of this.positions) {
      pos.update(now);
      if (!pos._active) {
        this.unregister(pos);
      }
    }
  }
}
