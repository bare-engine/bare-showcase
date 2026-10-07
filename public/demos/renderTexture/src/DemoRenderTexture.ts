import { Scene, GameObject, Helper, RenderTexture, Color } from "bare-engine";

/*  
    THIS SHOW HOW TO SETUP A RENDER TEXTURE AND RENDER LOTS OF TEXTURES TO IT
*/

export class DemoRenderTexture extends Scene
{
    renderTexture!: RenderTexture;

    override OnStart()
    {
        this.renderTexture = new RenderTexture(rapid, { width: bare.width, height: bare.height, clearColor: new Color(0, 0, 0, 0) })
        bScene.AddGameObject(this.renderTexture)
            .CenterPivot()
            .SetPosition(bare.width * .5, bare.height * .5)
            .SetScale(.8);
    }

    override OnUpdate(deltaTime: number): void
    {
        var obj = new GameObject(this, '', Helper.RandomRange(0, bare.width), Helper.RandomRange(150, bare.height))
        obj.SetRotation(Helper.RandomRange(-45, 45));
        obj.InitTexture(Helper.Choose("😁", "😃", "😄", "😊", "😋", "😛"));
        obj.CenterPivot();

		bScene.RenderTo(obj, this.renderTexture); // COULD ALSO SUPPLY A TEXTURE INSTEAD OF GAMEOBJECT
    }

    override OnClear(): void
    {
        this.renderTexture.destroy();
    }
}
