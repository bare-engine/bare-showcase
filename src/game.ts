
/*  
    HERE WE SETUP THE GAME AND MANAGE THE DEMOS
    EACH DEMO IS A Scene ON ITS OWN, WHICH MAKES IT EASY TO EXTRACT THE CODE 
    AND MOVE IT TO THE BARE TEMPLATE FOR EXAMPLE
*/

export class MainGame extends Scene
{
    private demos = [
        GameBasics,
        GameImageLoading,
        GameAnimation,
        GameRenderTexture,
        GameGraphics,
        GameParticles,
        GameShaders,
        GameTweens,
        GameEntities,
        GameComponents,
        GameExtend,
        GameLevel,
        GameEditorComponents,
        GameSopiroPhysics,
        GameBarePhysics,
        GameSound,
        GameCamera,
        GameUi,
    ];

    private demoIndex = 0;
    private currentDemo: Scene;

    private title: HTMLDivElement;
    private instructions: HTMLDivElement;

    constructor()
    {
        super();

        this.persistent = true;
    }

    async OnAwake()
    {
        // TITLE DIV
        var title = document.createElement('div');
        title.className = 'title';
        title.innerHTML = `${this.demos[this.demoIndex].name}`;
        title.style.position = 'absolute';
        title.style.top = '0px';
        title.style.margin = '16px';
        title.style.fontSize = '28px';
        title.style.pointerEvents = 'none';
        document.body.appendChild(title);
        this.title = title;

        // ARROWKEY INSTRUCTIONS DIV
        var instructions = document.createElement('div');
        instructions.className = 'title';
        instructions.innerHTML = `⬅️ Use arrowkeys to switch between demos ➡️`;
        instructions.style.position = 'absolute';
        instructions.style.top = '36px';
        instructions.style.margin = '16px';
        instructions.style.fontSize = '18px';
        instructions.style.pointerEvents = 'none';
        document.body.appendChild(instructions);
        this.instructions = instructions;

        // SET FONT
        document.body.style.fontFamily = 'monospace';
        
        this.events.persistent.on('gameStarted', () => this.DetermineEditorButtonVisibility());
        this.events.persistent.on('editor_opened', () => this.SetDemoTextVisibility(false));
        this.events.persistent.on('editor_closed', () => this.SetDemoTextVisibility(true));

        // ENABLE PLUGIN
        this.AddClass(BarePlugin);

        document.addEventListener('keydown', async (e: KeyboardEvent) => {
            if (!this.currentDemo.started)
                return; // CURRENT DEMO HASN'T LOADED EVERYTHING YET

            // CHANGE DEMO WITH ARROW KEYS
            if (e.key == "ArrowLeft")
            {
                this.ChangeDemo(-1);
            }
            if (e.key == "ArrowRight")
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
        var name = this.demos[demoIndex].name.replace('Game', '');

        // SET PATHS TO UPCOMING DEMO DIR
        var folderName = name.toLowerCase();
        Scene.rootPath = `demos/${folderName}`;
        Scene.imagePath = `images`;
        Scene.levelPath = `levels`;
        Scene.soundPath = ``;

        // UPDATE TEXT "TITLE: X. NAME"
        this.title.innerHTML = `${demoIndex + 1}. ` + name
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, c => c.toUpperCase())
                .trim();

        // START
        var demoClass = this.demos[demoIndex];
        this.currentDemo = await sceneController.Goto(demoClass)
    }

    ChangeDemo(delta: number)
    {
        var newDemoIndex = Helper.Clamp(this.demoIndex+delta, 0, this.demos.length - 1);

        if (newDemoIndex == this.demoIndex)
            return;

        this.demoIndex = newDemoIndex;

        //Scene.ClearAll();
        this.StartDemo(this.demoIndex);
    }

    // ONLY SHOW THE EDITOR BUTTON FOR DEMOS WITH LEVELS
    DetermineEditorButtonVisibility()
    {
        const editorButton = document.getElementById('editor-button') as HTMLButtonElement;
        editorButton.style.display = (bare.currentLevelStr ? 'block' : 'none');
    }

    SetDemoTextVisibility(visible: boolean)
    {
        this.title.style.display = (visible ? 'block' : 'none');
        this.instructions.style.display = (visible ? 'block' : 'none');
    }
}

StartBare(MainGame, {antiAlias: true});

import { StartBare, Scene, Helper, globalEvents, BarePlugin, sceneController } from 'bare-engine';
import { GameBasics } from '../public/demos/basics/src/gameBasics';
import { GameImageLoading } from '../public/demos/imageLoading/src/gameImageLoading';
import { GameAnimation } from '../public/demos/animation/src/gameAnimation';
import { GameRenderTexture } from '../public/demos/renderTexture/src/gameRenderTexture';
import { GameGraphics } from '../public/demos/graphics/src/gameGraphics';
import { GameParticles } from '../public/demos/particles/src/gameParticles';
import { GameShaders } from '../public/demos/shaders/src/gameShaders';
import { GameTweens } from '../public/demos/tweens/src/gameTweens';
import { GameBarePhysics } from '../public/demos/barePhysics/src/gameBarePhysics';
import { GameSopiroPhysics } from '../public/demos/sopiroPhysics/src/gameSopiroPhysics';
import { GameEntities } from '../public/demos/entities/src/gameEntities';
import { GameComponents } from '../public/demos/components/src/gameComponents';
import { GameExtend } from '../public/demos/extend/src/gameExtend';
import { GameLevel } from '../public/demos/level/src/gameLevel';
import { GameEditorComponents } from '../public/demos/editorComponents/src/gameEditorComponents';
import { GameSound } from '../public/demos/sound/src/gameSound';
import { GameUi } from '../public/demos/ui/src/gameUi';
import { GameCamera } from '../public/demos/camera/src/gameCamera';