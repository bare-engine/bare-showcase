import { BaseComponent, GameObject, TweenTo } from "bare-engine"

export class WaveComponent extends BaseComponent
{
    countDown:number = 0;
    frequency: number;

    constructor(frequency:number = 1)
    {
        super();
        
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
