// src/data/roundConfig.js
import { C } from "../styles/theme";

export const ROUND_CONFIG = [
  {
    round: 1,
    label: "ROUND 1",
    sublabel: "BASIC INFECTION",
    color: C.warn,
    germCount: 5,
    secs: 5,
    shieldChance: 0,
    fastChance: 0,
  },
  {
    round: 2,
    label: "ROUND 2",
    sublabel: "TOUGH INFECTION",
    color: C.danger,
    germCount: 6,
    secs: 5,
    shieldChance: 0.3,
    fastChance: 0,
  },
  {
    round: 3,
    label: "ROUND 3",
    sublabel: "SPREADING INFECTION",
    color: "#ff0033",
    germCount: 9,
    secs: 3,
    shieldChance: 0.4,
    fastChance: 0.25,
  },
];

export const MAX_SCORE = ROUND_CONFIG.reduce((s, r) => s + r.germCount, 0);