import { Component, GameMode, Run, Scene, SerializeField } from "bare-engine"
import { GameObject } from "bare-engine";
import { Color, Vec2 } from "bare-engine";

type Direction = "top" | "right" | "bottom" | "left";

@Run(GameMode.Edit)
export class LevelConnectorComponent extends Component
{
    @SerializeField(GameMode.Edit) private top:string;
    @SerializeField(GameMode.Edit) private right:string;
    @SerializeField(GameMode.Edit) private bottom:string;
    @SerializeField(GameMode.Edit) private left:string;

    constructor(scene:Scene, top:string, right:string, bottom:string, left:string)
    {
        super(scene);
        
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }

    override Added(go: GameObject):void
    {
        super.Added(go);
    }

    override OnUpdate(deltaTime: number): void 
    {
        if (bare.mouse.IsDown() || bare.mouse.IsRightDown()/* && bare.hitbox.GetCurrentHover() == this.go.hitbox*/)
        {
            var directions:Direction[] = ["top", "right", "bottom", "left"];
            for (var direction of directions)
            {
                this[direction] = "";
            }

            var lineMargin = 100;
            var minDist = 400;

            var allConnectorComponents:LevelConnectorComponent[] = bare.component.GetAllByType(LevelConnectorComponent as any);
            for (var connectorComp of allConnectorComponents)
            {
                var otherBO = connectorComp.go;

                if (otherBO == this.go)
                    continue;

                var thisPos = this.go.position;
                var otherPos = otherBO.position;
                
                var deltaX = Math.abs(thisPos.x - otherPos.x);
                var deltaY = Math.abs(thisPos.y - otherPos.y);
                
                var isHorizontallyAligned = deltaY <= lineMargin && deltaX <= minDist && deltaX > 0;
                var isVerticallyAligned = deltaX <= lineMargin && deltaY <= minDist && deltaY > 0;
                
                if (isHorizontallyAligned || isVerticallyAligned)
                {
                    var direction: Direction = "top";
                    
                    if (isHorizontallyAligned)
                    {
                        if (otherPos.x > thisPos.x)
                            direction = "right";
                        else
                            direction = "left";
                    }
                    else if (isVerticallyAligned)
                    {
                        if (otherPos.y < thisPos.y)
                            direction = "top";
                        else
                            direction = "bottom";
                    }

                    this[direction] = otherBO.name;
                }
            }
        }
    }

    override OnRender(): void 
    {
        var directions:Direction[] = ["top", "right", "bottom", "left"];
        var allConnectorComponents:LevelConnectorComponent[] = bare.component.GetAllByType(LevelConnectorComponent as any);
        for (var connectorComp of allConnectorComponents)
        {
            var otherGo = connectorComp.go;

            if (otherGo == this.go)
                continue;
            
            for (var direction of directions)
            {
                if (this[direction] == otherGo.name)
                {
                    var thisPos = this.go.position;
                    var otherPos = otherGo.position;

                    rapid.drawLine({points: [new Vec2(thisPos.x, thisPos.y), new Vec2(otherPos.x, otherPos.y)], 
                                    width: 5,
                                    color: Color.White});

                    break;
                }
            }
        }
    }
}
