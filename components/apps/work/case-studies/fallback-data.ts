import type { CaseStudy } from "@/types/work";

/** Shared markdown for The State Plate — work timeline detail + case study card. */
export const STATE_PLATE_BODY = `As a marketing associate at The State Plate, a regional Indian foods brand selling niche products from different states, my work spanned multiple domains.

→ web experience optimisation, customer journeys, social media, content strategy, performance marketing and event management [handled pretty much everything digital- website, app, emails, ads, plus offline events]

---

> **Driving adoption, lifecycle growth & operational efficiency for a regional D2C food brand**
>
> **D2C · Consumer · Product Marketing · Growth**

---

### Challenge

- Low adoption of owned channels (app + email), fragmented customer journeys, and operational inefficiencies impacting growth and retention.
- The app existed but had near-zero usage
- Email performance was declining due to infra issues
- Near-expiry inventory led to waste or reactive discounting
- Offline activations weren’t tied back to digital growth

---

### Approach

- Focused on fixing fundamentals before scaling growth, aligning product experience, lifecycle marketing, and offline touchpoints around clear user value.
- Treated adoption as an experience + positioning problem, not just awareness
- Prioritized lifecycle channels (app, email) as long-term growth levers
- Used operations constraints as opportunities for acquisition and engagement

---

### Actions

**App adoption & experience**

- Launched iOS app and cleaned up App Store / Play Store setup (analytics, listings, reviews)
- Identified UX blockers through direct user conversations
- Worked with dev team to fix navigation, login, checkout flows
- Redesigned website/app UI and tested changes via experimental Shopify themes
- Drove adoption via email CTAs, WhatsApp broadcasts, organic social, and QR-based offline incentives

**Email lifecycle reset**

- Diagnosed deliverability issues caused by spam signups
- Implemented CAPTCHA and cleaned tens of thousands of fake contacts
- Rebuilt email journeys with clearer copy, CTAs, and product recommendations
- Standardized templates and fixed sender reputation issues

**Near-expiry inventory → growth loop**

- Built a tiered system for at-risk inventory:

  - Checkout-based discounts
  - Free samples bundled with orders
  - Product sampling at corporate pop-ups

- Used sampling as a discovery and app acquisition channel

**Offline activations**

- Owned corporate pop-ups end-to-end
- Collected user data and funnelled traffic into app and email journeys

---

### Results

- **45x increase in app downloads**
- App contributed **~20% of total orders**
- Email open rates improved from **8–10% → 35–40%**
- Reduced inventory waste while generating incremental revenue
- Turned offline events into repeatable acquisition moments

---

### Key Learnings

- Adoption fails when experience doesn’t justify behaviour change
- Lifecycle marketing only works when the infrastructure is clean
- Operational problems can double as GTM opportunities
- For D2C, product, marketing, and ops are tightly intertwined`;

/** Used when Supabase table is missing or unreachable. */
export const FALLBACK_CASE_STUDIES: CaseStudy[] = [
  {
    id: "fallback-state-plate",
    slug: "state-plate-d2c",
    title: "The State Plate - D2C",
    subtitle: "D2C",
    description:
      "The State Plate is an Indian regional food products company…",
    icon: "🍽️",
    gradient_from: "#34C759",
    gradient_to: "#FF3B30",
    body: STATE_PLATE_BODY,
    tags: [
      { label: "Full-Time", color: "green" },
      { label: "App growth", color: "teal" },
    ],
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-liquide",
    slug: "liquide-fintech",
    title: "Liquide - Fintech",
    subtitle: "Fintech",
    description: "Liquide is a SEBI registered stock investment platform.",
    icon: "📈",
    gradient_from: "#5AC8FA",
    gradient_to: "#FF9F9A",
    body: `## Overview\n\nLiquide lets retail investors follow top performers and copy portfolios.\n\n## Outcomes\n\n- 35% increase in social feed engagement post-redesign`,
    tags: [{ label: "Internship", color: "purple" }],
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-hopstack",
    slug: "hopstack-b2b-saas",
    title: "Hopstack - B2B SaaS",
    subtitle: "B2B SaaS",
    description: "Hopstack is an advanced digital warehouse platform based in the US.",
    icon: "📦",
    gradient_from: "#007AFF",
    gradient_to: "#AF52DE",
    body: `## Overview\n\nHopstack helps 3PL providers manage inventory and shipping at scale.`,
    tags: [{ label: "Internship", color: "purple" }],
    sort_order: 3,
    published: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "fallback-freelance",
    slug: "freelance-assignments",
    title: "Freelance / Assignments",
    subtitle: "Agency",
    description: "F&B boutique agency and creative strategy work.",
    icon: "🎬",
    gradient_from: "#1C3A5E",
    gradient_to: "#34C759",
    body: `## Overview\n\nFreelance and assignment work across F&B boutique agencies.`,
    tags: [{ label: "Freelance", color: "blue" }],
    sort_order: 4,
    published: true,
    created_at: new Date().toISOString(),
  },
];
