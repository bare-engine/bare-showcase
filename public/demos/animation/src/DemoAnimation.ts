
import { AnimationComponent, Scene, StartBare, assetsHandler, BareEvent, TextureFilterMode } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO LOAD AND PLAY AN ANIMATION
    
    ANIMATION SEQUENCES ARE DEFINED EITHER IN THE JSON ATLAS FILE OR IN THE ENTITY SETTINGS

    E.G:
    "buffalo_run" IS DEFINED IN ATLAS (IT AUTOMATICALLY PICKS UP ON THE NUMBERS AT THE END).
    "buffalo_eat" IS REDEFINED IN THE ENTITY SETTINGS BELOW
*/

const data = ` {
    "animations": {
        "buffalo_run": {
            "framesPerSecond": 9
        },
        "buffalo_eat": {
            "frames": ["buffalo_eat_00#01+03+00#01+03+00#02"], 
            "framesPerSecond": 9,
            "loop": false
        }
    }
}`;

export class DemoAnimation extends Scene
{
    constructor()
    {
        super(JSON.parse(data));
    }

    async OnAwake()
    {
        rapid.setTextureFilter(TextureFilterMode.NEAREST); // SET TO NEAREST TO SHOW CRISP PIXEL ART

        await assetsHandler.LoadAtlas("texturePackImages");
    }
    
    OnStart()
    {
        var buffalo = this.AddGameObject('-buffalo');
        var animComponent = buffalo.AddComponent(AnimationComponent);
        animComponent.Play('run');
        animComponent.OnComplete('eat', 'run');

        buffalo.SetScale(4);
        buffalo.SetPosition(100, 550);
        
        this.events.on(BareEvent.pointer_down, (info) => {
            if (info.isLeftButton)
                animComponent.Play('eat', () => trace('animation complete'))
        });
        
        this.AddGameObject('barn')
            .SetPosition(0, 110);
    }

    OnClear(): void
    {
        rapid.setTextureFilter(TextureFilterMode.LINEAR); // REVERT TO LINEAR, JUST SO IT'S ENABLED FOR OTHER DEMOS AGAIN
    }
}

//StartBare(DemoAnimation, {antiAlias: false});