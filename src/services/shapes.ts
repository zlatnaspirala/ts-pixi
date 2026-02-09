import * as PIXI from "pixi.js";

export function createStarTexture(): PIXI.Texture {
  const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const center = size / 2;

    // 1. Draw the "Glow"
    const grd = ctx.createRadialGradient(center, center, 0, center, center, size / 2);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    grd.addColorStop(0.2, 'rgba(0, 255, 255, 0.4)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, size, size);

    // 2. Draw the Star Spikes
    ctx.fillStyle = 'white';
    for (let i = 0; i < 2; i++) {
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(i * Math.PI / 2); // Rotate 90 degrees
        // Draw a very thin, long diamond shape
        ctx.beginPath();
        ctx.moveTo(-size / 2, 0);
        ctx.lineTo(0, -2); // Thinness
        ctx.lineTo(size / 2, 0);
        ctx.lineTo(0, 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    return PIXI.Texture.from(canvas);
}