import {
  initialConversations,
  MESSAGES_SEED_VERSION,
} from "@/data/messages/initial-conversations";
import type { Conversation } from "@/types/messages";

const STORAGE_KEY = "dialogueConversations";
const DELETED_INITIAL_KEY = "dialogueDeletedInitialConversations";
const SEED_VERSION_KEY = "dialogueSeedVersion";

let cachedConversations: Conversation[] | null = null;

export function invalidateStoredConversationsCache(): void {
  cachedConversations = null;
}

export function loadStoredConversations(): Conversation[] {
  if (cachedConversations) return cachedConversations;
  if (typeof window === "undefined") return initialConversations;

  const storedSeedVersion = localStorage.getItem(SEED_VERSION_KEY);
  if (storedSeedVersion !== String(MESSAGES_SEED_VERSION)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(SEED_VERSION_KEY, String(MESSAGES_SEED_VERSION));
    cachedConversations = null;
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  const deletedInitialRaw = localStorage.getItem(DELETED_INITIAL_KEY);

  let deletedInitialIds: Set<string> = new Set();
  if (deletedInitialRaw) {
    try {
      const parsed = JSON.parse(deletedInitialRaw);
      if (Array.isArray(parsed)) {
        deletedInitialIds = new Set(parsed);
      }
    } catch {
      // Ignore parse errors
    }
  }

  let allConversations = initialConversations.filter(
    (conv) => !deletedInitialIds.has(conv.id)
  );

  if (saved) {
    try {
      const parsedConversations = JSON.parse(saved);

      if (Array.isArray(parsedConversations)) {
        const initialIds = new Set(initialConversations.map((conv) => conv.id));
        const userConversations: Conversation[] = [];
        const modifiedInitialConversations = new Map<string, Conversation>();

        for (const savedConv of parsedConversations) {
          if (initialIds.has(savedConv.id)) {
            modifiedInitialConversations.set(savedConv.id, savedConv);
          } else {
            userConversations.push(savedConv);
          }
        }

        allConversations = allConversations.map((conv) =>
          modifiedInitialConversations.has(conv.id)
            ? modifiedInitialConversations.get(conv.id)!
            : conv
        );

        allConversations = [...allConversations, ...userConversations];
      }
    } catch {
      // Keep seeded conversations on parse failure
    }
  }

  cachedConversations = allConversations;
  return allConversations;
}

export function touchStoredConversationsCache(conversations: Conversation[]): void {
  cachedConversations = conversations;
}
