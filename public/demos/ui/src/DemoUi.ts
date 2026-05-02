
import { GameObject, Scene, TextObject } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO SETUP UI
    WITH super({ UI: true });
*/

export class DemoUi extends Scene
{
    constructor()
    {
        super({ UI: true, resize: true });
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

    CreateText(textStr: string): TextObject
    {
        var textObj = new TextObject(this, {
            text: textStr,
            fontSize: 20,
            fontFamily: 'monospace',
        });
        bare.AddGameObject(textObj);

        return textObj;
    }
}

//StartBare(DemoUi);
