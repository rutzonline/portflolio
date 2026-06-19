// Static persona conversations — no AI/API needed
// Bump MESSAGES_SEED_VERSION when copy changes to reset cached localStorage threads.

import { Conversation } from "@/types/messages";

/** Increment to force-refresh seeded conversations in the browser. */
export const MESSAGES_SEED_VERSION = 9;

/** Open this thread by default when Messages loads (desktop). */
export const MESSAGES_DEFAULT_CONVERSATION_ID = "conv-elena-002";

export const initialConversations: Conversation[] = [
  {
    id: "conv-alex-hr-001",
    unreadCount: 0,
    pinned: true,
    lastMessageTime: "2025-06-13T10:06:00.000Z",
    recipients: [{ id: "alex-hr-id", name: "alex hr" }],
    messages: [
      {
        id: "ah-001",
        content:
          "great chatting rutuja. one last thing, what are you most looking forward to right now?",
        sender: "alex hr",
        timestamp: "2025-06-13T10:00:00.000Z",
      },
      {
        id: "ah-002",
        content: "oh, brazil vs morocco!!",
        sender: "me",
        timestamp: "2025-06-13T10:01:00.000Z",
      },
      {
        id: "ah-003",
        content: "ah, that's nice. i meant career wise ...",
        sender: "alex hr",
        timestamp: "2025-06-13T10:02:00.000Z",
      },
      {
        id: "ah-004",
        content:
          "oh right 😅 i'm pretty excited to get back to working on marketing projects and i'd love to take on content and growth roles and help grow a brand!",
        sender: "me",
        timestamp: "2025-06-13T10:03:00.000Z",
        reactions: [
          {
            type: "like",
            sender: "alex hr",
            timestamp: "2025-06-13T10:03:30.000Z",
          },
        ],
      },
      {
        id: "ah-005",
        content: "fair enough. we'll be in touch.",
        sender: "alex hr",
        timestamp: "2025-06-13T10:04:00.000Z",
      },
      {
        id: "ah-006",
        content: "sure :)",
        sender: "me",
        timestamp: "2025-06-13T10:06:00.000Z",
      },
    ],
  },
  {
    id: "conv-elena-002",
    unreadCount: 0,
    pinned: true,
    lastMessageTime: "2025-06-10T14:35:00.000Z",
    recipients: [{ id: "elena-id", name: "elena lovable" }],
    messages: [
      {
        id: "e-001",
        content: "WOAH, strong headline today! am i really gonna lose my job in 2027? 😭",
        sender: "me",
        timestamp: "2025-06-10T14:28:00.000Z",
      },
      {
        id: "e-002",
        content:
          "ahaha yes, i realised that and changed it later.\nthe article, however, is quite positive all about how you can take control of your career.\nhopefully you give it a read!",
        sender: "elena lovable",
        timestamp: "2025-06-10T14:29:00.000Z",
      },
      {
        id: "e-003",
        content:
          "i did, and honestly it's valuable for anyone who actually reads it\nand hey, after all, we're all optimising for what makes the audience open our emails :) ",
        sender: "me",
        timestamp: "2025-06-10T14:31:00.000Z",
        reactions: [
          {
            type: "heart",
            sender: "elena lovable",
            timestamp: "2025-06-10T14:31:30.000Z",
          },
        ],
      },
      {
        id: "e-004",
        content:
          "haha fair enough. don't forget to attend the next shebuilds hackathon.",
        sender: "elena lovable",
        timestamp: "2025-06-10T14:33:00.000Z",
      },
      {
        id: "e-005",
        content: "already registered! ",
        sender: "me",
        timestamp: "2025-06-10T14:35:00.000Z",
      },
    ],
  },
  {
    id: "conv-lenny-003",
    unreadCount: 0,
    pinned: true,
    lastMessageTime: "2025-06-05T11:22:00.000Z",
    recipients: [{ id: "lenny-id", name: "lenny rachitsky" }],
    messages: [
      {
        id: "l-001",
        content:
          "lenny, what the heck is a gtm engineer now? i've been seeing it all over, thanks to clay..",
        sender: "me",
        timestamp: "2025-06-05T11:15:00.000Z",
      },
      {
        id: "l-002",
        content:
          "haha ofc you are, they're the ones who coined the term after all.\nbut hey, i had a conversation with jeanne from vercel the other day and you might find it helpful in order to understand more about this.",
        sender: "lenny rachitsky",
        timestamp: "2025-06-05T11:17:00.000Z",
        reactions: [
          {
            type: "emphasize",
            sender: "me",
            timestamp: "2025-06-05T11:17:30.000Z",
          },
        ],
      },
      {
        id: "l-003",
        content: "oh, that's amazing, have you posted it yet?",
        sender: "me",
        timestamp: "2025-06-05T11:19:00.000Z",
      },
      {
        id: "l-004",
        content:
          "halfway done, checkout the youtube channel in a while and it should be there.",
        sender: "lenny rachitsky",
        timestamp: "2025-06-05T11:20:00.000Z",
      },
      {
        id: "l-005",
        content: "sure thing!",
        sender: "me",
        timestamp: "2025-06-05T11:22:00.000Z",
      },
    ],
  },
  {
    id: "conv-yatha-004",
    unreadCount: 0,
    pinned: false,
    lastMessageTime: "2025-05-28T21:48:00.000Z",
    recipients: [{ id: "yatha-id", name: "yatha" }],
    messages: [
      {
        id: "y-001",
        content: "babe i have nothing to wear",
        sender: "yatha",
        timestamp: "2025-05-28T21:30:00.000Z",
      },
      {
        id: "y-002",
        content: "oooh, where are we headed to?",
        sender: "me",
        timestamp: "2025-05-28T21:31:00.000Z",
      },
      {
        id: "y-003",
        content: "office... i just got back from spain, i have nowhere to go now 🙏",
        sender: "yatha",
        timestamp: "2025-05-28T21:32:00.000Z",
      },
      {
        id: "y-004",
        content: "right, and you still havent sent me the pictures just btw",
        sender: "me",
        timestamp: "2025-05-28T21:33:00.000Z",
      },
      {
        id: "y-005",
        content:
          "oh shoot, my bad. you know how things get sometimes...\nhere you go!",
        sender: "yatha",
        timestamp: "2025-05-28T21:35:00.000Z",
      },
      {
        id: "y-006",
        content: "bro, these are lovely, how i wish i could be there too :(",
        sender: "me",
        timestamp: "2025-05-28T21:37:00.000Z",
        reactions: [
          {
            type: "heart",
            sender: "yatha",
            timestamp: "2025-05-28T21:37:30.000Z",
          },
        ],
      },
      {
        id: "y-007",
        content: "IKR! but dw we're planning one soon",
        sender: "yatha",
        timestamp: "2025-05-28T21:40:00.000Z",
      },
      {
        id: "y-008",
        content: "right.. pls wear the blue button down you look amazing in it",
        sender: "me",
        timestamp: "2025-05-28T21:44:00.000Z",
      },
      {
        id: "y-009",
        content: "oh yes! i'd completely forgotten about that one! thanks babe",
        sender: "yatha",
        timestamp: "2025-05-28T21:46:00.000Z",
      },
      {
        id: "y-010",
        content: "pls leave it's 9:48 alreadyyy",
        sender: "me",
        timestamp: "2025-05-28T21:48:00.000Z",
      },
    ],
  },
  {
    id: "conv-sibling-1-007",
    unreadCount: 1,
    pinned: false,
    lastMessageTime: "2025-05-20T18:10:00.000Z",
    recipients: [{ id: "sibling-1-id", name: "sibling 1" }],
    messages: [
      {
        id: "sis-001",
        content: "are you coming home this weekend",
        sender: "sibling 1",
        timestamp: "2025-05-20T18:00:00.000Z",
      },
      {
        id: "sis-002",
        content: "idk, maybe",
        sender: "me",
        timestamp: "2025-05-20T18:01:00.000Z",
      },
      {
        id: "sis-003",
        content: "ok, your loss.",
        sender: "sibling 1",
        timestamp: "2025-05-20T18:02:00.000Z",
      },
      {
        id: "sis-004",
        content: "what does that mean?",
        sender: "me",
        timestamp: "2025-05-20T18:03:00.000Z",
      },
      {
        id: "sis-005",
        content: "nothing, i was just planning on returning that top of yours",
        sender: "sibling 1",
        timestamp: "2025-05-20T18:04:00.000Z",
      },
      {
        id: "sis-006",
        content: "WHICH TOP",
        sender: "me",
        timestamp: "2025-05-20T18:05:00.000Z",
      },
      {
        id: "sis-007",
        content: "the one that you gave me",
        sender: "sibling 1",
        timestamp: "2025-05-20T18:06:00.000Z",
      },
      {
        id: "sis-008",
        content: "I NEVER GAVE YOU ANY OF MY TOPS",
        sender: "me",
        timestamp: "2025-05-20T18:07:00.000Z",
      },
      {
        id: "sis-009",
        content: "oh, it must've slipped in my bag then..",
        sender: "sibling 1",
        timestamp: "2025-05-20T18:08:00.000Z",
      },
      {
        id: "sis-010",
        content: "wow.\ni'm so not getting that bag for you.",
        sender: "me",
        timestamp: "2025-05-20T18:09:00.000Z",
      },
      {
        id: "sis-011",
        content: "nooooooo, i'm sorry, i'll courier it to you asapppp",
        sender: "sibling 1",
        timestamp: "2025-05-20T18:10:00.000Z",
        reactions: [
          {
            type: "laugh",
            sender: "me",
            timestamp: "2025-05-20T18:10:30.000Z",
          },
        ],
      },
    ],
  },
  {
    id: "conv-jules-content-005",
    unreadCount: 0,
    pinned: false,
    lastMessageTime: "2025-05-17T16:42:00.000Z",
    recipients: [{ id: "jules-content-id", name: "jules content" }],
    messages: [
      {
        id: "jc-001",
        content: "coffee next week? we need to discuss the strategy for the newsletter?",
        sender: "jules content",
        timestamp: "2025-05-17T16:38:00.000Z",
      },
      {
        id: "jc-002",
        content: "sure, let me know what time works for you!",
        sender: "me",
        timestamp: "2025-05-17T16:42:00.000Z",
      },
    ],
  },
  {
    id: "conv-sibling-2-008",
    unreadCount: 1,
    pinned: false,
    lastMessageTime: "2025-05-12T09:10:00.000Z",
    recipients: [{ id: "sibling-2-id", name: "sibling 2" }],
    messages: [
      {
        id: "bro-001",
        content: "bro did you watch the game last night",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:00:00.000Z",
      },
      {
        id: "bro-002",
        content: "3 red cards. THREE.",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:01:00.000Z",
        reactions: [
          {
            type: "emphasize",
            sender: "me",
            timestamp: "2025-05-12T09:01:30.000Z",
          },
        ],
      },
      {
        id: "bro-003",
        content: "yeah... we're off to a great start",
        sender: "me",
        timestamp: "2025-05-12T09:02:00.000Z",
      },
      {
        id: "bro-004",
        content: "imma start rooting for sa",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:03:00.000Z",
      },
      {
        id: "bro-005",
        content: "......you're weird",
        sender: "me",
        timestamp: "2025-05-12T09:04:00.000Z",
      },
      {
        id: "bro-006",
        content: "they ended with 9 men",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:05:00.000Z",
      },
      {
        id: "bro-007",
        content: "i stand by it",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:06:00.000Z",
      },
      {
        id: "bro-008",
        content: "also can you please send 500 real quick, i need it urgently pretty please",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:07:00.000Z",
      },
      {
        id: "bro-009",
        content: "i'm a mere cash cow for you guys isnt it?",
        sender: "me",
        timestamp: "2025-05-12T09:08:00.000Z",
      },
      {
        id: "bro-010",
        content: "noooooo, you're the best sister ever",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:09:00.000Z",
      },
      {
        id: "bro-011",
        content: "yeah save it",
        sender: "me",
        timestamp: "2025-05-12T09:09:30.000Z",
      },
      {
        id: "bro-012",
        content: "wanna bet on france vs senegal, s'il vous plait?",
        sender: "sibling 2",
        timestamp: "2025-05-12T09:10:00.000Z",
      },
    ],
  },
  {
    id: "conv-dad-009",
    unreadCount: 0,
    pinned: false,
    lastMessageTime: "2025-04-24T20:14:00.000Z",
    recipients: [{ id: "dad-id", name: "dad" }],
    messages: [
      {
        id: "d-001",
        content: "your sister was crying because she lost her purse today",
        sender: "dad",
        timestamp: "2025-04-24T20:10:00.000Z",
      },
      {
        id: "d-002",
        content: "she was in a crisis...",
        sender: "dad",
        timestamp: "2025-04-24T20:12:00.000Z",
      },
      {
        id: "d-003",
        content: "ok, i'll give it you... good one.",
        sender: "me",
        timestamp: "2025-04-24T20:14:00.000Z",
      },
    ],
  },
  {
    id: "conv-mom-010",
    unreadCount: 0,
    pinned: false,
    lastMessageTime: "2025-04-08T07:52:00.000Z",
    recipients: [{ id: "mom-id", name: "mom" }],
    messages: [
      {
        id: "m-001",
        content:
          "can you make me a video edit of you for your birthday whatsapp status please?",
        sender: "mom",
        timestamp: "2025-04-08T07:48:00.000Z",
      },
      {
        id: "m-002",
        content: ".....😭mom",
        sender: "me",
        timestamp: "2025-04-08T07:52:00.000Z",
      },
    ],
  },
];
