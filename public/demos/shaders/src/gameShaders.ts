import { Scene, StartBare } from "bare-engine";
import { GhostShader } from "./ghostShader";

/*  
    HOW TO ATTACH A SHADER TO A GAME OBJECT
*/

export class GameShaders extends Scene
{
    OnStart()
    {
        var ghost = bare.AddGameObject('👻')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot()
            .SetScale(2);

        // ADD THE SHADER
        var ghostShader = new GhostShader();
        ghost.AddShader(ghostShader);
    }
}

//StartBare(GameShaders);