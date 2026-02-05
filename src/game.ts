
/*  
    HERE WE SETUP THE GAME AND MANAGE THE DEMOS
    EACH DEMO IS A BareGame ON ITS OWN, WHICH MAKES IT EASY TO EXTRACT THE CODE AND MOVE IT TO THE BARE TEMPLATE FOR EXAMPLE
    BUT, YOU'RE REALLY ONLY SUPPOSED TO HAVE ONE BareGame
    SO DON'T TAKE TOO MUCH FROM THIS CODE, LEARN FROM THE DEMOS INSTEAD
*/

export class Game extends BareGame
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
        GameScreens,
        GameCamera,
        GameUi,
    ];

    private demoIndex = 0;
    private currentDemo: BareGame;

    private title: HTMLDivElement;
    private instructions: HTMLDivElement;

    constructor()
    {
        super();
    }

    async Start()
    {
        await super.Start();

        if (this.RunMainLoopId == 2)
            cancelAnimationFrame(1); // DON'T LOOK

        // CLEAR OURSELVES (DON'T WANT TO GET IN THE WAY OF OTHER GAME CLASSES)
        // USUALLY YOU PUT ALL CODE BELOW IN OnStart, BUT BECAUSE OF THE DEMO SETUP
        // WE NEED TO CLEAR AT THE LAST STEP OF INIT SO PUTTING ALL CODE HERE
        this.Clear(true);

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
        
        events.persistent.on('gameStarted', () => this.DetermineEditorButtonVisibility());
        events.persistent.on('editor_opened', () => this.SetDemoTextVisibility(false));
        events.persistent.on('editor_closed', () => this.SetDemoTextVisibility(true));

        // ENABLE PLUGIN
        this.plugin = new BarePlugin();

        // START 
        this.StartDemo(0);

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

    StartDemo(demoIndex: number)
    {
        var name = this.demos[demoIndex].name.replace('Game', '');

        // SET PATHS TO UPCOMING DEMO DIR
        var folderName = name.toLowerCase();
        BareGame.rootPath = `demos/${folderName}`;
        BareGame.imagePath = `images`;
        BareGame.levelPath = `levels`;
        BareGame.soundPath = ``;

        // UPDATE TEXT "TITLE: X. NAME"
        this.title.innerHTML = `${demoIndex + 1}. ` + name
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, c => c.toUpperCase())
                .trim();

        // START
        this.currentDemo = new this.demos[demoIndex]();
    }

    ChangeDemo(delta: number)
    {
        var newDemoIndex = Helper.Clamp(this.demoIndex+delta, 0, this.demos.length - 1);

        if (newDemoIndex == this.demoIndex)
            return;

        this.demoIndex = newDemoIndex;

        BareGame.ClearAll();
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

BareGame.initialized = false;
StartBare(Game, {antiAlias: true});

import { StartBare, BareGame, Helper, events, BarePlugin } from 'bare-engine';
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
import { GameScreens } from '../public/demos/screens/src/gameScreens';
import { GameUi } from '../public/demos/ui/src/gameUi';
import { GameCamera } from '../public/demos/camera/src/gameCamera';