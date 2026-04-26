
import { Scene, Easing, hitboxController, Tween, tweenController, TweenTo, StartBare, assetsHandler } from "bare-engine";

/*  
    THIS SHOWS ALL THE DIFFERENT WAYS YOU CAN TWEEN THINGS!
    NOTE THAT TWEENCHAINS DON'T WORK YET
*/

export class DemoTweens extends Scene
{
    async OnAwake(): Promise<void>
    {
        await assetsHandler.GetTexturePromise("❤");
    }
    
    OnStart()
    {
        var heart = bare.AddGameObject('❤')
            .SetPosition(bare.width * .5, bare.height * .5)
            .CenterPivot();

        // EVERY TRANSFORM VALUE (POSITION/SCALE/ROTATION/FLIPPED) HAS AN INNER-TRANSFORM COUNTERPART
        // THAT MAKES IT EASY TO DO THE FOLLOWING PULSE SCALE + POINTER ENTER SCALE UP
        // NO NESTED GAME OBJECTS NEEDED

        TweenTo(heart, .3, {innerScale: 1.12, yoyo: true, repeat: Infinity});

        hitboxController.AssignButton(heart, {
            OnPress: () => {
                tweenController.TweenShake(heart.innerPosition, "y", 1.2, -0.5, 3, 4, 0.075, 30);
            },
            OnEnter: () => {
                TweenTo(heart, 0.3, { scale: 2 });
            },
            OnLeave: () => {
                TweenTo(heart, 0.3, { scale: 1 });
            },
        });

        const leftX = bare.width * .25;
        const centerX = bare.width * .5;
        const rightX = bare.width * .75;
        const topY = bare.height * .25;
        const bottomY = bare.height * .75;

        // ROTATION LOOP
        const spinner = bare.AddGameObject('❤')
            .SetPosition(leftX, topY)
            .CenterPivot();

        TweenTo(spinner, 2, {rotation: 360, repeat: Infinity, ease: Easing.Linear.None});

        // BOUNCE (Y + YOYO)
        const bouncer = bare.AddGameObject('❤')
            .SetPosition(centerX, topY)
            .CenterPivot();

        TweenTo(bouncer, .8, {y: topY - 50, yoyo: true, repeat: Infinity, ease: Easing.Quadratic.Out});

        // FADE IN/OUT (ALPHA)
        const fader = bare.AddGameObject('❤')
            .SetPosition(rightX, topY)
            .CenterPivot();

        TweenTo(fader, 1.2, {alpha: .2, yoyo: true, repeat: Infinity, ease: Easing.Quadratic.InOut});

        // INNER TRANSFORM SWAY
        const sway = bare.AddGameObject('❤')
            .SetPosition(leftX, bottomY)
            .CenterPivot();

        TweenTo(sway, 1.4, {innerRotation: 18, yoyo: true, repeat: Infinity, ease: Easing.Sinusoidal.InOut});

        // INNER POSITION DRIFT
        const drift = bare.AddGameObject('❤')
            .SetPosition(centerX, bottomY)
            .CenterPivot();

        TweenTo(drift.innerPosition, 1, {x: 14, yoyo: true, repeat: Infinity, ease: Easing.Quadratic.InOut});

        // SEQUENCED TWEENS WITH AddChain - NOT WORKING, BEING REMOVED RIGHT AWAY
        const pop = bare.AddGameObject('❤')
            .SetPosition(rightX, bottomY)
            .CenterPivot();

        const startPopChain = () => {
            const t1 = new Tween(pop)
                .to({scale: 1.25}, .18 * 1000)
                .easing(Easing.Back.Out);

            const t2 = new Tween(pop)
                .to({rotation: 12}, .12 * 1000)
                .easing(Easing.Quadratic.Out);

            const t3 = new Tween(pop)
                .to({rotation: -12}, .2 * 1000)
                .easing(Easing.Quadratic.InOut);

            const t4 = new Tween(pop)
                .to({rotation: 0, scale: 1}, .2 * 1000)
                .easing(Easing.Quadratic.In)
                .onComplete(startPopChain);

            tweenController.AddChain(t1, t2, t3, t4);
            t1.chain(t4); // CONNECT THEM UP TO LOOP
        };

        startPopChain();
    }
}

//StartBare(DemoTweens);