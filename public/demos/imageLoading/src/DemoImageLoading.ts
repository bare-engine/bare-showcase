
import { Scene, Helper } from "bare-engine";

/*  
    ALMOST ALL THE IMAGES IN THESE DEMOS ARE STREAMED IN 
    BUT REALLY, YOU GENERALLY WANT TO PUT YOUR IMAGES IN FOLDER 'texturePackImages'
    THEN THEY WILL BE TURNED INTO AN ATLAS AND AT INITIALIZATION LOAD TOGETHER WITH THE CODE
    THEN ON GAME READY, ALL IMAGES WILL BE AVAILABLE FOR USE.

    YOU CAN ALSO MANAGE YOUR OWN TEXTURE PACKS, USING TEXTURE PACKER
    JUST EXPORT FOR PIXI AND SAVE IN FOLDER 'public/initial/'

    THIS DEMO DEMONSTRATES DIFFERENT WAYS OF LOADING IN AND USING IMAGES
*/

export class DemoImageLoading extends Scene
{
    OnStart()
    {
        // THIS IMAGE IS PRELOADED FROM BareDemos/public/initial
        bScene.AddGameObject('🏠')
            .SetPosition(bare.width * .5, bare.height * .35)
            .CenterPivot();

        // THIS IMAGE IS PRELOADED FROM BareDemos/public/initial/folder
        // NOTE THAT IT'S JUST FOUND WITH '🦋', NO 'folder/🦋' NEEDED
        // EVEN THOUGH THIS SEPARATE PRELOAD IS POSSIBLE, IT'S RECOMMENDED TO LOAD THEM IN THE WAY SHOWN BELOW (ATLAS)
        bScene.AddGameObject('🦋')
            .SetPosition(bare.width * .5, bare.height * .9)
            .CenterPivot();

        // THESE IMAGES ARE PRELOADED FROM BareDemos/public/initial/generated
        // THEY HAVE BEEN TURNED INTO AN ATLAS BY PLACING THEM IN BareDemos/texturePackImages
        for (var i = 0; i < 5; i++)
        {
            bScene.AddGameObject(Helper.Choose('🌺','🌸','🌱','🍀'))
                .SetPosition(bare.width * .1 + (bare.width * .8) * i/4, Helper.RandomRange(bare.height * .6, bare.height * .9))
                .SetScale(.8)
                .CenterPivot()
        }

        // THIS IMAGE IS NOT IN INITIAL ASSETS, SO IT'S AUTOMATICALLY STREAMED IN FROM BareDemos/public/demos/imageLoading/images
        // EVEN THOUGH THIS WORKS (WITH SOME CAVEATS), IT'S NOT RECOMMENDED.
        // TRY TO LOAD YOUR TEXTURES BEFOREHAND BY HAVING THEM AS INITIAL ASSETS OR STREAMING THEM IN BY BULK BEFORE ADDING THE GAMEOBJECTS
        bScene.AddGameObject('🌞')
            .SetPosition(bare.width - 90, 90)
            .CenterPivot(); // CAVEAT: IT WILL ONLY REALLY SET THE PIVOT AFTER IT'S DONE LOADING THE 🌞 TEXTURE
    }
}
