export type TeaType = "green" | "white" | "oolong" | "black" | "puerh-raw" | "puerh-ripe" | "yellow";

export type RoastLevel = "none" | "light" | "medium" | "heavy";

export interface BrewingParameters {
  waterTempCelsius: number;
  teaAmountGrams: number;
  waterVolumeMl: number;
  infusionCount: { min: number; max: number };
  baseSteepSeconds: number;
  steepIncrementSeconds: number;
}

export interface Tea {
  id: string;
  name: string;
  type: TeaType;
  origin: string;
  roastLevel: RoastLevel;
  description: string;
  tip: string;
  brewingParameters: BrewingParameters;
  flavorProfile: string[];
  isCustom: boolean;
}

export function createCustomTea(partial?: Partial<Tea>): Tea {
  return {
    id: crypto.randomUUID(),
    name: "",
    type: "green",
    origin: "",
    roastLevel: "none",
    description: "",
    tip: "",
    brewingParameters: {
      waterTempCelsius: 90,
      teaAmountGrams: 5,
      waterVolumeMl: 150,
      infusionCount: { min: 3, max: 6 },
      baseSteepSeconds: 15,
      steepIncrementSeconds: 5,
    },
    flavorProfile: [],
    isCustom: true,
    ...partial,
  };
}
