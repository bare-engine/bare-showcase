import { assetsHandler, BareGame, Color, MaskType, StartBare, Texture, Vec2 } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO RENDER SHAPES, TEXTURES AND MASKS
*/

export class GameGraphics extends BareGame
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
        bare.renderCircle({
            position: new Vec2(100, 200),
            radius: 50, segments: 32,
            color: Color.Red
        });

        // RECTANGLE
        bare.renderRect({ 
            position: new Vec2(200, 150), 
            width: 120, 
            height: 100, 
            color: Color.Blue 
        });

        // LINES
        bare.renderLine({
            position: new Vec2(380, 150), 
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

        // POLYGON
        bare.renderGraphic({ 
            position: new Vec2(50, 300), 
            points: Vec2.FromArray([
                [0, 30],
                [120, 20],
                [130, 100],
                [50, 90],
                [0, 70],
            ]), 
            color: [ Color.Blue, Color.Red, Color.Yellow, Color.Green, Color.Blue]
        });

        // TEXTURE POLYGON + UV
        bare.renderGraphic({ 
            position: new Vec2(200, 300), 
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
            texture: this.flowerTexture
        });

        // TEXTURE WARPED INTO A QUAD (PERSPECTIVE TILT)
        bare.renderGraphic({ 
            position: new Vec2(360, 300), 
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
            texture: this.flowerTexture
        });

        // MASK WITH TEXTURES
        rapid.drawMask(MaskType.Exclude, () => {
            rapid.renderSprite({
                texture: this.treeTexture,
                position: new Vec2(75, 465)
            });
        })
        rapid.renderSprite({
            texture: this.flowerTexture,
            position: new Vec2(60, 460)
        });
        rapid.clearMask();
    }
}

StartBare(GameGraphics);
