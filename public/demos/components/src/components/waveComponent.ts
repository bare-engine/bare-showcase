import { BaseComponent, GameObject, Scene, TweenTo } from "bare-engine"

export class WaveComponent extends BaseComponent
{
    countDown:number = 0;
    frequency: number;

    constructor(scene:Scene, frequency:number = 1)
    {
        super(scene);
        
        this.frequency = frequency;
    }

    Added(go: GameObject):void
    {
        super.Added(go);
    }

    OnUpdate(deltaTime: number): void
    {
        this.countDown -= deltaTime;

        if (this.countDown <= 0)
        {
            // WAVE
            TweenTo(this.go, .3, {rotation: 45, yoyo: true, repeat: 1});
            
            this.countDown = (2 * this.frequency);
        }
    }

    OnEnable(): void
    {

    }
    
    OnDisable(): void
    {
        
    }

    OnStart(): void
    {
        
    }
}
