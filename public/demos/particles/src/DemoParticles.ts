
import { Scene, Color, ParticleEmitter, ParticleController, ParticleShape, Vec2 } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO SETUP PARTICLE EMITTERS, EITHER CONTINUES OR ONE SHOT
*/ 

export class DemoParticles extends Scene
{
    smokeEmitter!: ParticleEmitter;
    explosionEmitter!: ParticleEmitter;

    explosionTimer = 0;
    explosionInterval = .8;
    
    override async OnStart()
    {
        var particleTexture = await bare.asset.LoadTexture("starParticle");
        var stripeParticleTexture = await bare.asset.LoadTexture("stripeParticle");

        // TODO: MAKE THIS ABLE TO LOAD A JSON STRING, GOTTA PORT COLOR AND VEC2
        this.smokeEmitter = new ParticleEmitter(rapid, {
            life: 1.2,
            texture: particleTexture,
            origin: new Vec2(0.5, 0.5),
            emitRate: 200,
            localSpace: false,
            emitShape: ParticleShape.CIRCLE,
            emitRadius: 30,
            animation: {
                scale: {
                    start: 1,
                    end: 0.1,
                },
                rotation: {
                    start: 0,
                    end: Math.PI * 2,
                },
                color: {
                    start: Color.fromHex("#9898987d"),
                    end: Color.fromHex("#ffffff00"),
                },
                velocity: {
                    start: new Vec2(30, 0),
                    delta: new Vec2(0, -250)// Use delta instead of acceleration
                },
                // acceleration: {
                //     start: new Vec2(0, -200),
                //     end: new Vec2(0, -300),
                // },
            }
        });

        this.explosionEmitter = new ParticleEmitter(rapid, {
            life: .8,
            texture: stripeParticleTexture,
            origin: new Vec2(0.5, 0.5),
            emitRate: 20,
            localSpace: false,
            emitShape: ParticleShape.CIRCLE,
            emitRadius: 10,
            animation: {
                scale: {
                    start: 1,
                    end: 0.2,
                },
                rotation: {
                    start: [0, Math.PI * 2],
                },
                color: {
                    start: Color.fromHex("#ff0000ff"),
                    end: Color.fromHex("#ffff00ff")
                },
                speed: {
                    start: [300, 400],
                },
            }
        });
        
        bare.particle.Add(this.explosionEmitter); // ONE SHOT IS THE DEFAULT. ACTIVATED BELOW WITH OneShot()
        bare.particle.Add(this.smokeEmitter, {autoStart: true}); // AUTO START MAKES IT BECOME A CONTINUOUS EMITTER
    }

    override OnUpdate(deltaTime: number): void
    {
        // LET THE SMOKE FOLLOW THE MOUSE
        ParticleController.SetPosition(this.smokeEmitter, bare.mouse.screen.position.x, bare.mouse.screen.position.y);
        
        // ONE SHOT THE EXPLOSION EVERY explosionInterval SECONDS
        this.explosionTimer += deltaTime;
        if (this.explosionTimer >= this.explosionInterval)
        {
            bare.particle.OneShot(this.explosionEmitter, { position: new Vec2(bare.width * Math.random(), bare.height * Math.random()) });
            
            this.explosionTimer = 0;
        }
    }
}
