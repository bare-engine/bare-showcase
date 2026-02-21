import entityDataJson from './../data/entityData.json';
import mapDataJson from './../data/mapData.json';
import mapLevelJson from './../levels/map.json';

import { BareEvent, CameraScaleMode, LevelData, SaveData, Scene, SettingsHandler, TweenTo, assetsHandler, cameraHandler, hitboxController, plugin, sceneController } from "bare-engine";
import { PhysicsObjectBare } from 'bare-engine/barePhysics';
import { LevelConnectorComponent } from "./editorComponents/levelConnectorComponent";
import { Direction, MapHandler } from './mapHandler';

/*  
    THIS DEMO SHOWS THE LevelConnectorComponent IN THE MAP EDITOR
    ALSO SHOWING HOW YOU CAN MAKE A CUSTOM EDITOR OUT OF THE LEVEL EDITOR
    IN THIS CASE, MAKING IT INTO A EDITOR WHERE YOU CAN CONNECT MAPS
    THE RESULTING LEVEL FILE IS SIMPLY USED AS DATA.

    IN THE FUTURE, COULD MAKE COMPRESS/DECOMRESS FUNCTIONALITY
    SO IT DOESN'T HAVE TO LOOK LIKE A LEVEL FILE ANYMORE, MORE PURE DATA
*/

export class GameEditorComponents extends Scene
{
    mapDataStore: SettingsHandler = new SettingsHandler(this);

    mapEditorButton: HTMLButtonElement;
    OnClickMapEditorButton: () => void;

    constructor()
    {
        super({entityData: entityDataJson});
        
        // CREATE MAP EDITOR BUTTON
        const original = document.getElementById('editor-button') as HTMLButtonElement;
        const clone = original.cloneNode(true) as HTMLButtonElement;
        clone.id = 'editor-button-map';
        clone.textContent = 'Open Map Editor';
        clone.style.position = 'absolute';
        clone.style.top = '57px';
        clone.style.margin = '0px';
        document.getElementById('initial-assets')?.appendChild(clone);
        this.mapEditorButton = clone;

        // TOGGLE MAP EDITOR ON CLICK
        this.OnClickMapEditorButton = () => {
           // editorController.Toggle(this.mapDataStore, `demos/editorComponents/levels/map.json`);
        }
        this.mapEditorButton.addEventListener('click', this.OnClickMapEditorButton);

    }
        
    async OnAwake()
    {
        mapHandler = new MapHandler(this);

        // REGISTER LevelConnectorComponent, NEEDED SINCE IT'S REFERENCED IN mapDataJson
        this.AddClass(LevelConnectorComponent);

        // REGISTER PhysicsObjectBare, NEEDED SINCE IT'S REFERENCED IN entityDataJson
        this.RegisterGameObjectPool(PhysicsObjectBare, 30); //SET POOL SIZE

        // ADD DEBUG ACTIONS FOR THE CHROME PLUGIN (IF IT'S THERE)
        plugin.AddDebugAction("Toggle Map Editor", () => this.OnClickMapEditorButton());

        // THE MAP HAS "level_[editorImages]" IN IT'S CATEGORIES, THIS WILL RESOLVE THAT
        // BY FINDING ALL IMAGES IN editorImages FOLDER AND MAKING THEM INTO PLACABLE OBJECTS
        // NOT NEEDED RIGHT AWAY, BUT HANDY TO HAVE IT BEFORE OPENING THE MAP EDITOR
        await this.mapDataStore.Process(mapDataJson);
        
        sceneController.Add(UIScene);
    }

    async OnStart()
    {
        this.mapEditorButton.style.display = 'block';

        await this.LoadLevel("level_car");
    }

    override OnAfterLoadedLevel(level:LevelData)
    {
        cameraHandler.SetScaleMode(CameraScaleMode.Contain);
        cameraHandler.SetDimensionsToLevel();

        // READ LEVEL MAP, SO WE KNOW HOW LEVELS ARE CONNECTED
        // CHECKING FIRST FOR lastSavedMap, TO GET THE LATEST
        mapHandler.FillLevelMap(mapHandler.lastSavedMap || mapLevelJson);
    }

    OnClear(full?: boolean): void
    {
        this.mapEditorButton.style.display = 'none';

        if (full)
        {
            this.mapEditorButton.removeEventListener('click', this.OnClickMapEditorButton);
            this.mapEditorButton.remove();
        }
    }
}

var mapHandler: MapHandler;

export class UIScene extends Scene
{
    constructor()
    {
        super({UI: true});
    }

    async OnAwake()
    {
        await assetsHandler.GetTexturePromise("arrowLevel");
    }

    async OnStart()
    {
        bare.events.on(BareEvent.level_loaded, this.PlaceDirectionalButtons.bind(this));
    }

    PlaceDirectionalButtons()
    {
        this.objectController.Clear();
        
        var connections = mapHandler.map[SaveData.currentLevelStr]?.connections;
        for (let dir in connections)
        {
            if (connections[dir as Direction] == "")
                continue;

            var x = 0;
            var y = 0;
            var rotation = 0;

            var marge = 65;

            switch (dir) {
                case "left":
                    x = marge;
                    y = bare.height / 2;
                    rotation = 180;
                    break;
                case "right":
                    x = bare.width - marge;
                    y = bare.height / 2;
                    rotation = 0;
                    break;
                case "top":
                    x = bare.width / 2;
                    y = marge;
                    rotation = -90;
                    break;
                case "bottom":
                    x = bare.width / 2;
                    y = bare.height - marge;
                    rotation = 90;
                    break;
            }

            let arrow = this.AddGameObject("arrowLevel", 0)
                .SetPosition(x, y)
                .CenterPivot()
                .SetRotation(rotation);

            var e = 15;
            arrow.pivot.x -= e;
            var obj = {pivotX: arrow.pivot.x + e*2, yoyo: true, repeat: Infinity}
            TweenTo(arrow, .3, obj);

            // NOTE: THE HITBOX ON THIS IS CURRENTLY NOT ENTIRELY CORRECT, IT DOESN'T ACCOUNT FOR ROTATION
            hitboxController.AssignButton(arrow, {OnPress: () => {
                var targetLevelStr = connections[dir as Direction];
                sceneController.Get(GameEditorComponents).LoadLevel(targetLevelStr);
            }});
        }
    }
}

//StartBare(GameEditorComponents);