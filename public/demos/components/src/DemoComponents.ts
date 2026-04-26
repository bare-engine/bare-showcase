
import { Scene, componentController, StartBare } from "bare-engine";
import { WaveComponent } from "./components/waveComponent";

/*  
    THIS DEMO SHOWS COMPONENTS IN ACTION
    A COMPONENT CAN HAVE CUSTOM PROPERTIES WHICH CAN BE CHANGED ON RUNTIME AS WELL
    FUN FACT: THESE PROPERTIES ALSO GET SAVED (HAVE NO DEMO FOR THAT YET)
*/

const data = ` {
    "entities": {
        "👋": {
            "components": {
                "wave": {"frequency": 1}
            }
        }
    }
  }`;

export class DemoComponents extends Scene
{
    constructor()
    {
        super(JSON.parse(data));
    }
    
    OnAwake(): void
    {
        this.AddClass(WaveComponent);
    }

    OnStart()
    {
        // ADD A GAME OBJECT 👋 - IT WILL INSTANTIATE WITH WAVE COMPONENT BASED ON DATA ABOVE
        bare.AddGameObject('👋')
            .SetPosition(bare.width * .5, bare.height * .4)
            .SetPivot(88, 94);

        // SAME HERE, BUT WE CHANGE THE FREQUENCY
        var obj = bare.AddGameObject('👋')
            .SetPosition(bare.width * .5, bare.height * .75)
            .SetPivot(88, 94)

        componentController.GetComponent(obj, WaveComponent)!.frequency = 2;
    }
}

//StartBare(DemoComponents);