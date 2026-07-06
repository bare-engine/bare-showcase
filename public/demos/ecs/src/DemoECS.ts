import { Color, ECSScene, GameObject, Scene, TextObject, TextureFilterMode, type Query, type With, type World } from "bare-engine";

type Health = {
    current: number;
    max: number;
};

type DemoEntity = GameObject & {
    label?: string;
    health?: Health;
    healthLabel?: TextObject;
    poisoned?: true;
    dead?: true;
};

type HealthEntity = With<DemoEntity, "label" | "health" | "healthLabel">;
type PoisonedEntity = With<HealthEntity, "poisoned">;
type DeadEntity = With<DemoEntity, "label" | "healthLabel" | "dead">;

type DemoQueries = {
    health: Query<HealthEntity>;
    poisoned: Query<PoisonedEntity>;
    dead: Query<DeadEntity>;
};

export class DemoECS extends ECSScene
{
    private world!: World<DemoEntity>;
    private queries!: DemoQueries;
    private statsText!: TextObject;
    private poisonTimer = 0;
    private unsubscribers: (() => void)[] = [];

    async OnAwake()
    {
        rapid.setTextureFilter(TextureFilterMode.NEAREST); // SET TO NEAREST TO SHOW CRISP PIXEL ART
        await bare.asset.LoadTexture("player");

    }

    OnStart()
    {
        this.world = this.worldECS as unknown as World<DemoEntity>;
        this.world.clear();
        
        const health = this.world.with("label", "health", "healthLabel");

        this.queries = {
            health,
            poisoned: health.with("poisoned"),
            dead: this.world.with("label", "healthLabel", "dead")
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

        this.createCharacter("Player", bare.width * 0.25, bare.height * 0.45, 100);
        this.createCharacter("Enemy A", bare.width * 0.5, bare.height * 0.45, 70);
        this.createCharacter("Enemy B", bare.width * 0.75, bare.height * 0.45, 50);

        this.renderECSState();
    }

    OnFixedUpdate(): void
    {
        if (!this.queries)
            return;

        this.poisonTimer++;

        if (this.poisonTimer >= 10) {
            this.poisonTimer = 0;
            this.poisonSystem();
            this.deathSystem();
            this.renderECSState();
        }
    }

    private createCharacter(label: string, x: number, y: number, maxHealth: number): HealthEntity
    {
        const entity = this.AddGameObject<DemoEntity>("player")
            .SetScale(5)
            .SetPosition(x, y)
            .CenterPivot();
        
        const healthLabel = new TextObject(this, {
            text: "",
            fontSize: 24,
            fontFamily: "monospace",
            fill: "#222222"
        });
        this.AddGameObject(healthLabel)
            .SetPosition(entity.x, entity.y + 80)
            .CenterPivot();

        entity.label = label;
        entity.health = { current: maxHealth, max: maxHealth };
        entity.healthLabel = healthLabel;

        const healthEntity = this.world.add(entity) as HealthEntity;

        entity.OnPointerDown(() => {
            this.damage(healthEntity, 10);
            this.poison(healthEntity);
            this.deathSystem();
            this.renderECSState();
        });

        return healthEntity;
    }

    private damage(entity: { health: Health }, amount: number)
    {
        entity.health.current = Math.max(0, entity.health.current - amount);
    }

    private poison(entity: HealthEntity)
    {
        this.world.addComponent(entity, "poisoned", true);
    }

    private poisonSystem()
    {
        for (const entity of this.queries.poisoned) {
            this.damage(entity, 1);
        }
    }

    private deathSystem()
    {
        for (const entity of this.queries.health) {
            if (entity.health.current > 0)
                continue;

            // BAKE THE FINAL LABEL NOW, THE ENTITY LEAVES THE HEALTH QUERY AND WON'T BE RENDERED AGAIN
            entity.healthLabel.textTexture.style.fill = Color.Gray.toHex();
            entity.healthLabel.SetText(`${entity.label}: 0/${entity.health.max}`);

            this.world.addComponent(entity, "dead", true);
            this.world.removeComponent(entity, "health");
        }
    }

    private renderECSState()
    {
        this.renderHealthLabels();
        this.renderStats();
    }

    private renderHealthLabels()
    {
        for (const entity of this.queries.health) {
            entity.healthLabel.textTexture.style.fill = entity.poisoned ? "#2f7d32" : "#222222";
            entity.healthLabel.SetText(`${entity.label}: ${entity.health.current}/${entity.health.max}`);
        }
    }

    private renderStats()
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
