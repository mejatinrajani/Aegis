// Domain types shared across the app.
// Keep these minimal and aligned with what a Django REST backend would return.

export type Role = "admin" | "developer" | "viewer";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  streaming?: boolean;
  guardrailScanned?: boolean;
  flagged?: boolean;
  score?: number;
  imageUrl?: string; 
  reaction?: "like" | "dislike" | null;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type GuardrailStatus = "allowed" | "flagged" | "blocked";

export interface GuardrailDecision {
  gate: "gate1" | "gate2" | "gate3";
  status: GuardrailStatus;
  reason?: string;
  score?: number;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  userId: string;
  promptSnippet: string;
  status: GuardrailStatus;
  latencyMs: number;
  tokens: number;
}

export interface AlertItem {
  id: string;
  level: "info" | "warning" | "critical";
  title: string;
  description: string;
  timestamp: string;
  resolved?: boolean;
}

export interface ApiKey {
  id: string;
  label: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string;
  rateLimit: number; // req/min
  revoked?: boolean;
}

export interface UsageSnapshot {
  date: string;
  tokens: number;
  requests: number;
}
