import entityDataJson from '../entityData.json' 

import { Scene, BareClasses, StartBare, CameraScaleMode, cameraHandler, mouseController, Helper, BareEvent } from "bare-engine";
import { Circle, Type } from "bare-engine/sopiroPhysics";

/*  
    THIS DEMO SHOWS A PHYSICS ENGINE CALLED SOPIRO IN ACTION
    IT SETS IT UP IN entityDataJson (CTRL-CLICK IT ABOVE TO OPEN IT)
    AND LOADS THE LEVEL SIMPLY CALLED 'level'

    VERTICLES MADE WITH HELP OF https://yandeu.github.io/physics-editor/
    CUSTOM IN-ENGINE TOOL IS PLANNED
*/

export class GameSopiroPhysics extends Scene
{
    constructor()
    {
        super({entityData: entityDataJson});
    }
    
    OnAwake()
    {
        bare.AddClass(BareClasses.PhysicsControllerSopiro);
    }
    
    async OnStart()
    {
        await this.LoadLevel('level');

        cameraHandler.SetDimensionsToLevel();
        cameraHandler.SetScaleMode(CameraScaleMode.Contain); 

        // EXAMPLE OF CREATING A RIGID BODY BY CODE
        // THIS WORKS SINCE CIRCLE EXTENDS RIGIDBODY WHICH EXTENDS GAMEOBJECT
        this.events.on(BareEvent.pointer_down, () => {
            var rigidBody = new Circle(36, Type.Dynamic);
            rigidBody.restitution = .8;
            rigidBody.mass = 2;
            bare.AddGameObject(rigidBody);

            rigidBody.InitTexture('⚽');
            rigidBody.SetPosition(mouseController.world.position.x, mouseController.world.position.y);
            rigidBody.SetVelocityXY(Helper.RandomRange(-100, 100), Helper.RandomRange(-100, 100));
        })
    }
}

//StartBare(GameSopiroPhysics);