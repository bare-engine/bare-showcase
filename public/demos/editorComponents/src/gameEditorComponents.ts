import entityDataJson from './../data/entityData.json'
import mapDataJson from './../data/mapData.json'
import mapLevelJson from './../levels/map.json'

import { BareGame, LevelData, SaveData, assetsHandler, UILayer, HitboxType, hitboxController, TweenTo, BareClasses as BareClasses, StartBare, levelController, CameraScaleMode, editorController, cameraHandler, SettingsHandler} from "bare-engine";
import { LevelConnectorComponent } from "./editorComponents/levelConnectorComponent";
import { Direction, mapHandler } from './mapHandler';
import { PhysicsObjectBare  } from 'bare-engine/barePhysics';

/*  
    THIS DEMO SHOWS THE LevelConnectorComponent IN THE MAP EDITOR
    ALSO SHOWING HOW YOU CAN MAKE A CUSTOM EDITOR OUT OF THE LEVEL EDITOR
    IN THIS CASE, MAKING IT INTO A EDITOR WHERE YOU CAN CONNECT MAPS
    THE RESULTING LEVEL FILE IS SIMPLY USED AS DATA.

    IN THE FUTURE, COULD MAKE COMPRESS/DECOMRESS FUNCTIONALITY
    SO IT DOESN'T HAVE TO LOOK LIKE A LEVEL FILE ANYMORE, MORE PURE DATA
*/

export class GameEditorComponents extends BareGame
{
    mapDataStore: SettingsHandler = new SettingsHandler();

    mapEditorButton: HTMLButtonElement;
    OnClickMapEditorButton: () => void;

    constructor()
    {
        super(entityDataJson);
        
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
            editorController.Toggle(this.mapDataStore, `demos/editorComponents/levels/map.json`);
        }
        this.mapEditorButton.addEventListener('click', this.OnClickMapEditorButton);
    }
        
    OnAwake(): void
    {
        // REGISTER LevelConnectorComponent, NEEDED SINCE IT'S REFERENCED IN mapDataJson
        this.AddClass(LevelConnectorComponent);

        // REGISTER PhysicsObjectBare, NEEDED SINCE IT'S REFERENCED IN entityDataJson
        this.RegisterGameObjectPool(PhysicsObjectBare, 30); //SET POOL SIZE

        // ADD DEBUG ACTIONS FOR THE CHROME PLUGIN (IF IT'S THERE)
        bare.plugin?.AddDebugAction("Toggle Map Editor", () => this.OnClickMapEditorButton());
    }

    async OnStart()
    {
        await assetsHandler.GetTexturePromise("arrowLevel");

        // READ LEVEL MAP, SO WE KNOW HOW LEVELS ARE CONNECTED
        // CHECKING FIRST FOR lastSavedMap, TO GET THE LATEST
        mapHandler.FillLevelMap(mapHandler.lastSavedMap || mapLevelJson);

        this.mapEditorButton.style.display = 'block';

        // THE MAP HAS "level_[editorImages]" IN IT'S CATEGORIES, THIS WILL RESOLVE THAT
        // BY FINDING ALL IMAGES IN editorImages FOLDER AND MAKING THEM INTO PLACABLE OBJECTS
        // NOT NEEDED RIGHT AWAY, BUT HANDY TO HAVE IT BEFORE OPENING THE MAP EDITOR
        await this.mapDataStore.Process(mapDataJson);

        // LOAD THE LEVEL! SaveData.currentLevelStr IS NEEDED TO GO TO LAST LEVEL WHEN RETURNING FROM EDITOR
        await levelController.LoadLevel(SaveData.currentLevelStr || "level_car");
    }

    override OnLoadedLevel(level:LevelData)
    {
        cameraHandler.SetScaleMode(CameraScaleMode.Contain);
        cameraHandler.SetDimensionsToLevel();
        this.PlaceDirectionalButtons();
    }

    PlaceDirectionalButtons()
    {
        var uiObjs = uiController.GetLayer(UILayer.UI).slice(0);
        uiObjs.forEach(o => bare.RemoveGameObject(o));

        var connections = mapHandler.map[SaveData.currentLevelStr].connections;
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

            let arrow = this.AddGameObject("arrowLevel", UILayer.UI)
                .SetPosition(x, y)
                .CenterPivot()
                .SetRotation(rotation);

            var e = 15;
            arrow.pivot.x -= e;
            var obj = {pivotX: arrow.pivot.x + e*2, yoyo: true, repeat: Infinity}
            TweenTo(arrow, .3, obj);

            // NOTE: THE HITBOX ON THIS IS CURRENTLY NOT ENTIRELY CORRECT, IT DOESN'T ACCOUNT FOR ROTATION
            var hb = hitboxController.AssignButton(arrow, {OnPress: () => {
                var targetLevelStr = connections[dir as Direction];
                levelController.LoadLevel(targetLevelStr);
            }});
            hb.type = HitboxType.Rectangle;
            hb.rectangle = {x: 0, y: 0, width: 86, height: 86};
        }
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

StartBare(GameEditorComponents);