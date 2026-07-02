import { Scene } from "bare-engine";
import { GhostShader } from "./ghostShader";

/*  
    HOW TO ATTACH A SHADER TO A GAME OBJECT
*/

export class DemoShaders extends Scene
{
    async OnAwake(): Promise<void>
    {
        await bare.asset.LoadTexture("👻");
    }

    OnStart()
    {
        // ADD THE GAME OBJECT
        var ghost = bScene.AddGameObject('👻')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot()
            .SetScale(2);

        // ADD THE SHADER
        ghost.AddShader(GhostShader);
    }
}
