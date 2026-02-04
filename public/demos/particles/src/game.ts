
import { assetsHandler, BareGame, Color, mouseController, particleController, ParticleEmitter, ParticleShape, StartBare, Vec2 } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO SETUP PARTICLE EMITTERS, EITHER CONTINUES OR ONE SHOT
*/ 

export class GameParticles extends BareGame
{
    smokeEmitter: ParticleEmitter;
    explosionEmitter: ParticleEmitter;

    explosionTimer = 0;
    explosionInterval = .8;
    
    async OnStart()
    {
        var particleTexture = await assetsHandler.GetTexturePromise("starParticle");
        var stripeParticleTexture = await assetsHandler.GetTexturePromise("stripeParticle");

        // TODO: MAKE THIS ABLE TO LOAD A JSON STRING, GOTTA PORT COLOR AND VEC2
        this.smokeEmitter = new ParticleEmitter({
            position: new Vec2(0, 0),
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
                },
                acceleration: {
                    start: new Vec2(0, -200),
                    end: new Vec2(0, -300),
                },
            }
        });

        this.explosionEmitter = new ParticleEmitter({
            position: new Vec2(0, 0),
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
        
        particleController.Add(this.smokeEmitter, {autoStart: true}); // AUTO START MAKES IT BECOME A CONTINUOUS EMITTER
        particleController.Add(this.explosionEmitter); // ONE SHOT IS THE DEFAULT. ACTIVATED BELOW WITH oneShot()
    }

    OnUpdate(deltaTime: number): void
    {
        // LET THE SMOKE FOLLOW THE MOUSE
        this.smokeEmitter.position.set(mouseController.globalMousePosition.x, mouseController.globalMousePosition.y);
        
        // ONE SHOT THE EXPLOSION EVERY explosionInterval SECONDS
        this.explosionTimer += deltaTime;
        if (this.explosionTimer >= this.explosionInterval)
        {
            this.explosionEmitter.position.set(bare.width * Math.random(), bare.height * Math.random());
            this.explosionEmitter.oneShot();
            
            this.explosionTimer = 0;
        }
    }
}

StartBare(GameParticles);
