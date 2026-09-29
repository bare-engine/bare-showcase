/*  
    HERE WE SETUP THE GAME AND MANAGE THE DEMOS
    EACH DEMO IS A Scene ON ITS OWN, WHICH MAKES IT EASY TO EXTRACT THE CODE 
    AND MOVE IT TO THE BARE TEMPLATE FOR EXAMPLE
*/

export class MainGame extends Scene
{
    private demos = [
        DemoBasics,
        DemoImageLoading,
        DemoAnimation,
        DemoRenderTexture,
        DemoGraphics,
        DemoParticles,
        DemoShaders,
        DemoTweens,
        DemoPrefabs,
        DemoComponents,
        DemoExtend,
        DemoLevel,
        DemoEditorComponents,
        DemoArcadePhysics,
        DemoRealisticPhysics,
        DemoSound,
        DemoCamera,
        DemoECS,
        DemoUi,
    ];

    private demoIndex = 0;
    private currentDemo: Scene;

    private title: TextObject;
    private instructions: TextObject;

    constructor()
    {
        super({persistent: true, UI: true, resize: true});
    }

    async OnAwake()
    {
        // TITLE
        var title = new TextObject(this, {text: `${this.demos[this.demoIndex].name}`, fontSize: 28, fontFamily: 'monospace'})
        this.AddGameObject(title)
            .SetPosition(bare.width * .5, 16)
            .SetPivot(.5, 0);
        this.title = title;

        // ARROWKEY INSTRUCTIONS
        var instructions = new TextObject(this, {text: `⬅️ Use arrowkeys to switch between demos ➡️`, fontSize: 22, fontFamily: 'monospace', fill: '#5093eb'});
        this.AddGameObject(instructions)
            .SetPosition(bare.width * .5, 56)
            .SetPivot(.5, 0);
        this.instructions = instructions;

        // LISTEN TO EVENTS FOR TEXT VISIBILITY
        this.events.persistent.on(BareEvent.editor_opened, () => this.SetDemoTextVisibility(false));
        this.events.persistent.on(BareEvent.editor_closed, () => this.SetDemoTextVisibility(true));

        // LISTEN TO KEYBOARD EVENTS
        this.events.on(BareEvent.key_down, (e) =>  {
            if (!this.currentDemo?.started)
                return; // CURRENT DEMO HASN'T LOADED EVERYTHING YET

            // CHANGE DEMO WITH ARROW KEYS
            if (e.key == "arrowLeft")
            {
                this.ChangeDemo(-1);
            }
            if (e.key == "arrowRight")
            {
                this.ChangeDemo(1);
            }

            // RESTART WITH SPACE/R
            if (e.key == " " || e.key == "r")
            {
                this.currentDemo.Restart();
            }
        });
    }

    OnStart(): void | Promise<void>
    {
        this.StartDemo(0);
    }

    async StartDemo(demoIndex: number)
    {
        var name = this.demos[demoIndex].name.replace('Demo', '');

        // SET PATHS TO UPCOMING DEMO DIR
        var folderName = name == name.toUpperCase()
            ? name.toLowerCase()
            : name.charAt(0).toLowerCase() + name.slice(1); // LOWERCASE FIRST LETTER
        bare.rootDir = `demos/${folderName}`;
        bare.levelDir = `levels`; 
        bare.soundDir = ``;

        // RESET BACKGROUND COLOR
        rapid.backgroundColor = Color.White;

        // UPDATE TEXT "TITLE: X. NAME"
        this.title.SetText(`${demoIndex + 1}. ` + name
                .replace(/([a-z])([A-Z])/g, '$1 $2')
                .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
                .replace(/^./, c => c.toUpperCase())
                .trim()
        );

        // START
        var demoClass = this.demos[demoIndex];
        this.currentDemo = null; // WHILE LOADING THERE IS NO CURRENT DEMO, SO KEY HANDLER IGNORES INPUT
        this.currentDemo = await bare.scene.Goto(demoClass);
        bare.scene.MoveToFront(this);
    }

    ChangeDemo(delta: number)
    {
        var newDemoIndex = Helper.Clamp(this.demoIndex+delta, 0, this.demos.length - 1);

        if (newDemoIndex == this.demoIndex)
            return;

        this.demoIndex = newDemoIndex;

        // CLEAR ASSETS AND RELOAD INITIAL TEXTURES, WE WANT TO KEEP THOSE
        bare.asset.Clear();
        bare.ImplementInitialTextures();
        
        this.StartDemo(this.demoIndex);
    }

    SetDemoTextVisibility(visible: boolean)
    {
        this.title.visible = visible;
        this.instructions.visible = visible;
    }
}

StartBare(MainGame, {antiAlias: true, showEditorButton: true});

import { BareEvent, Color, Helper, Scene, StartBare, TextObject } from 'bare-engine';
import { DemoAnimation } from '../public/demos/animation/src/DemoAnimation';
import { DemoArcadePhysics } from '../public/demos/arcadePhysics/src/DemoArcadePhysics';
import { DemoBasics } from '../public/demos/basics/src/DemoBasics';
import { DemoCamera } from '../public/demos/camera/src/DemoCamera';
import { DemoComponents } from '../public/demos/components/src/DemoComponents';
import { DemoEditorComponents } from '../public/demos/editorComponents/src/DemoEditorComponents';
import { DemoPrefabs } from '../public/demos/prefabs/src/DemoPrefabs';
import { DemoExtend } from '../public/demos/extend/src/DemoExtend';
import { DemoGraphics } from '../public/demos/graphics/src/DemoGraphics';
import { DemoImageLoading } from '../public/demos/imageLoading/src/DemoImageLoading';
import { DemoLevel } from '../public/demos/level/src/DemoLevel';
import { DemoParticles } from '../public/demos/particles/src/DemoParticles';
import { DemoRenderTexture } from '../public/demos/renderTexture/src/DemoRenderTexture';
import { DemoShaders } from '../public/demos/shaders/src/DemoShaders';
import { DemoRealisticPhysics } from '../public/demos/realisticPhysics/src/DemoRealisticPhysics';
import { DemoSound } from '../public/demos/sound/src/DemoSound';
import { DemoTweens } from '../public/demos/tweens/src/DemoTweens';
import { DemoUi } from '../public/demos/ui/src/DemoUi';
import { DemoECS } from '../public/demos/ecs/src/DemoECS';

