import * as PIXI from 'pixi.js';

export function createGlowFilter(): PIXI.Filter {
  // Your working vertex shader
  const vertDefault = `
    in vec2 aPosition;
    out vec2 vTextureCoord;

    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;
    uniform vec4 uOutputTexture;

    vec4 filterVertexPosition( void ) {
        vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
        position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
        position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
        return vec4(position, 0.0, 1.0);
    }

    vec2 filterTextureCoord( void ) {
        return aPosition * (uOutputFrame.zw * uInputSize.zw);
    }

    void main(void) {
        gl_Position = filterVertexPosition();
        vTextureCoord = filterTextureCoord();
    }
  `;

  // Improved Fragment: Added uColor and alpha safety
  const gpuFragment = `
in vec2 vTextureCoord;
in vec4 vColor;

uniform sampler2D uTexture;
uniform float uTime;

void main(void)
{
    vec2 uvs = vTextureCoord.xy;
    vec4 fg = texture2D(uTexture, vTextureCoord);
    // fg.r = uvs.y + sin(uTime) -0.5;
    fg.b = uvs.y + sin(uTime) -0.5;
    gl_FragColor = fg;
}
  `;

  const timeUniforms = new PIXI.UniformGroup({
    uTime: { value: 0, type: 'f32' },
    uColor: { value: [0, 0, 0], type: 'vec3<f32>' },
  }, { isStatic: false });

  return new PIXI.Filter({
    glProgram: PIXI.GlProgram.from({
      fragment: gpuFragment,
      vertex: vertDefault
    }),
    resources: {
      timeUniforms: timeUniforms
    },
  });
}