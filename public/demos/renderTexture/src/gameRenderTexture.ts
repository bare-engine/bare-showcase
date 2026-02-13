import { Scene, Color, GameObject, Helper, RenderTexture, StartBare } from "bare-engine";

/*  
    THIS SHOW HOW TO SETUP A RENDER TEXTURE AND RENDER LOTS OF TEXTURES TO IT
*/

export class GameRenderTexture extends Scene
{
    renderTexture: RenderTexture;

    OnStart()
    {
        this.renderTexture = new RenderTexture(bare.width, bare.height);
        bare.AddGameObject(this.renderTexture);
    }

    OnUpdate(deltaTime: number): void
    {
        var obj = new GameObject(Helper.RandomRange(0, bare.width), Helper.RandomRange(150, bare.height))
        obj.SetRotation(Helper.RandomRange(-45, 45));
        obj.InitTexture(Helper.Choose("😁", "😃", "😄", "😊", "😋", "😛"));
        obj.CenterPivot();

		bare.RenderTo(obj, this.renderTexture); // COULD ALSO SUPPLY A TEXTURE INSTEAD OF GAMEOBJECT
    }

    OnClear(): void
    {
        this.renderTexture.destroy();
    }
}

//StartBare(GameRenderTexture);