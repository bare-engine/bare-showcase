import entityDataJson from './../data/entityData.json';
import mapDataJson from './../data/mapData.json';
import mapLevelJson from './../levels/map.json';

import { Button, CameraScaleMode, EditorScene, LevelData, SaveData, Scene, SettingsHandler, TweenTo, assetsHandler, cameraHandler, hitboxController, plugin, sceneController, uiScene } from "bare-engine";
import { PhysicsObjectBare } from 'bare-engine/barePhysics';
import { LevelConnectorComponent } from "./editorComponents/levelConnectorComponent";
import { Direction, MapHandler } from './mapHandler';
import { MainGame } from '../../../../src/game';

/*  
    THIS DEMO SHOWS THE LevelConnectorComponent IN THE MAP EDITOR
    ALSO SHOWING HOW YOU CAN MAKE A CUSTOM EDITOR OUT OF THE LEVEL EDITOR
    IN THIS CASE, MAKING IT INTO A EDITOR WHERE YOU CAN CONNECT MAPS
    THE RESULTING LEVEL FILE IS SIMPLY USED AS DATA.

    IN THE FUTURE, COULD MAKE COMPRESS/DECOMRESS FUNCTIONALITY
    SO IT DOESN'T HAVE TO LOOK LIKE A LEVEL FILE ANYMORE, MORE PURE DATA
*/

var mapHandler: MapHandler;

export class GameEditorComponents extends Scene
{
    mapSettingsHandler: SettingsHandler = new SettingsHandler(this);

    mapEditorButton: Button;
    OnClickMapEditorButton: () => void;

    constructor()
    {
        super({entityData: entityDataJson});
    }
        
    async OnAwake()
    {
        mapHandler = new MapHandler(this);

        // REGISTER LevelConnectorComponent, NEEDED SINCE IT'S REFERENCED IN mapDataJson
        this.AddClass(LevelConnectorComponent);

        // REGISTER PhysicsObjectBare, NEEDED SINCE IT'S REFERENCED IN entityDataJson
        bareEngine.RegisterGameObjectPool(PhysicsObjectBare, 30); //SET POOL SIZE

        // ADD DEBUG ACTIONS FOR THE CHROME PLUGIN (IF IT'S THERE)
        plugin.AddDebugAction("Toggle Map Editor", () => this.OnClickMapEditorButton());

        // THE MAP HAS "level_[editorImages]" IN IT'S CATEGORIES, THIS WILL RESOLVE THAT
        // BY FINDING ALL IMAGES IN editorImages FOLDER AND MAKING THEM INTO PLACABLE OBJECTS
        // NOT NEEDED RIGHT AWAY, BUT HANDY TO HAVE IT BEFORE OPENING THE MAP EDITOR
        await this.mapSettingsHandler.Process(mapDataJson);
    }

    async OnStart()
    {
        await assetsHandler.GetTexturePromise("arrowLevel");
        await this.LoadLevel("level_car");

        // CREATE MAP EDITOR BUTTON
        this.mapEditorButton = new Button(uiScene, {text: "Open Map Editor", OnPress: async () => {
            sceneController.DisableAllScenes();
            await sceneController.Add(EditorScene, {
                levelPathOrData: "demos/editorComponents/levels/map.json",
                settingsHandler: this.mapSettingsHandler,
            });
        }});
        this.mapEditorButton.name = "mapEditorButton";

        // ADDING mapEditorButton TO MainGame, SO IT'S ON TOP
        sceneController.Get(MainGame).AddGameObject(this.mapEditorButton)
            .SetPosition(bare.width, 0)
            .SetPivot(1, 0);

        this.mapEditorButton.persistent = true;
        this.mapEditorButton.visible = true;
    }

    override OnAfterLoadedLevel(level:LevelData)
    {
        cameraHandler.SetScaleMode(CameraScaleMode.Contain);
        cameraHandler.SetDimensionsToLevel();

        // READ LEVEL MAP, SO WE KNOW HOW LEVELS ARE CONNECTED
        // CHECKING FIRST FOR lastSavedMap, TO GET THE LATEST
        mapHandler.FillLevelMap(mapHandler.lastSavedMap || mapLevelJson);

        this.PlaceDirectionalButtons();
    }

    PlaceDirectionalButtons()
    {
        uiScene.Clear();
        
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

            let arrow = uiScene.AddGameObject("arrowLevel", 0)
                .SetPosition(x, y)
                .CenterPivot()
                .SetRotation(rotation);

            var e = 15;
            arrow.pivot.x -= e;
            var obj = {pivotX: arrow.pivot.x + e*2, yoyo: true, repeat: Infinity}
            TweenTo(arrow, .3, obj);

            // NOTE: THE HITBOX ON THIS IS CURRENTLY NOT ENTIRELY CORRECT, IT DOESN'T ACCOUNT FOR ROTATION
            arrow.OnPointerDown(() => {
                var targetLevelStr = connections[dir as Direction];
                this.LoadLevel(targetLevelStr);
            });
        }
    }

    OnClear(full?: boolean): void
    {
        if (full)
        if (this.mapEditorButton)
        {
            this.mapEditorButton.Remove();
        }
    }
}

//StartBare(GameEditorComponents);
