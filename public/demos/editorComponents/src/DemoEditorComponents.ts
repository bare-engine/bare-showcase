import settingsDataJson from './../data/settingsData.json';

import { CameraScaleMode, LevelData, SaveData, Scene, TweenTo, uiScene } from "bare-engine";
import { ArcadeObject } from 'bare-engine/arcade';
import { LevelConnectorComponent } from "./editorComponents/levelConnectorComponent";
import { Direction, MapHandler } from './mapHandler';

/*  
    THIS DEMO SHOWS THE LevelConnectorComponent IN THE MAP EDITOR
    ALSO SHOWING HOW YOU CAN MAKE A CUSTOM EDITOR OUT OF THE LEVEL EDITOR
    IN THIS CASE, MAKING IT INTO A EDITOR WHERE YOU CAN CONNECT MAPS
    THE RESULTING LEVEL FILE IS SIMPLY USED AS DATA.
*/

export class DemoEditorComponents extends Scene
{
    constructor()
    {
        super({settingsData: settingsDataJson});
    }
        
    async OnAwake()
    {
        await MapHandler.Init(this);

        // REGISTER LevelConnectorComponent,
        // NEEDED SINCE IT'S REFERENCED IN mapDataJson
        bare.AddClass(LevelConnectorComponent);

        // REGISTER ArcadeObject, NEEDED SINCE IT'S REFERENCED IN settingsDataJson
        bare.RegisterGameObjectPool(ArcadeObject, 30); //SET POOL SIZE
    }

    async OnStart()
    {
        await bare.asset.LoadTexture("arrowLevel");
        await this.LoadLevel("level_car");

        uiScene.persistent = true;
        uiScene.resize = true;
    }

    override OnPostLoadLevel(level:LevelData)
    {
        bare.camera.SetScaleMode(CameraScaleMode.Contain);
        bare.camera.SetDimensionsToLevel();

        this.PlaceDirectionalButtons();
    }

    PlaceDirectionalButtons()
    {
        uiScene.Clear(false);
        
        var connections = MapHandler.map[SaveData.currentLevelStr]?.connections;
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

            let arrow = uiScene.AddGameObject("arrowLevel")
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

    OnClear(includingPersistent?: boolean): void
    {
        if (includingPersistent)
        {
            uiScene.Clear(true);
        }
    }
}
