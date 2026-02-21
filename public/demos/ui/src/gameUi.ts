
import { BareText, GameObject, Scene } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO SETUP UI
    WITH bare.AddGameObject(text, UILayer.UI); AN OBJECT CAN BE ADDED TO THE UI
*/

export class GameUi extends Scene
{
    constructor()
    {
        super({ UI: true });
    }

    OnStart()
    {
        this.CreateText('Resize me')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot();

        this.CreateText('Left')
            .SetPosition(0, bare.height * .5)
            .SetPivot(0, .5);

        this.CreateText('Right')
            .SetPosition(bare.width, bare.height * .5)
            .SetPivot(1, .5);

        this.CreateText('Top')
            .SetPosition(bare.width * .5, 0)
            .SetPivot(.5, 0);

        this.CreateText('Bottom')
            .SetPosition(bare.width * .5, bare.height)
            .SetPivot(.5, 1);
    }

    CreateText(textStr: string): GameObject
    {
        var text = new BareText({
            text: textStr,
            fontSize: 20,
            fontFamily: 'monospace',
        });
        var textObj = bare.AddGameObject(text);

        return textObj;
    }
}

//StartBare(GameUi);