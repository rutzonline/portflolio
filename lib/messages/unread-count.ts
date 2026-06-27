import {
  initialConversations,
  MESSAGES_SEED_VERSION,
} from "@/data/messages/initial-conversations";
import type { Conversation } from "@/types/messages";

const STORAGE_KEY = "dialogueConversations";
const DELETED_INITIAL_KEY = "dialogueDeletedInitialConversations";
const SEED_VERSION_KEY = "dialogueSeedVersion";

function loadDeletedInitialIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const raw = localStorage.getItem(DELETED_INITIAL_KEY);
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed) : new Set();
  } catch {
    return new Set();
  }
}

/** Mirrors Messages app localStorage merge — safe to call before Messages mounts. */
export function loadMessagesConversationsForBadge(): Conversation[] {
  if (typeof window === "undefined") return initialConversations;

  const storedSeedVersion = localStorage.getItem(SEED_VERSION_KEY);
  if (storedSeedVersion !== String(MESSAGES_SEED_VERSION)) {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.setItem(SEED_VERSION_KEY, String(MESSAGES_SEED_VERSION));
  }

  const deletedInitialIds = loadDeletedInitialIds();
  let allConversations = initialConversations.filter(
    (conv) => !deletedInitialIds.has(conv.id)
  );

  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return allConversations;

  try {
    const parsedConversations = JSON.parse(saved);
    if (!Array.isArray(parsedConversations)) return allConversations;

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
      modifiedInitialConversations.get(conv.id) ?? conv
    );
    return [...allConversations, ...userConversations];
  } catch {
    return allConversations;
  }
}

export function getMessagesUnreadCount(): number {
  return loadMessagesConversationsForBadge().reduce(
    (total, conv) => total + (conv.unreadCount || 0),
    0
  );
}
