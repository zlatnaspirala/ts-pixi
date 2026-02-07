export const fragBase = `
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float time;

void main() {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.r += sin(time + vTextureCoord.x * 10.0) * 0.1;
    gl_FragColor = color;
}
`;