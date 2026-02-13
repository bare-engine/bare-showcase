
import { assetsHandler, Scene, BareScreen, GameObject, sceneController, BareEvent, StartBare, Text, Vec2 } from "bare-engine";

/*
    THIS DEMO SHOWS HOW TO SETUP SCREENS AND SWITCH BETWEEN THEM
    EVERYTHING IN A SCREEN WILL GET CLEARED WHEN SWITCHING
*/

// MAIN GAME
export class GameScreens extends Scene
{
    clearFunction: () => void;

    OnStart(): void
    {
        var currentScreenIndex = 0;
        var screens = [MenuScreen, GameScreen, EndScreen];

        // LISTEN WITH PERSISTENT EVENT TO POINTER DOWN, BECAUSE NORMAL EVENTS GET CLEARED WHEN SWITCHING SCREENS
        var pointerDown = () => {
            currentScreenIndex = (currentScreenIndex + 1) % screens.length;
            sceneController.Goto(screens[currentScreenIndex]);
        };
        this.events.persistent.on(BareEvent.pointer_down, pointerDown);

        // SINCE POINTER DOWN EVENT IS PERSISTENT, WE NEED TO CLEAR IT LATER - JUST BECAUSE WE'RE SWITHING DEMOS
        this.clearFunction = () => {
            this.events.persistent.off(BareEvent.pointer_down, pointerDown);
        }

        sceneController.Goto(screens[0]);
    }

    Clear(full?: boolean)
    {
        super.Clear(full);
        this.clearFunction();
    }
}

// MENU SCREEN
class MenuScreen extends Scene
{
    OnRender()
    {
        var text = new Text({text: "Menu Screen", fontSize: 40, fontFamily: 'monospace'});
        bare.renderSprite({texture: text, position: new Vec2(bare.width * .5, bare.height * .25), origin: new Vec2(.5, .5)});

        var text = new Text({text: "Play", fontSize: 50, fontFamily: 'monospace'});
        bare.renderSprite({texture: text, position: new Vec2(bare.width * .5, bare.height * .5), origin: new Vec2(.5, .5),
            scale: 1.1 + Math.sin(bare.time * .01) * .1});
    }
}

// GAME SCREEN
class GameScreen extends Scene
{
    controllerEmojiObj: GameObject;
    
    async OnAwake()
    {
        await assetsHandler.GetTexturePromise('🎮');
    }

    OnStart(): void
    {
        this.controllerEmojiObj = bare.AddGameObject('🎮').CenterPivot();
    }

    OnUpdate(dt: number): void
    {
        this.controllerEmojiObj.SetPosition(bare.width * .5 + Math.sin(bare.time * .01) * 7, 
                                            bare.height * .5 + Math.sin(bare.time * .02) * 5);
    }

    OnRender()
    {
        var text = new Text({text: "Game Screen", fontSize: 40, fontFamily: 'monospace'});
        bare.renderSprite({texture: text, position: new Vec2(bare.width * .5, bare.height * .25), origin: new Vec2(.5, .5)});
    }

    OnDestroy(): void
    {
        // ALL OBJECTS, INCLUDING controllerEmojiObj, AUTOMATICALLY GET REMOVED
    }
}

// END SCREEN
class EndScreen extends Scene
{
    OnRender()
    {
        var text = new Text({text: "End Screen", fontSize: 40, fontFamily: 'monospace'});
        bare.renderSprite({texture: text, position: new Vec2(bare.width * .5, bare.height * .25), origin: new Vec2(.5, .5)});

        var text = new Text({text: "You Won!", fontSize: 50, fontFamily: 'monospace'});
        bare.renderSprite({texture: text, position: new Vec2(bare.width * .5, bare.height * .5), origin: new Vec2(.5, .5)});
    }
}

//StartBare(GameScreens);