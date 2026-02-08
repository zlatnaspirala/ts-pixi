
## PIXI-TS

## Objective
  Test PIXI power

### Project structure

<pre>
pixi-ts-architecture/
│
├── src/
│   ├── main.ts
│   ├── core/
│   │   ├── Scene.ts
│   │   └── SceneManager.ts
│   │
│   ├── scenes/
│   │   └── MenuScene.ts
│   │   └── AceOfShadowsScene.ts
│   │   └── MagicWords.ts
│   │
│   ├── components/
│   └── utils/
│       └── utils.ts
│
├── index.html
├── tsconfig.json
├── vite.config.ts
└── package.json
</pre>


Install deps:
```
npm i
```

Run dev:
```
npm run dev
```


### About object/movement policy

- In aceOfShadowsScene Scene idont use gsap lib.
  I create class Position (Similar functionality with gsap)
- In Magic Words i use gsap.


### Important notes about v8

- In Pixi v8:
  Application is async
  app.view is gone
  Canvas is created only after init()
