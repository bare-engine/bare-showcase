
import { Scene, Vec2, BareEvent } from "bare-engine";
import { ArcadePhysicsController, ArcadeObject } from 'bare-engine/arcade';

/* 
    SIMPLE PHYSICS WITH RECTANGLES AND CIRCLES.
    STATIC AND DYNAMIC OBJECTS.
*/

export class DemoArcadePhysics extends Scene
{
    constructor()
    {
        super(JSON.parse(`{
            "baseEntities": [
                {
                    "name": "ANY",
                    "texture": "NAME",
                    "baseClass": "ArcadeObject",
                    "hitbox": "FULL",
                    "drag": 0.01,
                    "restitution": 0.8
                }
            ],
            "entities": [
                {
                    "name": "⚽",
                    "hitboxType": "Circle"
                },
                {
                    "name": "⏹",
                    "static": true
                }
            ],
            "layersInfo": {
                "Objects": {
                    "hasPhysics": true
                }
            }
        }`));
    }
        
    OnAwake()
    {
        bare.AddClass(ArcadePhysicsController);
    }

    OnStart()
    {
        bScene.AddGameObject('⏹')
            .SetPosition(bare.width * .5, bare.height * .2)
            .CenterPivot();

        bScene.AddGameObject('⏺')
            .SetPosition(bare.width * .5, bare.height * .7)
            .CenterPivot();

        bScene.AddGameObject('⏺')
            .SetPosition(bare.width * .3, bare.height * .9)
            .CenterPivot();

        bScene.AddGameObject('⏹')
            .SetPosition(bare.width * .7, bare.height * .9)
            .CenterPivot();

        bScene.AddGameObject('⚽')
            .SetPosition(bare.width * .25, bare.height * .5)
            .CenterPivot();
            
        bScene.AddGameObject('⚽')
            .SetPosition(bare.width * .75, bare.height * .5)
            .CenterPivot();

        var ball = bScene.AddGameObject('⚽')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot() as ArcadeObject;
        ball.SetVelocityXY(546, 546);

        this.events.on(BareEvent.pointer_down, (info) => {
            var vel = new Vec2(info.mouseX, info.mouseY)
                .subtract(ball.position)
                .multiply(6);
            ball.SetVelocity(vel);
        });
    }
}
