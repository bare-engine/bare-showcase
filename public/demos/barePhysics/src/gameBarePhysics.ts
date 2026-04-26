
import { Scene, BareClasses, Vec2, StartBare, BareEvent, PhysicsObjectBare } from "bare-engine";

/* 
    SIMPLE PHYSICS WITH RECTANGLES AND CIRCLES.
    STATIC AND DYNAMIC.

    SOMEHWAT WONKY STILL
*/

export class GameBarePhysics extends Scene
{
    constructor()
    {
        super(JSON.parse(`{
            "baseEntities": {
                "ANY": {
                    "hitbox": "FULL",
                    "drag": 0.01,
                    "restitution": 0.8
                }
            },
            "entities": {
                "⚽": {
                    "hitboxType": "circle"
                },
                "⏹": {
                    "static": true
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

        this.events.on(BareEvent.pointer_down, (info) => {
            var vel = new Vec2(info.mouseX, info.mouseY)
                .subtract(ball.position)
                .multiply(6);
            ball.SetVelocity(vel);
        });
    }
}

//StartBare(GameBarePhysics);