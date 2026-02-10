// Auto-generated from _entitydata.json - DO NOT EDIT
import { Layer, UILayer, SetLayers, SetUILayers, UI_LAYER } from "bare-engine";

const layers = {
  TOP: 0,
  EFFECTS: 1,
  WORLD_UI: 2,
  FOREGROUND: 3,
  COLLISION: 4,
  ARROWS: 5,
  OBJECTS: 6,
  TEST: 7,
  SHADOW: 8,
  SURFACE: 9,
  BACKGROUND: 10,
} as const;

const uiLayers = {
  UI: UI_LAYER,
  FADE: UI_LAYER + 1,
} as const;

declare module "bare-engine" {
  interface LayerMap {
    OBJECTS: number;
    TOP: number;
    EFFECTS: number;
    WORLD_UI: number;
    FOREGROUND: number;
    COLLISION: number;
    ARROWS: number;
    TEST: number;
    SHADOW: number;
    SURFACE: number;
    BACKGROUND: number;
  }
}

Object.assign(Layer, layers);
Object.assign(UILayer, uiLayers);

SetLayers(Layer);
SetUILayers(UILayer);
