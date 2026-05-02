
import { Scene, Color, GameObject, StartBare, TextTexture } from "bare-engine";

/*  
    THIS DEMO SHOWS THE POWER OF ENTITIES, A CONCEPT SOMEWHAT UNIQUE TO BARE 
    YOU CAN THINK OF THEM AS (UNITY) PREFABS, IN THAT GAMEOBJECTS CAN INHERIT DATA FROM THEM
    ENTITIES CAN ALSO INHERIT DATA FROM EACH OTHER, IF THEY EXTEND FROM EACH OTHER

    EXPLAINING THE ENTITY DATA BELOW:
    ANY: ANY GAMEOBJECT THAT DOES *NOT* EXTEND A CLASS ALREADY INHERITS THIS DATA
    🍐: THIS WILL INHERIT THE 'ANY' DATA
    🍌: THIS EXTENDS Fruit", THE FACT THAT THIS STARTS WITH A CAPITAL DENOTES THAT THIS IS A CLASS, 
         SO IT WILL *NOT* INHERIT THE 'ANY' DATA.
    🍎: THIS WILL INHERIT THE "bigAndNoRotation" DATA, WHICH INHERITS THE "big" DATA, WHICH IN TURN INHERITS THE 'ANY' DATA
         BUT AS DEFINED IN propertiesRemoved, IT WILL NOT INHERIT THE 'rotation' PROPERTY
*/

const data = ` {
    "baseEntities": {
        "ANY": {
            "pivot": {"x": 0.5, "y": 0.5}
        },
        "big": {
            "scale": 2,
            "pivot": {"x": 0, "y": 0},
            "rotation": 90
        },
        "bigAndNoRotation": {
            "baseEntity": "big",
            "propertiesRemoved": ["rotation"]
        }
    },
    "entities": {
        "🍐": {},
        "🍌": {
            "extendClass": "Fruit"
        },
        "🍎": {
            "baseEntity": "bigAndNoRotation"
        }
    }
  }`;

export class DemoEntities extends Scene
{
    constructor()
    {
        super(JSON.parse(data));
    }
    
    OnStart()
    {
        // HAVE TO REGISTER THIS MANUALLY FOR NOW, ALSO IMPORTS THE FRUIT CLASS BY REFERENCING IT
        bareEngine.RegisterGameObjectPool(Fruit, 20);

        bare.AddGameObject('🍐')
            .SetPosition(bare.width * .25, bare.height * .3);

        bare.AddGameObject('🍌')
            .SetPosition(bare.width * .5, bare.height * .4);

        bare.AddGameObject('🍎')
            .SetPosition(bare.width * .5, bare.height * .6);
    }
}

export class Fruit extends GameObject
{
    text: Text;

    OnAwake(): void
    {
        this.AddChild(new TextTexture(rapid, {
            text: "I'm a Fruit class",
            fontSize: 20,
            fontFamily: 'monospace'
        }));
    }
}

//StartBare(DemoEntities);