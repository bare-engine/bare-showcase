
import { Scene, Helper, hitboxController, StartBare, TweenTo, assetsHandler, soundHandler } from "bare-engine";

/*
    PLAY A SOUND, AT DIFFERENT RATES!
*/

export class DemoSound extends Scene
{
    async OnAwake(): Promise<void>
    {
        await assetsHandler.GetTexturePromise("🔊");
    }

    OnStart()
    {
        soundHandler.registerSound('click', 'bubble-pop.mp3');
        
        var obj = bare.AddGameObject('🔊')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot();

        hitboxController.AssignButton(obj, () => {
            var sound = soundHandler.playSound('click', {volume: 1});
            sound.rate(Helper.RandomRange(0.8, 1.2));
            
            obj.scale = 1;
            TweenTo(obj, .1, {scale: 1.2, yoyo: true});
        });
    }
}

//StartBare(DemoSound);