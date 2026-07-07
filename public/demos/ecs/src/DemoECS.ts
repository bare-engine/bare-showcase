import { Color, GameObject, Scene, TextObject, TextureFilterMode } from "bare-engine";
import { World, createQueue, type Query, type With } from "bare-engine";

type Health = {
    current: number;
    max: number;
};

type DemoEntity = GameObject & {
    health?: Health;
    healthTextObj?: TextObject;
    poisoned?: true;
    dead?: true;
};

type HealthEntity = With<DemoEntity, "health" | "healthTextObj">;
type PoisonedEntity = With<HealthEntity, "poisoned">;
type DeadEntity = With<DemoEntity, "dead">;

type DemoQueries = {
    health: Query<HealthEntity>;
    poisoned: Query<PoisonedEntity>;
    dead: Query<DeadEntity>;
};

export class DemoECS extends Scene
{
    private world: World<DemoEntity>;
    private queries: DemoQueries;
    private queue = createQueue();
    
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
        this.world = new World<DemoEntity>();
        
        const health = this.world.with("health", "healthTextObj");

        this.queries = {
            health,
            poisoned: health.with("poisoned"),
            dead: this.world.with("dead")
        };

        // POISON CLEANUP
        this.unsubscribers.push(this.queries.dead.onEntityAdded.subscribe(entity => {
            this.world.removeComponent(entity, "poisoned");
        }));

        // CORPSE VISUALS
        this.unsubscribers.push(this.queries.dead.onEntityAdded.subscribe(entity => {
            entity.OffPointers();
            entity.SetColor(Color.Gray);
            entity.rotation = 90;
        }));

        this.statsText = new TextObject(this, {
            text: "",
            fontSize: 22,
            fontFamily: "monospace",
            fill: "#222222"
        });
        this.AddGameObject(this.statsText)
            .SetPosition(bare.width * 0.5, 110)
            .CenterPivot();

        this.CreateCharacter("Character A", bare.width * .5, bare.height * .3, 100);
        this.CreateCharacter("Character B", bare.width * .5, bare.height * .55, 70);
        this.CreateCharacter("Character C", bare.width * .5, bare.height * .8, 50);

        this.UpdateTexts();
    }

    OnFixedUpdate(fixedDeltaTime: number): void
    {
        if (!this.queries)
            return;

        this.poisonCountdown -= fixedDeltaTime;

        if (this.poisonCountdown <= 0)
        {
            this.PoisonSystem();
            this.DeathSystem();
            this.UpdateTexts();

            this.poisonCountdown = 1 / this.poisonTicksPerSecond;
        }
    }

    private CreateCharacter(name: string, x: number, y: number, maxHealth: number): HealthEntity
    {
        const entity = this.AddGameObject<DemoEntity>("player")
            .SetScale(5)
            .SetPosition(x, y)
            .CenterPivot();
        
        entity.name = name;

        const healthTextObj = new TextObject(this, {
            text: "",
            fontSize: 24,
            fontFamily: "monospace",
            fill: "#222222"
        });
        this.AddGameObject(healthTextObj)
            .SetPosition(entity.x, entity.y + 80)
            .CenterPivot();

        // ASSIGN COMPONENTS BEFORE world.add() - PLAIN ASSIGNMENT AFTER ADD WON'T UPDATE QUERIES, ONLY world.addComponent() DOES
        entity.health = { current: maxHealth, max: maxHealth };
        entity.healthTextObj = healthTextObj;

        const healthEntity = this.world.add(entity) as HealthEntity;

        entity.OnPointerDown(() => {
            this.Damage(healthEntity, 10);
            this.Poison(healthEntity);
            this.DeathSystem();
            this.UpdateTexts();
        });

        return healthEntity;
    }

    private Damage(entity: { health: Health }, amount: number)
    {
        entity.health.current = Math.max(0, entity.health.current - amount);
    }

    private Poison(entity: HealthEntity)
    {
        this.world.addComponent(entity, "poisoned", true);
    }

    private PoisonSystem()
    {
        for (const entity of this.queries.poisoned) {
            this.Damage(entity, 1);
        }
    }

    private DeathSystem()
    {
        for (const entity of this.queries.health) {
            if (entity.health.current > 0)
                continue;

            // SET THE FINAL TEXT NOW, THE ENTITY LEAVES THE HEALTH QUERY AND WON'T BE RENDERED AGAIN
            this.SetHealthTextObj(entity, Color.Gray.toHex());

            this.world.addComponent(entity, "dead", true);
            this.world.removeComponent(entity, "health");
        }
    }

    private UpdateTexts()
    {
        this.SetHealthTextObjs();
        this.SetStats();
    }

    private SetHealthTextObjs()
    {
        for (const entity of this.queries.health) {
            this.SetHealthTextObj(entity, entity.poisoned ? "#2f7d32" : "#222222");
        }
    }

    private SetHealthTextObj(entity: HealthEntity, fill: string)
    {
        entity.healthTextObj.textTexture.style.fill = fill;
        entity.healthTextObj.SetText(`${entity.name}: ${entity.health.current}/${entity.health.max}`);
    }

    private SetStats()
    {
        this.statsText.SetText(
            `Alive: ${this.queries.health.size} | Poisoned: ${this.queries.poisoned.size} | Dead: ${this.queries.dead.size}`
        );
    }

    OnClear(): void
    {
        this.unsubscribers.forEach(unsubscribe => unsubscribe());
        this.unsubscribers = [];

        this.world.clear();

        rapid.setTextureFilter(TextureFilterMode.LINEAR); // REVERT TO LINEAR, JUST SO IT'S ENABLED FOR OTHER DEMOS AGAIN
    }
}
