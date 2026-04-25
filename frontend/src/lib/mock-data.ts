import type {
  AlertItem,
  ApiKey,
  Conversation,
  HistoryEntry,
  UsageSnapshot,
  User,
} from "@/types";

// Centralized mock data so all routes look "alive" without a backend.

export const mockUser: User = {
  id: "u_001",
  email: "alex.morgan@aegisguard.io",
  name: "Alex Morgan",
  role: "admin",
  createdAt: "2024-08-12T10:00:00Z",
};

export const mockConversations: Conversation[] = [
  {
    id: "c_1",
    title: "Toxicity threshold tuning",
    updatedAt: "2025-04-22T14:30:00Z",
    messages: [
      {
        id: "m_1",
        role: "user",
        content: "What's the recommended toxicity threshold for customer support?",
        createdAt: "2025-04-22T14:28:00Z",
      },
      {
        id: "m_2",
        role: "assistant",
        content:
          "For customer support contexts, a threshold of 0.35–0.45 typically balances safety with conversational fluency. Stricter thresholds (≤0.3) can produce false positives on emotionally charged but legitimate complaints.",
        createdAt: "2025-04-22T14:28:30Z",
        guardrailScanned: true,
      },
    ],
  },
  {
    id: "c_2",
    title: "Regex normalization patterns",
    updatedAt: "2025-04-21T09:14:00Z",
    messages: [],
  },
  {
    id: "c_3",
    title: "Webhook retry strategy",
    updatedAt: "2025-04-19T16:42:00Z",
    messages: [],
  },
];

export const mockHistory: HistoryEntry[] = Array.from({ length: 24 }).map((_, i) => {
  const statuses: HistoryEntry["status"][] = ["allowed", "allowed", "allowed", "flagged", "blocked"];
  return {
    id: `h_${i + 1}`,
    timestamp: new Date(Date.now() - i * 1000 * 60 * 17).toISOString(),
    userId: `usr_${(1000 + i).toString(36)}`,
    promptSnippet:
      [
        "Summarize the Q3 revenue report",
        "Translate the onboarding email to Spanish",
        "Write a python script that scrapes…",
        "Explain the difference between TLS 1.2 and 1.3",
        "Generate a SQL query to find churned users",
      ][i % 5],
    status: statuses[i % statuses.length],
    latencyMs: 180 + Math.floor(Math.random() * 420),
    tokens: 240 + Math.floor(Math.random() * 1800),
  };
});

export const mockAlerts: AlertItem[] = [
  {
    id: "a_1",
    level: "warning",
    title: "Latency spike on Gate 3",
    description: "p95 latency exceeded 800ms for 4 minutes.",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "a_2",
    level: "critical",
    title: "Unusual blocking rate",
    description: "Block rate jumped to 14.2% (baseline 3.1%).",
    timestamp: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
  },
  {
    id: "a_3",
    level: "info",
    title: "New model version available",
    description: "guardrail-llm v2.4.1 is ready to deploy.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    resolved: true,
  },
];

export const mockApiKeys: ApiKey[] = [
  {
    id: "k_1",
    label: "Production",
    prefix: "ag_live_8f2c",
    createdAt: "2025-01-12T10:00:00Z",
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    rateLimit: 600,
  },
  {
    id: "k_2",
    label: "Staging",
    prefix: "ag_test_a912",
    createdAt: "2025-02-04T15:22:00Z",
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    rateLimit: 120,
  },
];

export const mockUsage: UsageSnapshot[] = Array.from({ length: 14 }).map((_, i) => ({
  date: new Date(Date.now() - (13 - i) * 1000 * 60 * 60 * 24).toISOString().slice(0, 10),
  tokens: 80_000 + Math.floor(Math.random() * 60_000),
  requests: 1200 + Math.floor(Math.random() * 900),
}));

export const mockTeamUsers: User[] = [
  mockUser,
  {
    id: "u_002",
    email: "priya.shah@aegisguard.io",
    name: "Priya Shah",
    role: "developer",
    createdAt: "2024-11-02T09:30:00Z",
  },
  {
    id: "u_003",
    email: "diego.alvarez@aegisguard.io",
    name: "Diego Alvarez",
    role: "developer",
    createdAt: "2025-01-18T11:12:00Z",
  },
  {
    id: "u_004",
    email: "noor.haddad@aegisguard.io",
    name: "Noor Haddad",
    role: "viewer",
    createdAt: "2025-02-25T13:48:00Z",
  },
];
