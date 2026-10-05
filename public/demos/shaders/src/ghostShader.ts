import { Shader } from "bare-engine";

export class GhostShader extends Shader
{
    startTime: number;

    constructor()
    {
        const wobbleVertex = `
            uniform mediump float uTime;
            uniform float uWobble;

            void vertex(inout vec4 position, vec2 uv) {
                position.x += sin(uv.y * 18.0 + uTime * 3.0) * uWobble;
            }
        `;

        const wobbleFragment = `
            uniform mediump float uTime;

            void fragment(inout vec4 color, vec2 vRegion) {
                float flash = 0.5 + 0.5 * sin(uTime * 4.0);
                color.rgb = mix(color.rgb, vec3(color.a), flash * 0.6); // PREMULTIPLIED WHITE
            }
        `;

        super(wobbleVertex, wobbleFragment);

        const wobble = 7;

        this.SetUniforms({ uTime: 0, uWobble: wobble });

        // THE SHADER RENDERS INTO A TEXTURE THE SIZE OF THE SPRITE - PAD IT SO THE WOBBLE FITS
        this.SetPadding(wobble);

        this.startTime = Date.now();
    }

    Update()
    {
        const currentTime = (Date.now() - this.startTime) * 0.001;
        this.SetUniforms({ uTime: currentTime });
    }
}
