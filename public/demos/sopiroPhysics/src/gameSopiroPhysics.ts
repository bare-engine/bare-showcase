import entityDataJson from '../entityData.json' 

import { BareGame, BareClasses, StartBare, levelController, CameraScaleMode, cameraHandler } from "bare-engine";
import { Circle, Type } from "bare-engine/sopiroPhysics";

/*  
    THIS DEMO SHOWS A PHYSICS ENGINE CALLED SOPIRO IN ACTION
    IT SETS IT UP IN entityDataJson (CTRL-CLICK IT ABOVE TO OPEN IT)
    AND LOADS THE LEVEL SIMPLY CALLED 'level'

    ATM YOU STILL HAVE TO DEFINE THE RECTS FOR THE OBJECTS
    EG: "physicsRect": {"width": 1024, "height": 64},

    VERTICLES MADE WITH HELP OF https://yandeu.github.io/physics-editor/
    CUSTOM IN-ENGINE TOOL IS PLANNED
*/

export class GameSopiroPhysics extends BareGame
{
    constructor()
    {
        super(entityDataJson);
    }
    
    OnAwake()
    {
        bare.AddClass(BareClasses.PhysicsControllerSopiro);
    }
    
    async OnStart()
    {
        await levelController.LoadLevel('level');

        cameraHandler.SetDimensionsToLevel();
        cameraHandler.SetScaleMode(CameraScaleMode.Contain); 

        // EXAMPLE OF CREATING A RIGID BODY BY CODE
        // THIS WORKS SINCE CIRCLE EXTENDS RIGIDBODY WHICH EXTENDS GAMEOBJECT
        var rigidBody = new Circle(36, Type.Dynamic);
        rigidBody.restitution = .8;
        rigidBody.mass = 2;
        bare.AddGameObject(rigidBody);

        rigidBody.InitTexture('⚽');
        rigidBody.SetPosition(levelController.currentLevel.dimensions.width * .5, 100);
        rigidBody.SetVelocityXY(110, 0);
    }
}

StartBare(GameSopiroPhysics);