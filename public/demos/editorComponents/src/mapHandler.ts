
import { events, LevelData } from "bare-engine";
import type { Events } from "bare-engine";

export type Direction = "top" | "right" | "bottom" | "left";

type Level = {
  connections: Partial<Record<Direction, string>>;
};

type LevelMap = Record<string, Level>;

export class MapHandler
{
    public map: LevelMap;
    public lastSavedMap: LevelData;

    constructor()
    {
      events.persistent.on('level_savedToDisk', this.OnLevelSaved.bind(this));
    }

    OnLevelSaved({ level }: Events['level_savedToDisk'])
    {
      if (bare.currentSettings.name == "mapEditor")
      {
        this.lastSavedMap = level;
      }
    }
    
    // FILLING UP this.map WITH RELEVANT DATA FROM LEVEL MAP
    FillLevelMap(levelMapJson:LevelData): void
    {
      this.map = {};

      var map:LevelData = levelMapJson;
      var entities = map.entitiesByLayer.OBJECTS;
      for (var entity of entities)
      {
        var levelName = entity.name;

        var connections:Partial<Record<Direction, string>> = {};
        this.map[levelName] = {connections: connections};

        var levelConnectorConnections = entity.editorComponents!.levelConnector;
        for (var direction in levelConnectorConnections)
        {
          var levelNameInDirection = levelConnectorConnections[direction as Direction];
          connections[direction as Direction] = levelNameInDirection;
        }
      }
    }

    GetLevelInDirectionFrom(fromLevel:string, direction: Direction): string
    {
      if (!this.map[fromLevel])
          return "";
        
      if (!this.map[fromLevel].connections)
          return "";

        var level = this.map[fromLevel].connections[direction];
        
        if (!level)
            return "";

        return level;
    }
}

export const mapHandler = new MapHandler();