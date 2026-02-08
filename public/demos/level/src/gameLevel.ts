import { BareGame, cameraHandler, levelController, StartBare } from "bare-engine";

/*  
	THIS DEMO SHOWS HOW TO LOAD THE LEVEL "level_forest"
	IT'S AUTOMATICALLY FOUND AT LOCATION 'public/demos/level/levels/level_forest.json'

	SINCE levelController IS REFERENCED IN THIS CLASS,
	IT WILL AUTOMATICALLY INCLUDE EDITOR CONTROLLER AND EVERYTHING THAT COMES WITH IT
	AN EDITOR BUTTON WILL APPEAR ON THE SCREEN
	BUT ONLY IN DEVELOPMENT, IF YOU WANT LEVEL EDITING IN PRODUCTION, 
	USE: this.AddClass(BareClasses.EditorController);
	THEN TO OPEN IT: editorController.OpenEditor() OR editorController.Toggle();
*/

const data = ` {
	"categories": [
		{
			"Objects": {
				"image": "🌳",
				"entries": ["🏚", "🌲", "🌳", "🪵", "🪓", "grassPatch"]
			}
		}
	],
	"layers": ["Objects", "Surface"],
	"layersInfo": {
		"Surface": {
			"doSave": true
		}
	}
}`;

// NOT SETTING doSave ON OBJECTS, IT'S SAVED ON DEFAULT

export class GameLevel extends BareGame
{
	constructor()
	{
		super(JSON.parse(data));
	}

	async OnAwake()
	{
		await levelController.LoadLevel("level_forest");
	}
	
	OnLoadedLevel()
	{
		cameraHandler.SetPosition(0, 0);
		cameraHandler.SetDimensionsToLevel();
	}
}

StartBare(GameLevel);