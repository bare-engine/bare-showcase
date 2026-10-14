
import { Scene, Color, GameObject, TextTexture } from "bare-engine";

/*  
    THIS DEMO SHOWS THE POWER OF PREFABS
    LIKE (UNITY) PREFABS, GAMEOBJECTS CAN INHERIT DATA FROM THEM
    PREFABS CAN ALSO INHERIT DATA FROM EACH OTHER, THROUGH "extends"

    EXPLAINING THE PREFAB DATA BELOW:
    ANY: ANY GAMEOBJECT THAT DOES *NOT* EXTEND A CLASS ALREADY INHERITS THIS DATA
    🍐: THIS WILL INHERIT THE 'ANY' DATA
    🍌: THIS EXTENDS Fruit", THE FACT THAT THIS STARTS WITH A CAPITAL DENOTES THAT THIS IS A CLASS, 
         SO IT WILL *NOT* INHERIT THE 'ANY' DATA.
    🍎: THIS WILL INHERIT THE "bigAndNoRotation" DATA, WHICH INHERITS THE "big" DATA, WHICH IN TURN INHERITS THE 'ANY' DATA
         BUT AS DEFINED IN propertiesRemoved, IT WILL NOT INHERIT THE 'rotation' PROPERTY
*/

const data = `
{
    "basePrefabs": [
        {
            "name": "ANY",
            "texture": "NAME",
            "pivot": {
                "x": 0.5,
                "y": 0.5
            }
        },
        {
            "name": "big",
            "scale": 2,
            "pivot": {
                "x": 0,
                "y": 0
            },
            "rotation": 90
        },
        {
            "name": "bigAndNoRotation",
            "extends": "big",
            "propertiesRemoved": [
                "rotation"
            ]
        }
    ],
    "prefabs": [
        {
            "name": "🍐"
        },
        {
            "name": "🍌",
            "baseClass": "Fruit"
        },
        {
            "name": "🍎",
            "extends": "bigAndNoRotation"
        }
    ]
}
`;

export class DemoPrefabs extends Scene
{
    constructor()
    {
        super({settingsData: JSON.parse(data)});
    }
    
    override OnStart()
    {
        // HAVE TO REGISTER THIS MANUALLY FOR NOW, ALSO IMPORTS THE FRUIT CLASS BY REFERENCING IT
        bare.RegisterGameObjectPool(Fruit, 20);

        bScene.AddGameObject('🍐')
            .SetPosition(bare.width * .25, bare.height * .3);

        bScene.AddGameObject('🍌')
            .SetPosition(bare.width * .5, bare.height * .4);

        bScene.AddGameObject('🍎')
            .SetPosition(bare.width * .5, bare.height * .6);
    }
}

export class Fruit extends GameObject
{
    text!: Text;

    override OnAwake(): void
    {
        this.AddChild(new TextTexture(rapid, {
            text: "I'm a Fruit class instance",
            fontSize: 20,
            fontFamily: 'monospace'
        }));
    }
}
