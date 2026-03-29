export type MatchmakerLogEntry = {
  id: string;
  at: string;
  briefId: string;
  projectName: string;
  message: string;
  topMatches: { id: string; name: string; score: number }[];
};

declare global {
  // eslint-disable-next-line no-var
  var __skMatchmakerLogs: MatchmakerLogEntry[] | undefined;
}

const MAX_ENTRIES = 50;

function getStore(): MatchmakerLogEntry[] {
  if (!globalThis.__skMatchmakerLogs) {
    globalThis.__skMatchmakerLogs = [];
  }
  return globalThis.__skMatchmakerLogs;
}

export function appendMatchmakerLog(entry: Omit<MatchmakerLogEntry, 'id' | 'at'>): MatchmakerLogEntry {
  const full: MatchmakerLogEntry = {
    id: `mm-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    at: new Date().toISOString(),
    ...entry,
  };
  const store = getStore();
  store.unshift(full);
  if (store.length > MAX_ENTRIES) {
    store.length = MAX_ENTRIES;
  }
  return full;
}

export function getRecentMatchmakerLogs(limit = 20): MatchmakerLogEntry[] {
  const store = getStore();
  return store.slice(0, Math.min(Math.max(limit, 1), MAX_ENTRIES));
}
