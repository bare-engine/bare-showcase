import { Component, InspectorField, Scene, TweenTo } from "bare-engine";

export class WaveComponent extends Component
{
    countDown:number = 0;

    @InspectorField
    interval: number;

    constructor(scene:Scene)
    {
        super(scene);
    }

    OnUpdate(deltaTime: number): void
    {
        this.countDown -= deltaTime;

        if (this.countDown <= 0)
        {
            // WAVE
            this.go.rotation = 0;
            TweenTo(this.go, .3, {rotation: 45, yoyo: true, repeat: 1});
            
            this.countDown += this.interval;
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
