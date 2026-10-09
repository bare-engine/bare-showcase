
import { Scene, GameObject } from "bare-engine";

/*  
    WE ADD A SIMPLE GAME OBJECT WITH NAME '⚙'
    IT WILL FIND ITS CORRESPONDING IMAGE AT 'public/demos/basics/images/' AND STREAM IT IN
*/

export class DemoBasics extends Scene
{
    cog!: GameObject;

    override OnStart()
    {
        // ADD A SIMPLE GAME OBJECT ⚙ 
        this.cog = bScene.AddGameObject('⚙')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot();
    }

    override OnUpdate(deltaTime: number): void
    {
        this.cog.rotation += 60 * deltaTime;
    }
}