
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
        soundHandler.Register('click', 'bubble-pop.mp3');
        
        var obj = bScene.AddGameObject('🔊')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot();

        hitboxController.AssignButton(obj, () => {
            soundHandler.Play('click', {volume: 1, rate: Helper.RandomRange(0.8, 1.2)});
            
            obj.scale = 1;
            TweenTo(obj, .1, {scale: 1.2, yoyo: true});
        });
    }
}

//StartBare(DemoSound);