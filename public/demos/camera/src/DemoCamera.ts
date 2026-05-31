
import { Scene, cameraHandler, CameraScaleMode, Helper, mouseController, StartBare, TweenTo, BareEvent } from "bare-engine";

/*  
    THIS DEMO SHOWS HOW TO MOVE THE CAMERA 
    AND THE EFFECT OF THE 'COVER' AND 'CONTAIN' CAMERA SCALE MODES

    COVER: WHEN ZOOMED OUT, FITS CONTENT WITHIN SCREEN, LEAVING NO SPACE AROUND (WILL NEVER SEE OUTSIDE CONTENT BOUNDS)
    CONTAIN: WHEN ZOOMED OUT, FITS CONTENT WITHIN SCREEN, WITH SPACE AROUND (WILL SEE OUTSIDE CONTENT BOUNDS / LETTERBOXED)
*/

export class DemoCamera extends Scene
{
    async OnStart()
    {
        cameraHandler.SetBounds({ x: -4500, y: -1500, width: 9000, height: 3000 });

        for (var i = 0; i < 500; i++)
        {
            bScene.AddGameObject('🌱')
                .SetPosition(
                    Helper.RandomRange(cameraHandler.bounds.x, cameraHandler.bounds.x + cameraHandler.bounds.width),
                    Helper.RandomRange(cameraHandler.bounds.y, cameraHandler.bounds.y + cameraHandler.bounds.height))
                .SetScale(.6)
                .CenterPivot();
        }
        
        this.events.on(BareEvent.pointer_down, () => {
            cameraHandler.StartShake(5, .5);
        });
 
        var count = 0;
        TweenTo(this, 1, { delay: 2, onEveryStart: () => {
            var zoom = 1;

            if (count % 4 == 0)
            {
                trace('Switched scaleMode to cover');
                cameraHandler.SetScaleMode(CameraScaleMode.Cover);
                zoom = .05;
            }
            else
            if (count % 2 == 0)
            {
                trace('Switched scaleMode to contain');
                cameraHandler.SetScaleMode(CameraScaleMode.Contain);
                zoom = .05;
            }

            TweenTo(cameraHandler, .6, { zoom: zoom });
            count++;
        }, onUpdate: () => {
            cameraHandler.CalculateZoomFit()
        }, repeat: Infinity });
    }

    OnUpdate(deltaTime: number): void
    {
        cameraHandler.SetPosition(
            mouseController.screen.position.x,
            mouseController.screen.position.y
        );
    }
}

//StartBare(DemoCamera);