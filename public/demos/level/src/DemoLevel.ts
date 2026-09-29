import { Scene } from "bare-engine";

/*  
	THIS DEMO SHOWS HOW TO LOAD THE LEVEL "level_forest"
	IT'S AUTOMATICALLY FOUND AT LOCATION 'public/demos/level/levels/level_forest.json'

	SINCE levelController IS REFERENCED IN THIS CLASS,
	IT WILL AUTOMATICALLY INCLUDE EDITOR CONTROLLER AND EVERYTHING THAT COMES WITH IT
	AN EDITOR BUTTON WILL APPEAR ON THE SCREEN
	BUT ONLY IN DEVELOPMENT, IF YOU WANT LEVEL EDITING IN PRODUCTION, 
	USE: bare.AddClass(BareClasses.EditorController);
	THEN TO OPEN IT: editorController.OpenEditor() OR editorController.Toggle();
*/

const data = ` {
    "basePrefabs": [
        {
            "name": "ANY",
            "texture": "NAME"
		}
	],
	"categories": {
		"objects": {
			"image": "🌳",
			"entries": ["🏚", "🌲", "🌳", "🪵", "🪓", "grassPatch"]
		}
	},
	"layers": ["surface", "objects"],
	"layersInfo": {
		"surface": {
			"save": true
		}
	}
}`;

// NOT SETTING save ON objects LAYER ABOVE, IT'S SAVED ON DEFAULT

export class DemoLevel extends Scene
{
	constructor()
	{
		super(JSON.parse(data));
	}

	async OnStart()
	{
		await this.LoadLevel("level_forest");
	}
	
	OnPostLoadLevel()
	{
		bare.camera.SetPosition(0, 0);
		bare.camera.SetDimensionsToLevel();
	}
}
