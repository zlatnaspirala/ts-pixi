import * as PIXI from 'pixi.js';
import { MyParticleSprite } from "../types/globalDefinitions";

export class PhoenixFlame extends PIXI.Container {
  private particles: MyParticleSprite[]=[];
  private particleTexture: PIXI.Texture;
  private emitterX: number;
  private emitterY: number;
  private maxParticles=10;
  private spawnTimer=0;
  private spawnRate=0.05; // Spawn every 50ms

  constructor (x: number, y: number) {
    super();
    this.emitterX=x;
    this.emitterY=y;
    // Create particle texture (glowing circle)
    this.particleTexture=this.createParticleTexture();
  }

  private createParticleTexture(): PIXI.Texture {
    const size=64;
    const canvas=document.createElement('canvas');
    canvas.width=size;
    canvas.height=size;
    const ctx=canvas.getContext('2d')!;

    // Create radial gradient
    const gradient=ctx.createRadialGradient(
      size/2, size/2, 0,
      size/2, size/2, size/2
    );

    gradient.addColorStop(0, 'rgba(255, 255, 200, 1)'); // White hot center
    gradient.addColorStop(0.3, 'rgba(255, 180, 0, 0.9)'); // Yellow
    gradient.addColorStop(0.6, 'rgba(255, 80, 0, 0.6)'); // Orange
    gradient.addColorStop(0.8, 'rgba(200, 0, 0, 0.3)'); // Red
    gradient.addColorStop(1, 'rgba(100, 0, 0, 0)'); // Transparent

    ctx.fillStyle=gradient;
    ctx.fillRect(0, 0, size, size);

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
      sprite.blendMode='add'; // Additive blending for glow
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
      p.sprite.y+=p.vy*deltaTime*60;
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