
import { Scene, Helper, TweenTo } from "bare-engine";

/*
    PLAY A SOUND, AT DIFFERENT RATES!
*/

export class DemoSound extends Scene
{
    override async OnAwake(): Promise<void>
    {
        await bare.asset.LoadTexture("🔊");
    }

    override OnStart()
    {
        bare.sound.Register('click', 'bubble-pop.mp3');
        
        var obj = bScene.AddGameObject('🔊')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot();

        bare.hitbox.AssignButton(obj, () => {
            bare.sound.PlayWithRandomRate('click');
            
            obj.scale = 1;
            TweenTo(obj, .1, {scale: 1.2, yoyo: true});
        });
    }
}
