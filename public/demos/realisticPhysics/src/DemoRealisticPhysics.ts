import settingsDataJson from '../data/settingsData.json' 

import { Scene, CameraScaleMode, Helper, BareEvent, LevelData } from "bare-engine";
import { SopiroPhysicsController, Circle, Type } from 'bare-engine/sopiro';

/*  
    THIS DEMO SHOWS A PHYSICS ENGINE CALLED SOPIRO IN ACTION
    IT SETS IT UP IN settingsDataJson (CTRL-CLICK IT ABOVE TO OPEN IT)
    AND LOADS THE LEVEL SIMPLY CALLED 'level'

    VERTICLES MADE WITH HELP OF https://yandeu.github.io/physics-editor/
    CUSTOM IN-ENGINE TOOL IS PLANNED
*/

export class DemoRealisticPhysics extends Scene
{
    constructor()
    {
        super({settingsData: settingsDataJson});
    }
    
    OnAwake()
    {
        bare.AddClass(SopiroPhysicsController);
    }
    
    async OnStart()
    {
        await this.LoadLevel('level');

        // EXAMPLE OF CREATING A RIGID BODY BY CODE
        // THIS WORKS SINCE CIRCLE EXTENDS RIGIDBODY WHICH EXTENDS GAMEOBJECT
        this.events.on(BareEvent.pointer_down, () => {
            var circleRb = new Circle(this, 36, Type.Dynamic);
            circleRb.restitution = .8;
            circleRb.mass = 2;
            bScene.AddGameObject(circleRb);

            circleRb.InitTexture('⚽');
            circleRb.CenterPivot();
            circleRb.SetPosition(bare.mouse.world.position.x, bare.mouse.world.position.y);
            circleRb.SetVelocityXY(Helper.RandomRange(-100, 100), Helper.RandomRange(-100, 100));
        })
    }

    OnPostLoadLevel(level: LevelData, persistenObjUIDs?: string[]): void
    {
        bare.camera.SetDimensionsToLevel();
        bare.camera.SetScaleMode(CameraScaleMode.Contain);
    }
}
