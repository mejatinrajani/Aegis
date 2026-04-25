import { delay } from "./client";
import { mockHistory, mockUsage } from "@/lib/mock-data";
import type { HistoryEntry, UsageSnapshot } from "@/types";

export const analyticsService = {
  listHistory: () => delay<HistoryEntry[]>(mockHistory),
  getUsage: () => delay<UsageSnapshot[]>(mockUsage),
  getMetrics: () =>
    delay({
      tokensProcessed: 4_812_344,
      messagesBlocked: 1_283,
      avgLatencyMs: 412,
      requestsToday: 18_204,
    }),
};
