import * as PIXI from 'pixi.js';
import { MyParticleSprite } from "../types/globalDefinitions";
import { perToPixHeight, perToPixWidth } from '../core/position';
import { createStarTexture } from '../services/shapes';

export class PhoenixFlameGraphics extends PIXI.Container {
  private particles: MyParticleSprite[]=[];
  private particleTexture: PIXI.Texture;
  private emitterX: number;
  private emitterY: number;
  private initX: number;
  private initY: number;
  private maxParticles=15;
  private spawnTimer=0;
  private spawnRate=0.05;
  private dirX:number = 1;

  private createStarTexture: () => PIXI.Texture;

  constructor (x: number, y: number, type ="star", dirX = 1) {
    super();
    this.initX=x;
    this.initY=y;
    this.emitterX=x;
    this.emitterY=y;
    this.dirX = dirX;

    this.createStarTexture = createStarTexture.bind(this);
    if (type == "star") this.particleTexture=this.createStarTexture();
    else this.particleTexture=this.createParticleTexture();
  }

  private createParticleTexture(): PIXI.Texture {
    const size=128;
    const canvas=document.createElement('canvas');
    canvas.width=size;
    canvas.height=size;
    const ctx=canvas.getContext('2d')!;
    const center=size/2;

    // 1. Clean background
    ctx.clearRect(0, 0, size, size);

    // 2. Create a sharp horizontal "flare" (anamorphic look)
    const flareGrd=ctx.createRadialGradient(center, center, 0, center, center, size/2);
    flareGrd.addColorStop(0, 'rgba(255, 255, 255, 1)'); // White core
    flareGrd.addColorStop(0.1, 'rgba(0, 200, 255, 0.8)'); // Cyan/Electric Blue
    flareGrd.addColorStop(0.4, 'rgba(0, 50, 255, 0.2)'); // Deep Blue wash
    flareGrd.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Fade

    // Draw a stretched ellipse for the "tech" flare look
    ctx.save();
    ctx.translate(center, center);
    ctx.scale(1.5, 0.2); // Stretch horizontally, squash vertically
    ctx.fillStyle=flareGrd;
    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // 3. Create a vertical "glitch" spike
    ctx.save();
    ctx.translate(center, center);
    ctx.scale(0.1, 1.2); // Thin vertical spike
    ctx.fillStyle='rgba(200, 230, 255, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, size/2, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();

    // 4. Central Core Glow
    const coreGrd=ctx.createRadialGradient(center, center, 0, center, center, size/4);
    coreGrd.addColorStop(0, '#ffffff');
    coreGrd.addColorStop(0.5, 'rgba(100, 255, 255, 0.5)');
    coreGrd.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle=coreGrd;
    ctx.beginPath();
    ctx.arc(center, center, size/4, 0, Math.PI*2);
    ctx.fill();

    return PIXI.Texture.from(canvas);
  }

  private spawnParticle(): void {
    if(this.particles.length>=this.maxParticles) {
      // Recycle oldest particle
      const oldest=this.particles.shift()!;
      this.resetParticle(oldest);
      this.particles.push(oldest);
    } else {
      // Create new particle
      const sprite=new PIXI.Sprite(this.particleTexture);
      sprite.anchor.set(0.5);
      sprite.blendMode='add';
      this.addChild(sprite);

      const particle: MyParticleSprite={
        sprite,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 0,
        scale: 0,
        rotation: 0,
      };

      this.resetParticle(particle);
      this.particles.push(particle);
    }
  }

  private resetParticle(particle: MyParticleSprite): void {
    // Position at emitter
    particle.sprite.x=this.emitterX;
    particle.sprite.y=this.emitterY;

    // Phoenix wing motion - particles spread outward and upward
    const angle=(Math.random()-0.5)*Math.PI*0.8; // Spread
    const speed=2+Math.random()*3;

    particle.vx=Math.sin(angle)*speed;
    particle.vy=-Math.abs(Math.cos(angle))*speed-2; // Always upward

    // Lifetime
    particle.maxLife=1.0+Math.random()*1.5;
    particle.life=particle.maxLife;

    // Scale
    particle.scale=0.3+Math.random()*0.5;

    // Rotation
    particle.rotation=Math.random()*Math.PI*2;

    // Initial appearance
    particle.sprite.scale.set(particle.scale);
    particle.sprite.rotation=particle.rotation;
    particle.sprite.alpha=1;
  }

  update(deltaMS: number): void {
    // Convert to seconds
    const deltaTime=deltaMS/1000;
    // Spawn new particles
    this.spawnTimer+=deltaTime;
    while(this.spawnTimer>this.spawnRate) {
      this.spawnParticle();
      this.spawnTimer-=this.spawnRate;
    }
    // Update existing particles
    for(let i=this.particles.length-1; i>=0; i--) {
      const p=this.particles[i];
      // Update lifetime
      p.life-=deltaTime;
      if(p.life<=0) {
        // Particle died - reset it
        this.resetParticle(p);
        continue;
      }
      // Life ratio (1 = just born, 0 = about to die)
      const lifeRatio=p.life/p.maxLife;
      // Physics
      p.vy+=0.5*deltaTime; // Slight gravity
      p.sprite.x+=p.vx*deltaTime*60;
      p.sprite.y+=p.vy*deltaTime*60*this.dirX;
      // Rotation
      p.sprite.rotation+=0.02*deltaTime*60;
      // Scale - grow then shrink
      const scaleMultiplier=lifeRatio<0.3
        ? lifeRatio/0.3 // Fade out
        :Math.min(1, (1-lifeRatio)*3); // Grow in
      p.sprite.scale.set(p.scale*(0.5+scaleMultiplier*0.5));
      // Color shift: white -> yellow -> orange -> red -> dark
      if(lifeRatio>0.7) {
        // Young: white to yellow
        p.sprite.tint=0xFFFFAA;
      } else if(lifeRatio>0.4) {
        // Middle age: yellow to orange
        p.sprite.tint=0xFFAA00;
      } else if(lifeRatio>0.2) {
        // Old: orange to red
        p.sprite.tint=0xFF4400;
      } else {
        // Dying: red to dark red
        p.sprite.tint=0xAA0000;
      }
      // Alpha fade out at end of life
      p.sprite.alpha=Math.min(1, lifeRatio*3);
    }

    this.setEmitterPosition(perToPixWidth(this.initX), perToPixHeight(this.initY))
  }

  // Change emitter position (for moving phoenix)
  setEmitterPosition(x: number, y: number): void {
    this.emitterX=x;
    this.emitterY=y;
  }

  destroy(): void {
    this.particles.forEach(p => p.sprite.destroy());
    this.particles=[];
    super.destroy();
  }
}