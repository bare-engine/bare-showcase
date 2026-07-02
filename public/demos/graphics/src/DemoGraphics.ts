import { Scene, Color, MaskType, Texture, Vec2 } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO RENDER SHAPES, TEXTURES AND MASKS
*/

export class DemoGraphics extends Scene
{
    flowerTexture:Texture;
    treeTexture:Texture;

    async OnStart()
    {
        this.flowerTexture = await bare.asset.LoadTexture("🌼");
        this.treeTexture = await bare.asset.LoadTexture("🌲");

        // SETTING UP MASK WITH GAMEOBJECTS
        var flower = bScene.AddGameObject(this.flowerTexture)
            .SetPosition(210, 460);

        var tree = bScene.AddGameObject(this.treeTexture)
            .SetPosition(225, 465);

        flower.SetMask(tree);
    }

    OnRender(): void
    {
        // CIRCLE
        rapid.drawCircle({
            radius: 50,
            color: Color.Red,
            segments: 32,
            position: new Vec2(100, 200),
        });

        // RECTANGLE
        rapid.drawRect({
            width: 120,
            height: 100,
            color: Color.Blue,
            position: new Vec2(200, 150),
        });

        // LINES
        rapid.drawLine({
            points: Vec2.FromArray([
                [0, 30],
                [120, 20],
                [130, 100],
                [50, 90],
                [0, 70],
            ]),
            width: 5,
            closed: true,
            color: Color.Green,
            position: new Vec2(380, 150),
        });

        // POLYGON
        rapid.drawGraphic({
            points: Vec2.FromArray([
                [0, 30],
                [120, 20],
                [130, 100],
                [50, 90],
                [0, 70],
            ]),
            color: [Color.Blue, Color.Red, Color.Yellow, Color.Green, Color.Blue],
            drawMode: rapid.gl.TRIANGLE_FAN,
            position: new Vec2(50, 300),
        });

        // TEXTURE POLYGON + UV
        rapid.drawGraphic({
            points: Vec2.FromArray([
                [0, 0],
                [140, 0],
                [70, 130],
            ]),
            uv: Vec2.FromArray([
                [0, 0],
                [1, 0],
                [0.5, 1],
            ]),
            texture: this.flowerTexture,
            drawMode: rapid.gl.TRIANGLE_FAN,
            position: new Vec2(200, 300),
        });

        // TEXTURE WARPED INTO A QUAD (PERSPECTIVE TILT)
        rapid.drawGraphic({
            points: Vec2.FromArray([ // TILTED QUAD
                [0, 30],
                [220, 0],
                [200, 90],
                [20, 110],
            ]),
            uv: Vec2.FromArray([ // UV QUAD
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0],
            ]),
            texture: this.flowerTexture,
            drawMode: rapid.gl.TRIANGLE_FAN,
            position: new Vec2(360, 300),
        });

        // MASK WITH TEXTURES

        rapid.withMask(
            () => {
                rapid.drawMaskImage({
                    texture: this.treeTexture,
                    position: new Vec2(75, 465),
                });
            },
            () => {
                bare.drawSprite({
                    texture: this.flowerTexture,
                    position: new Vec2(60, 460),
                });
            },
            MaskType.NOT_EQUAL
        );
    }
}
