import type { Message } from "@/types/messages";

/** Split newline-separated copy into separate bubbles (iMessage-style). */
export function expandMultilineMessages(messages: Message[]): Message[] {
  const expanded: Message[] = [];

  for (const message of messages) {
    if (message.sender === "system" || !message.content.includes("\n")) {
      expanded.push(message);
      continue;
    }

    const parts = message.content.split("\n");
    const baseTime = new Date(message.timestamp).getTime();

    parts.forEach((line, index) => {
      expanded.push({
        ...message,
        id: `${message.id}~${index}`,
        content: line,
        timestamp: new Date(baseTime + index * 500).toISOString(),
        reactions: index === 0 ? message.reactions : undefined,
      });
    });
  }

  return expanded;
}
