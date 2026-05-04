import { Scene, GameObject, Helper, RenderTexture, StartBare, Color } from "bare-engine";

/*  
    THIS SHOW HOW TO SETUP A RENDER TEXTURE AND RENDER LOTS OF TEXTURES TO IT
*/

export class DemoRenderTexture extends Scene
{
    renderTexture: RenderTexture;

    OnStart()
    {
        this.renderTexture = new RenderTexture(rapid, { width: bare.width, height: bare.height, clearColor: new Color(0, 0, 0, 0) });
        bare.AddGameObject(this.renderTexture);
    }

    OnUpdate(deltaTime: number): void
    {
        var obj = new GameObject(this, '', Helper.RandomRange(0, bare.width), Helper.RandomRange(150, bare.height))
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

//StartBare(DemoRenderTexture);
