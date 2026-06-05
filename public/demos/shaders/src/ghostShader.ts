import { Shader } from "bare-engine";

export class GhostShader extends Shader
{
    startTime: number;

    constructor()
    {
        const ghostVertexShaderSource = `
            uniform float uTime;
            uniform float uWobbleStrength;
            uniform float uWobbleSpeed;

            void vertex(inout vec4 position, inout vec2 region) {
                float wobbleX = sin(uTime * uWobbleSpeed + position.y * 0.01) * uWobbleStrength;
                float wobbleY = cos(uTime * uWobbleSpeed * 0.7 + position.x * 0.008) * uWobbleStrength * 0.5;
                
                position.x += wobbleX;
                position.y += wobbleY;
            }
        `;

        const ghostFragmentShaderSource = `
            uniform float uTime;
            uniform float uGhostAlpha;
            uniform float uPulseSpeed;
            uniform vec3 uGhostTint;
            uniform float uEdgeFade;

            void fragment(inout vec4 color) {
                if(color.a < 0.1) return;
                
                float pulse = 0.5 + 0.3 * sin(uTime * uPulseSpeed);
                
                float distanceFromCenter = length(vRegion - vec2(0.5, 0.5));
                float glow = 1.0 - smoothstep(0.0, uEdgeFade, distanceFromCenter);
                
                vec3 ghostColor = mix(color.rgb, uGhostTint, 0.6);
                float finalAlpha = color.a * uGhostAlpha * pulse * glow;
                
                float shimmer = 0.5 + 0.5 * sin(uTime * 3.0 + gl_FragCoord.x * 0.1 + gl_FragCoord.y * 0.08);
                ghostColor = mix(ghostColor, vec3(1.0), shimmer * 0.1);

                color = vec4(ghostColor * finalAlpha, finalAlpha);
            }
        `;

        super(ghostVertexShaderSource, ghostFragmentShaderSource);

        this.SetUniforms({
            uTime: 0.0,
            uWobbleStrength: 10.0,
            uWobbleSpeed: 5.0,
            uGhostAlpha: 0.7,
            uPulseSpeed: 21.5,
            uGhostTint: [0.9, 0.95, 1.0],
            uEdgeFade: 0.8
        });

        this.startTime = Date.now();
    }

    Update()
    {
        const currentTime = (Date.now() - this.startTime) * 0.001;
        this.SetUniforms({ uTime: currentTime });
    }
}
