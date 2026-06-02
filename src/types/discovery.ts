// Discovery Carousel — system-admin pricing config.
//
// A flat fee per highlight impression (one impression = one franchise shown
// neon to one user on one day), the SAME for all plans, scheduled with date
// ranges by the platform owner. The rate active "today" is what gets snapshotted
// and LOCKED onto a merchant's opt-in. See docs/feature-discovery-carousel.md.

export interface DiscoveryHighlightPricing {
  id: string;
  feeCents: number; // flat fee per highlight impression (per user/day)
  startsAt: string; // ISO-8601 — inclusive
  endsAt: string; // ISO-8601 — exclusive
  createdAt: string; // ISO-8601
}

export interface CreateDiscoveryHighlightPricingInput {
  feeCents: number;
  startsAt: string;
  endsAt: string;
}
