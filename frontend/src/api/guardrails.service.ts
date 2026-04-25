import { delay } from "./client";

export interface GuardrailConfig {
  gate1: { enabled: boolean; words: string[] };
  gate2: { regexNormalization: boolean; leetspeakDetection: boolean };
  gate3: { toxicityThreshold: number; modelVersion: string };
}

const initial: GuardrailConfig = {
  gate1: {
    enabled: true,
    words: ["forbidden_term_1", "forbidden_term_2", "competitor_name"],
  },
  gate2: { regexNormalization: true, leetspeakDetection: true },
  gate3: { toxicityThreshold: 0.42, modelVersion: "guardrail-llm-v2.4" },
};

export const guardrailsService = {
  get: () => delay<GuardrailConfig>(initial),
  update: (cfg: GuardrailConfig) => delay<GuardrailConfig>(cfg),
};
