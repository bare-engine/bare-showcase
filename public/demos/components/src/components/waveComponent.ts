import { Component, Easing, Scene, TweenTo, SerializeField } from "bare-engine";

export class WaveComponent extends Component
{
    countDown:number = 0;

    @SerializeField
    wavesPerSecond: number = 1;

    constructor(scene:Scene)
    {
        super(scene);
    }

    OnUpdate(deltaTime: number): void
    {
        if (this.wavesPerSecond <= 0)
            return;

        this.countDown -= deltaTime;

        if (this.countDown <= 0)
        {
            const interval = 1 / this.wavesPerSecond;
            const waveDuration = interval * .5;

            // WAVE
            this.go.rotation = 0;
            TweenTo(this.go, waveDuration, {rotation: 45, ease: Easing.Sinusoidal.InOut, yoyo: true, repeat: 1});
            
            this.countDown += interval;
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
