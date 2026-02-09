## PIXI-TS
### Version 1.0

 - [Public demo](https://maximumroulette.com/apps/ts-pixi/)
 - [API Docs](https://maximumroulette.com/apps/ts-pixi/docs/)


## Objective
  - Test PIXI power.

### Project structure

<pre>
pixi-ts-architecture/
│
├── src/
│   ├── main.ts                 [Main app instance]
│   ├── index.ts                [For docs gen also for npm publish]
│   ├── core/
│   │   ├── position.ts
│   │   ├── scene.ts
│   │   └── sceneManager.ts
│   │
│   ├── types/
│   │   ├── appDefinitions.ts
│   │   └── globalDefinitions.ts
│   │
│   ├── scenes/
│   │   └── MenuScene.ts
│   │   └── AceOfShadowsScene.ts
│   │   └── MagicWords.ts
│   │
│   ├── components/
│   │   └── card-stack.ts       [holder for cards]
│   │   └── card.ts             [card entity]
│   │   └── dialogBox.ts        [standalone popup with dragging&scroll]
│   │   └── phonenixFlame.ts
│   │
│   ├── utils/
│   │   └── utils.ts            [Small helpers funcs]
│   │
│   ├── shaders/ 
│   │   └── base.ts             [webGL/webGPU context]
│   │
│   ├── services/ 
│   │   └── helpers-methods.ts  [Common operations]
│   │
│   └── resources/
│       └── literals.ts         [Simple object/consts store place]
│       └── shaders.ts          [For webGL or webGPU context/job]
│       └── textures.ts         [Simple textures operation]
│
├── typedoc.json                [Api docs generator]
├── index.html                  [Main index.HTML]
├── tsconfig.json               [Ts config]
├── vite.config.ts              [Compiler stuff]
└── package.json                [Defines project metadata, dependencies...]
</pre>

Install deps:

```js
npm i
```

Run dev:

```js
npm run dev
```

Quick sanity check and generate API docs
Run:

```js
npx typedoc --logLevel Verbose
```

### About object/movement policy

- In aceOfShadowsScene Scene gsap lib is't used.
  I create class Position (Similar functionality with gsap)
- In MagicWords i use gsap.
- In PhoenixFlame scene i use `onResize` and make Phoenix always
  fit in middle of screen.

### Important notes about v8

In Pixi v8:

 - Application is async
 - app.view is gone
 - Canvas is created only after init()

More links for learning: 

 - https://pixijs.download/dev/docs/rendering.WebGPURenderer.html
