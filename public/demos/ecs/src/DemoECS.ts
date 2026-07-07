import { Color, GameObject, Scene, TextObject, TextureFilterMode } from "bare-engine";
import { World, type Query, type With } from "bare-engine";

/*
    THIS DEMO SHOWS A SIMPLE ENTITY-COMPONENT-SYSTEM.

    THIS VERSION USES GAMEOBJECTS AS ENTITIES. COMPONENTS ARE PLAIN DATA FIELDS
    ADDED TO THOSE OBJECTS, SUCH AS health, poisoned, AND dead.

    ECS IS USEFUL FOR ORGANIZING GAMEPLAY LOGIC BY SEPARATING DATA FROM SYSTEMS.
    INSTEAD OF EACH OBJECT OWNING ALL OF ITS BEHAVIOUR, SYSTEMS OPERATE ON
    QUERIES OF OBJECTS THAT HAVE THE REQUIRED COMPONENTS.

    THE MAIN BENEFIT IN THIS DEMO IS CODE ORGANIZATION, NOT PERFORMANCE.
*/

type Health = {
    current: number;
    max: number;
};

type DemoObject = GameObject & {
    health?: Health;
    healthTextObj?: TextObject;
    clickDamage?: number;
    poisonOnClick?: true;
    poisoned?: true;
    dead?: true;
};

type HealthObject = With<DemoObject, "health" | "healthTextObj">;
type ClickDamageObject = With<HealthObject, "clickDamage" | "poisonOnClick">;
type PoisonedObject = With<HealthObject, "poisoned">;
type DeadObject = With<DemoObject, "dead">;

type DemoQueries = {
    health: Query<HealthObject>;
    clickDamage: Query<ClickDamageObject>;
    poisoned: Query<PoisonedObject>;
    dead: Query<DeadObject>;
};

export class DemoECS extends Scene
{
    private world: World<DemoObject>;
    private queries: DemoQueries;
    
    private statsText: TextObject;
    private poisonTicksPerSecond = 6;
    private poisonCountdown = 0;
    private unsubscribers: (() => void)[] = [];
    
    async OnAwake()
    {
        rapid.setTextureFilter(TextureFilterMode.NEAREST); // SET TO NEAREST TO SHOW CRISP PIXEL ART

        await bare.asset.LoadTexture("player");
    }

    OnStart()
    {
        // CREATE THE ECS WORLD
        this.world = new World<DemoObject>();
        
        // SETUP QUERIES - USED TO GET OBJECTS WITH CERTAIN COMPONENTS
        const health = this.world.with("health", "healthTextObj");
        this.queries = {
            health,
            clickDamage: health.with("clickDamage", "poisonOnClick"),
            poisoned: health.with("poisoned"),
            dead: this.world.with("dead")
        };

        // REGISTER INPUT FOR OBJECTS THAT HAVE CLICK DAMAGE COMPONENTS
        this.unsubscribers.push(this.queries.clickDamage.onEntityAdded.subscribe(obj => {
            obj.OnPointerDown(() => {
                this.Damage(obj, obj.clickDamage);
                this.Poison(obj);
            });
        }));

        // CREATE CHARACTERS
        this.CreateCharacter("Character A", bare.width * .5, bare.height * .2, 50);
        this.CreateCharacter("Character B", bare.width * .5, bare.height * .45, 70);
        this.CreateCharacter("Character C", bare.width * .5, bare.height * .7, 100);

        // LISTEN TO DEATH EVENT - (COULD'VE BEEN UNDER KILL(), BUT PUT HERE TO SHOWCASE EVENTS)
        this.unsubscribers.push(this.queries.dead.onEntityAdded.subscribe(obj => {
            obj.OffPointers();
            obj.SetColor(Color.Gray);
            obj.rotation = 90;
        }));

        // STATS TEXT
        this.statsText = new TextObject(this, {
            text: "",
            fontSize: 16,
            fontFamily: "monospace",
            fill: "#222222"
        });
        this.AddGameObject(this.statsText)
            .SetPosition(bare.width * .5, bare.height - 50)
            .CenterPivot();
    }

    private CreateCharacter(name: string, x: number, y: number, maxHealth: number): void
    {
        // CREATE THE CHARACTER OBJECT
        const obj = this.AddGameObject<DemoObject>("player")
            .SetScale(5)
            .SetPosition(x, y)
            .CenterPivot();

        obj.name = name;

        // CREATE HEALTH TEXT OBJECT
        const healthTextObj = new TextObject(this, {
            text: "",
            fontSize: 24,
            fontFamily: "monospace",
            fill: "#222222"
        });
        this.AddGameObject(healthTextObj)
            .SetPosition(obj.x, obj.y + 80)
            .CenterPivot();

        // ASSIGN COMPONENTS
        obj.health = { current: maxHealth, max: maxHealth };
        obj.healthTextObj = healthTextObj;
        obj.clickDamage = 10;
        obj.poisonOnClick = true;

        // ADD TO WORLD
        this.world.add(obj);
    }

    OnFixedUpdate(fixedDeltaTime: number): void
    {
        // RUN THE SYSTEMS
        this.PoisonSystem(fixedDeltaTime);
        this.TextSystem();
        this.StatsSystem();
    }

    private PoisonSystem(fixedDeltaTime: number)
    {
        // APPLY POISON EVERY poisonTicksPerSecond
        this.poisonCountdown -= fixedDeltaTime;

        if (this.poisonCountdown <= 0)
        {
            for (const obj of [...this.queries.poisoned])
            {
                this.Damage(obj, 1);
            }

            this.poisonCountdown = 1 / this.poisonTicksPerSecond;
        }
    }

    private TextSystem()
    {
        for (const obj of this.queries.health)
        {
            this.SetHealthTextObj(obj, obj.poisoned ? "#2f7d32" : "#222222");
        }
    }

    private StatsSystem()
    {
        this.statsText.SetText(
            `Alive: ${this.queries.health.size} | Poisoned: ${this.queries.poisoned.size} | Dead: ${this.queries.dead.size}`
        );
    }

    private Damage(obj: HealthObject, amount: number)
    {
        obj.health.current = Math.max(0, obj.health.current - amount);

        if (obj.health.current <= 0)
            this.Kill(obj);
    }

    private Poison(obj: HealthObject)
    {
        if (obj.dead || obj.poisoned)
            return;

        this.world.addComponent(obj, "poisoned", true);
    }

    private Kill(obj: HealthObject)
    {
        if (obj.dead)
            return;

        this.SetHealthTextObj(obj, Color.Gray.toHex());

        this.world.addComponent(obj, "dead", true);
        this.world.removeComponent(obj, "poisoned");
        this.world.removeComponent(obj, "health");
    }

    private SetHealthTextObj(obj: HealthObject, fill: string)
    {
        obj.healthTextObj.textTexture.style = { fill };
        obj.healthTextObj.SetText(`${obj.name}: ${obj.health.current}/${obj.health.max}`);
    }

    OnClear(): void
    {
        this.unsubscribers.forEach(unsubscribe => unsubscribe());
        this.unsubscribers = [];

        this.world.clear();

        rapid.setTextureFilter(TextureFilterMode.LINEAR); // REVERT TO LINEAR, JUST SO IT'S ENABLED FOR OTHER DEMOS AGAIN
    }
}
