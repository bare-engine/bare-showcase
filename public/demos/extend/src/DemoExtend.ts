
import { Scene, TextTexture, Component, GameObject, SaveData, SaveDataHandler, TweenTo, StartBare, Vec2 } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO EXTEND ALL THE EXTENDABLE DATA STRUCTURES IN BARE
*/

// SETTING UP THE ENTITY DATA WITH SOME UNIQUE PROPERTIES: pop, isHappy, EmojiObject
const data = ` {
    "baseEntities": {
        "ANY": {
            "pivot": {"x": 0.5, "y": 0.5},
            "components": {
                "pop": {}
            }
        }
    },
    "entities": {
        "😃": {
            "isHappy": true
        },
        "🙁": {
            "baseClass": "EmojiObject",
            "isHappy": false
        }
    }
}`;

declare module "bare-engine"
{
    // EXTENDING THE COMPONENT INTERFACE WITH A METHOD
    // SO THAT CallMethodOnAllComponents('Pop'); WORKS
    interface Component 
    {
        Pop?(): void
    }

    // ADDING A NEW ENTITY PROPERTY
    interface Entity
    {
        isHappy?: boolean
    }

    // ADDING A NEW EVENT
    interface BareUserEvents
    {
        popped: { gameObject: GameObject };
    }
    
    // ADDING A NEW SAVE-DATA PROPERTY
    namespace SaveData
    {
        let happyEmojisClicked: int;
    }
}

// SETTING THE DEFAULT VALUE FOR THE NEWLY ADDED SAVE DATA PROPERTY
SaveDataHandler.SetDefaults({
    happyEmojisClicked: 0
});

// EXTENDING A GAMEOBJECT
export class EmojiObject extends GameObject
{
    isHappy: boolean = false;
}

// EXTENDING A COMPONENT
export class PopComponent extends Component
{
    Pop()
    {
        this.go.scale = 1;
        TweenTo(this.go, .3, {scale: 1.2, yoyo: true});
    }
}

// FINALLY! STARTING THE DEMO

export class DemoExtend extends Scene
{
    constructor()
    {
        super(JSON.parse(data));
    }
        
    async OnAwake(): Promise<void>
    {
        // EMOJIOBJECT AND POPCOMPONENT ARE DESCRIBED IN ENTITY DATA ABOVE
        // SO THESE NEED TO BE REGISTERED HERE (CLASS NEEDS TO EXIST IN CODE), 
        // SO THE ENGINE CAN CREATE THEM
        bare.AddClass(EmojiObject);
        bare.AddClass(PopComponent);

        await bare.asset.GetTexturePromise("😃");
        await bare.asset.GetTexturePromise("🙁");
    }

    OnStart()
    {
        SaveDataHandler.Load();

        trace('happy emojis clicked:', SaveData.happyEmojisClicked);

        // CREATING THE GAME OBJECTS
        var emojiSad = bScene.AddGameObject('🙁')
            .SetPosition(bare.width * .5, bare.height * .4)
        
        var emojiHappy = bScene.AddGameObject('😃')
            .SetPosition(bare.width * .5, bare.height * .6)

        // ASSIGNING BUTTONS TO SEND OUT A CUSTOM EVENT
        var pressedEmoji = (go: GameObject) => {
            this.events.emit('popped', {gameObject: go});
        }
        bare.hitbox.AssignButton(emojiSad, {OnPress: pressedEmoji});
        bare.hitbox.AssignButton(emojiHappy, {OnPress: pressedEmoji});
        
        // WHAT SHOULD HAPPEN WHEN THE CUSTOM EVENT IS EMITTED
        this.events.on('popped', ({gameObject}) => {
            bare.component.CallMethodOnAllComponents('Pop');

            var isHappy = gameObject.entity!.isHappy;

            if (gameObject instanceof EmojiObject)
                isHappy = gameObject.isHappy; // ALSO WORKS

            trace('happy', isHappy);

            if (isHappy)
            {
                // NOTIFY THAT WE CLICKED A HAPPY EMOJI
                SaveData.happyEmojisClicked++;
                SaveDataHandler.Save();
                
                trace('happy emojis clicked:', SaveData.happyEmojisClicked);
            }
        });
    }

    OnRender()
    {
        var text = new TextTexture(rapid, {text: `Happy Emojis Clicked: ${SaveData.happyEmojisClicked}`, fontSize: 32, fontFamily: 'monospace'});
        
        bare.drawSprite({
            texture: text,
            position: new Vec2(bare.width * .5, 170),
            origin: new Vec2(.5, .5),
        });

        //bare.renderSprite({texture: text, position: new Vec2(bare.width * .5, 170), origin: new Vec2(.5, .5)});
    }
}

//StartBare(DemoExtend);
