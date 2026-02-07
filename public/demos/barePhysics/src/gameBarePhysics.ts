
import { BareGame, BareClasses, events, Vec2, StartBare, BareEvent } from "bare-engine";
import { PhysicsObjectBare  } from 'bare-engine/barePhysics';

/* 
    SIMPLE PHYSICS WITH RECTANGLES AND CIRCLES.
    STATIC AND DYNAMIC.

    SOMEHWAT WONKY STILL
*/

export class GameBarePhysics extends BareGame
{
    constructor()
    {
        super(JSON.parse(`{
            "entityBases": {
                "ANY": {
                    "extendClass": "PhysicsObjectBare",
                    "hitbox": "FULL",
                    "drag": 0.01
                }
            },
            "entities": {
                "⚽": {
                    "hitboxType": "circle"
                },
                "⏹": {
                    "isStatic": true
                }
            },
            "layersInfo": {
                "Objects": {
                    "hasPhysics": true
                }
            }
        }`));
    }
        
    OnAwake()
    {
        bare.AddClass(BareClasses.PhysicsControllerBare);
    }

    OnStart()
    {
        bare.AddGameObject('⏹')
            .SetPosition(bare.width * .5, bare.height * .2)
            .CenterPivot();

        bare.AddGameObject('⏺')
            .SetPosition(bare.width * .5, bare.height * .7)
            .CenterPivot();

        bare.AddGameObject('⏺')
            .SetPosition(bare.width * .3, bare.height * .9)
            .CenterPivot();

        bare.AddGameObject('⏹')
            .SetPosition(bare.width * .7, bare.height * .9)
            .CenterPivot();

        bare.AddGameObject('⚽')
            .SetPosition(bare.width * .25, bare.height * .5)
            .CenterPivot();
            
        bare.AddGameObject('⚽')
            .SetPosition(bare.width * .75, bare.height * .5)
            .CenterPivot();

        var ball = bare.AddGameObject('⚽')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot() as PhysicsObjectBare;
        ball.SetVelocityXY(546, 546);

        events.on(BareEvent.pointer_down, (info) => {
            var vel = new Vec2(info.mouseX, info.mouseY).subtract(ball.position);
            vel = vel.multiply(6);
            ball.SetVelocity(vel);
        });
    }
}

StartBare(GameBarePhysics);