import { assetsHandler, Scene, Color, MaskType, StartBare, Texture, Vec2 } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO RENDER SHAPES, TEXTURES AND MASKS
*/

export class DemoGraphics extends Scene
{
    flowerTexture:Texture;
    treeTexture:Texture;

    async OnStart()
    {
        this.flowerTexture = await assetsHandler.GetTexturePromise("🌼");
        this.treeTexture = await assetsHandler.GetTexturePromise("🌲");

        // SETTING UP MASK WITH GAMEOBJECTS
        var flower = bare.AddGameObject(this.flowerTexture)
            .SetPosition(210, 460);

        var tree = bare.AddGameObject(this.treeTexture)
            .SetPosition(225, 465);

        flower.SetMask(tree);
    }

    OnRender(): void
    {
        // CIRCLE
        rapid.withTransform(() => {
            rapid.drawCircle(50, Color.Red, 32);
        }, { position: new Vec2(100, 200) });

        // RECTANGLE
        rapid.withTransform(() => {
            rapid.drawRect(120, 100, Color.Blue);
        }, { position: new Vec2(200, 150) });

        // LINES
        rapid.withTransform(() => {
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
                color: Color.Green
            });
        }, { position: new Vec2(380, 150) });

        // POLYGON
        rapid.withTransform(() => {
            const points = Vec2.FromArray([
                [0, 30],
                [120, 20],
                [130, 100],
                [50, 90],
                [0, 70],
            ]);
            const colors = [ Color.Blue, Color.Red, Color.Yellow, Color.Green, Color.Blue];

            rapid.startGraphic(rapid.gl.TRIANGLE_FAN);

            points.forEach((point, index) => {
                const color = colors[index];
                rapid.addGraphicVertex(
                    point.x,
                    point.y,
                    0,
                    0,
                    rapid.premultipliedAlpha ? color.premultipliedUint32 : color.uint32
                );
            });

            rapid.endGraphic();
        }, { position: new Vec2(50, 300) });

        // TEXTURE POLYGON + UV
        rapid.withTransform(() => {
            const points = Vec2.FromArray([
                [0, 0],
                [140, 0],
                [70, 130],
            ]);
            const uv = Vec2.FromArray([
                [0, 0],
                [1, 0],
                [0.5, 1],
            ]);

            rapid.startGraphic(rapid.gl.TRIANGLE_FAN, this.flowerTexture);

            points.forEach((point, index) => {
                rapid.addGraphicVertex(
                    point.x,
                    point.y,
                    uv[index].x,
                    uv[index].y,
                    rapid.premultipliedAlpha ? Color.White.premultipliedUint32 : Color.White.uint32
                );
            });

            rapid.endGraphic();
        }, { position: new Vec2(200, 300) });

        // TEXTURE WARPED INTO A QUAD (PERSPECTIVE TILT)
        rapid.withTransform(() => {
            const points = Vec2.FromArray([ // TILTED QUAD
                [0, 30],
                [220, 0],
                [200, 90],
                [20, 110],
            ]);
            const uv = Vec2.FromArray([ // UV QUAD
                [0, 1],
                [1, 1],
                [1, 0],
                [0, 0],
            ]);

            rapid.startGraphic(rapid.gl.TRIANGLE_FAN, this.flowerTexture);

            points.forEach((point, index) => {
                rapid.addGraphicVertex(
                    point.x,
                    point.y,
                    uv[index].x,
                    uv[index].y,
                    rapid.premultipliedAlpha ? Color.White.premultipliedUint32 : Color.White.uint32
                );
            });

            rapid.endGraphic();
        }, { position: new Vec2(360, 300) });

        // MASK WITH TEXTURES

        rapid.withMask(
            () => {
                rapid.withTransform(() => {
                    rapid.drawMaskImage(this.treeTexture);
                }, { position: new Vec2(75, 465) });
            },
            () => {
                rapid.withTransform(() => {
                    bare.drawSprite(this.flowerTexture);
                }, { position: new Vec2(60, 460) });
            },
            MaskType.NOT_EQUAL
        );
    }
}

//StartBare(DemoGraphics);
