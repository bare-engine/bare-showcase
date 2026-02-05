
import { BareGame, events, SettingsData, assetsHandler, AnimationComponent, ComponentController, StartBare, BareClasses } from "bare-engine";

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
		  "frames": ["buffalo_eat_00","buffalo_eat_01","buffalo_eat_03","buffalo_eat_00","buffalo_eat_01","buffalo_eat_03","buffalo_eat_00","buffalo_eat_01","buffalo_eat_02"],
		  "framesPerSecond": 9,
		  "loop": false
	  }
    }
  }`;


export class GameAnimation extends BareGame
{
    constructor()
    {
        super(JSON.parse(data));
    }

    async OnAwake()
    {
        bare.textures.setAntialias(false); // DISABLE ANTIALIAS TO SHOW CRISP PIXEL ART

        await assetsHandler.LoadAtlas("texturePackImages");

    }
    
    OnStart()
    {
        this.AddGameObject('barn')
            .SetPosition(0, 110);

        var buffalo = this.AddGameObject('buffalo');
        var animComponent = buffalo.AddComponent(AnimationComponent);
        animComponent.Play('run');
        animComponent.OnComplete('eat', 'run');

        buffalo.SetScale(4);
        buffalo.SetPosition(100, 550);

        events.on('pointerDown', (info) => {
            if (info.isLeftButton)
                animComponent.Play('eat', () => trace('animation complete'))
        });
    }

    OnClear(): void
    {
        bare.textures.setAntialias(true); // REVERT ANTIALIAS BACK, JUST SO IT'S ENABLED FOR OTHER DEMOS
    }
}

StartBare(GameAnimation, {antiAlias: false});