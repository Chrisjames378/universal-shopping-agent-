/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExecutionPlan, UserAccount, PayPalSubscription, SubscriptionPlan, RenewalNotification } from "../types";

// Client-side fallback for deconstructing raw intent queries when running on static hosts like Vercel
export function deconstructQueryClient(query: string): ExecutionPlan {
  const isVegan = /vegan/i.test(query);
  const isGf = /gluten|gf/i.test(query);
  const isPizza = /pizza/i.test(query);
  const isMacbook = /macbook|laptop|ebay|apple/i.test(query);
  const isFlight = /flight|delta|airline|seat/i.test(query);
  
  const matchedPrice = query.match(/\$?(\d+)/);
  const budget = matchedPrice ? parseFloat(matchedPrice[1]) : (isMacbook ? 1400 : isFlight ? 450 : 25);

  const intent: ExecutionPlan["intent_classification"] = 
    /order|buy|checkout|hold|purchase/i.test(query) ? "purchase" :
    /search|find|check|look/i.test(query) ? "browse" : "research";

  let attributes = ["near downtown"];
  if (isVegan) attributes.push("vegan");
  if (isGf) attributes.push("gluten-free");
  if (isMacbook) attributes = ["Space Grey", "M3 Chip", "Merchant rating > 98%", "Under $1400"];
  if (isFlight) attributes = ["Business Class", "Aisle Seat", "Hold Seat Lock", "Text Notice"];

  const steps: ExecutionPlan["execution_steps"] = isMacbook ? [
    {
      step_id: 1,
      action_type: "NAVIGATE",
      technical_details: "Initialize stealth browser profile with randomized desktop viewport and residential proxy IP. Navigating to eBay catalog target.",
      target_element_desc: "E-Commerce Search Bar"
    },
    {
      step_id: 2,
      action_type: "FILTER",
      technical_details: "Input query 'MacBook Pro M3 Space Grey'. Apply seller rating filter (>98% positive feedback) and max price slider set to $1400.",
      target_element_desc: "Filter Panel & Price Input"
    },
    {
      step_id: 3,
      action_type: "VISION_SCAN",
      technical_details: "Execute multimodal visual scanning on product listing cards. Detect condition tags ('Excellent - Refurbished' or 'New') and inspect seller verification badges.",
      target_element_desc: "Product Result Grid"
    },
    {
      step_id: 4,
      action_type: "SELECT_ITEM",
      technical_details: "Target top matching listing with lowest price and highest seller score. Trigger human-like cursor trajectory to item detail node.",
      target_element_desc: "Item Detail Link Node"
    },
    {
      step_id: 5,
      action_type: "ADD_TO_CART",
      technical_details: "Verify item specs via OCR bounding box analysis. Execute smooth click on 'Buy It Now' / 'Add to Cart' CTA.",
      target_element_desc: "Buy It Now Primary CTA"
    },
    {
      step_id: 6,
      action_type: "HUMAN_APPROVAL_WAIT",
      technical_details: "Halt automation at final checkout payment stage. Transmit payload and confirmation prompt to end-user for biometric authorization.",
      target_element_desc: "Checkout Review Screen"
    }
  ] : isFlight ? [
    {
      step_id: 1,
      action_type: "NAVIGATE",
      technical_details: "Spin up headless browser with custom TLS fingerprint. Load airline reservation portal for Flight DL122.",
      target_element_desc: "Flight Status Viewport"
    },
    {
      step_id: 2,
      action_type: "VISION_SCAN",
      technical_details: "Perform visual segmentation on interactive seat matrix overlay. Identify available Business Class aisle seats.",
      target_element_desc: "Interactive Seat Map Canvas"
    },
    {
      step_id: 3,
      action_type: "SELECT_ITEM",
      technical_details: "Select target aisle seat in Business cabin via calculated pixel coordinates and synthetic click gesture.",
      target_element_desc: "Seat Node B3 (Aisle)"
    },
    {
      step_id: 4,
      action_type: "SECURE_CHECKOUT",
      technical_details: "Place 24-hour complimentary seat hold. Inject user contact info programmatically.",
      target_element_desc: "Hold Reservation Form"
    },
    {
      step_id: 5,
      action_type: "HUMAN_APPROVAL_WAIT",
      technical_details: "Trigger SMS webhook notification with seat confirmation link. Await user payment sign-off.",
      target_element_desc: "Webhook Dispatch Node"
    }
  ] : [
    {
      step_id: 1,
      action_type: "NAVIGATE",
      technical_details: "Initialize stealth coordinate profile with randomized user-agent. Target food delivery directory for service routing.",
      target_element_desc: "Default viewport index"
    },
    {
      step_id: 2,
      action_type: "VISION_SCAN",
      technical_details: "Execute multimodal segmentation on current viewport. Draw overlay boundaries for food listings matching dietary attributes.",
      target_element_desc: "Merchant result container list"
    },
    {
      step_id: 3,
      action_type: "FILTER",
      technical_details: `Click on 'Under $${budget}' pricing range selector by simulating a realistic spline cursor transition.`,
      target_element_desc: "Price slider or quick filter token"
    },
    {
      step_id: 4,
      action_type: "SELECT_ITEM",
      technical_details: "Trigger targeted focus onto the highest rated matching listing, capturing bounding box geometry for the dynamic click event.",
      target_element_desc: isPizza ? "Listing with label 'Gluten-Free Crust Special Pizza'" : "Matching store item card"
    },
    {
      step_id: 5,
      action_type: "ADD_TO_CART",
      technical_details: "Locate primary order/add CTA utilizing OCR text-matching overlay, clicking target precisely with synthetic touch gesture.",
      target_element_desc: "Submit order or Add to basket button"
    },
    {
      step_id: 6,
      action_type: "HUMAN_APPROVAL_WAIT",
      technical_details: "Enforce state lockout. Broadcast push-notification webhook to end-user with details, awaiting signed biometric consent.",
      target_element_desc: "Final interactive payment screen"
    }
  ];

  return {
    intent_classification: intent,
    extracted_constraints: {
      budget,
      currency: "USD",
      attributes,
      raw_query: query
    },
    execution_steps: steps,
    risk_assessment: {
      bot_detection_probability: isMacbook || isFlight ? "HIGH" : "MEDIUM",
      anti_bot_triggers: [
        "Kasada device fingerprinting",
        "reCAPTCHA v3 score-checking",
        "Dynamic Canvas tracking"
      ],
      requires_human_approval: true
    }
  };
}

// Client-side fallback for Chief Systems Architect replies
export function getArchitectReplyClient(msg: string): string {
  const text = msg.toLowerCase();
  if (text.includes("dom") || text.includes("brittle") || text.includes("scrape")) {
    return "**Dynamic DOM Parsing and Perception:**\nRather than parsing brittle HTML IDs or CSS selectors, our architecture employs standard high-fidelity screenshots converted to low-dimensional vector maps. By combining high-definition coordinates with optical-character-recognition (OCR) and YOLO segmentation on the browser viewport, our agent clicks based on **perceptual positions** rather than underlying HTML structure. This completely bypasses developer updates!";
  }
  if (text.includes("proxy") || text.includes("cloudflare") || text.includes("akamai") || text.includes("bot")) {
    return "**Stealth Anti-Bot Mitigation:**\nWe prevent Cloudflare, Akamai, and Kasada blockouts at three levels:\n1. **Network level:** Routing all headless requests through high-speed, dynamic residential proxies with residential ISPs.\n2. **Handshake level:** Spoofing client TLS ja3 hash signatures in compiled Go/Rust proxies to perfectly match premium consumer devices.\n3. **Human Simulation:** Rather than straight-line mouse events, we emit bezier-curves with dynamic acceleration and randomized rest-frames to perfectly match organic hand jitter.";
  }
  if (text.includes("vault") || text.includes("card") || text.includes("security") || text.includes("payment")) {
    return "**The Blind Vault Pattern:**\nTo eliminate the vulnerability of LLM prompt injections (where an attacker manipulates the bot to spill its core memory), we isolated the financial credential store entirely. The agent navigates, fills out non-sensitive fields, and targets the checkout. When fields are active, a dedicated local crypt-process programmatically injects credit details on a localized Unix socket. The main AI agent never sees, reads, or holds the credentials in its context window.";
  }
  return "That is an excellent design question. As our core systems architecture evolves, we represent the Agent as a hybrid controller: standard business logic manages the strict deterministic gates (state validation, network handshakes, payment vault), while the Multimodal LLM behaves as the high-level Planner. This guarantees 100% predictability for checkout executions while scaling perfectly across millions of disparate e-commerce sites.";
}

// Client-side fallback for Multi-Platform Ad analysis (X, Facebook, TikTok, Amazon, eBay)
export function getGrokAnalysisClient(adCopy: string, targetAudience?: string, platform: string = "x") {
  const p = platform.toLowerCase();

  if (p === "facebook") {
    return {
      sentiment: "High Meta Conversion Intent",
      trend_alignment: "Optimal (92%)",
      score: 88,
      analysis: `Your Facebook/Meta ad copy addresses ${targetAudience || "your target"} audiences effectively. Structuring with a clear 1-line hook, social proof bullet points, and a single high-contrast Call-To-Action will improve CTR by 25-40%.`,
      improvements: [
        "Include a strong opening hook line before the 'See More' fold (first 125 characters)",
        "Add clear social proof (e.g. 'Rated 4.9/5 by 2,000+ happy buyers')",
        "Specify the exact Meta CTA Button label ('Shop Now' or 'Get Offer')"
      ],
      revised_copy_suggestions: [
        `Tired of high prices? 🛍️ Discover our top-rated collections built for ${targetAudience || "shoppers"}. Fast shipping & 30-day money-back guarantee. Click 'Shop Now' below to claim 15% off your first order! 👇`,
        `Transform your routine with our viral collection. Over 5,000+ satisfied customers can't be wrong. Tap 'Shop Now' to grab yours today! ✨`
      ]
    };
  }

  if (p === "tiktok") {
    return {
      sentiment: "Viral TikTok Video Hook",
      trend_alignment: "Trending (96%)",
      score: 91,
      analysis: `Your TikTok ad copy is well-suited for In-Feed video ads. TikTok ads convert best when leading with an unexpected visual/audio hook in the first 3 seconds followed by fast-paced benefit highlights.`,
      improvements: [
        "Lead with an immediate pattern-interrupt hook ('Stop scrolling if you...')",
        "Keep on-screen text concise (under 8 words per frame)",
        "Recommend using a trending upbeat audio track to boost algorithm push"
      ],
      revised_copy_suggestions: [
        `Stop scrolling! 😱 If you're into ${targetAudience || "cool products"}, you NEED to see this. 100% worth the hype! Tap 'Shop Now' to grab yours before stock runs out 🔥`,
        `I ordered this from the viral shop and I'm OBSESSED. Watch why everybody is buying this ⬇️`
      ]
    };
  }

  if (p === "amazon") {
    return {
      sentiment: "Amazon Search Ranking Ready",
      trend_alignment: "SEO Optimized (95%)",
      score: 93,
      analysis: `Your Amazon Sponsored Product ad title & copy effectively integrates high-search-volume keywords for ${targetAudience || "shoppers"}. Maintaining Brand + Product + Key Features + Specifications boosts Organic & Paid Conversion Rate.`,
      improvements: [
        "Ensure primary search keywords appear within the first 60 characters of the item title",
        "Add key attributes (Material, Color, Compatibility) to improve Sponsored Product placement",
        "Include coupon code or Prime Free Shipping badges in campaign settings"
      ],
      revised_copy_suggestions: [
        `Premium ${targetAudience || "E-Commerce"} Product - High Performance & Ergonomic Design - Compatible with All Devices - Prime Fast Free Shipping`,
        `Top Rated ${targetAudience || "Gear"} | Heavy Duty Construction | Includes 1-Year Warranty & Free Returns`
      ]
    };
  }

  if (p === "ebay") {
    return {
      sentiment: "eBay Promoted Listing Rank Ready",
      trend_alignment: "Marketplace Preferred (94%)",
      score: 89,
      analysis: `Your eBay Promoted Listing title utilizes high-volume search terms. eBay's algorithm prioritizes titles with exact match keywords (up to 80 characters) combined with Top Rated Plus seller signals.`,
      improvements: [
        "Maximize exact 80-character title limit with high-demand search keywords",
        "Avoid unnecessary punctuation or fluff words that waste character space",
        "Highlight 'Top Rated Seller', 'Free Shipping', or 'Same Day Dispatch' in campaign subtitles"
      ],
      revised_copy_suggestions: [
        `New ${targetAudience || "Featured"} Item High Quality Fast Free Shipping 30 Day Returns Top Rated Seller`,
        `Authentic ${targetAudience || "Product"} Brand New Sealed Full Warranty Express Delivery`
      ]
    };
  }

  // Default X (Twitter)
  return {
    sentiment: "High Intent / Viral Hook",
    trend_alignment: "Optimal (94%)",
    score: 86,
    analysis: `The ad copy "${adCopy}" shows strong engagement potential for ${targetAudience || "your target"} audiences on X (Twitter). Strategic pacing, emotional hooks, and clear CTAs will maximize conversion rates.`,
    improvements: [
      "Add a high-converting direct Call-to-Action link",
      "Include trending category hashtags for immediate reach",
      "Lead with a bold 3-word hook to stop fast timeline scrolling"
    ],
    revised_copy_suggestions: [
      `🔥 Trending: The top-rated deal everybody is talking about. Discover savings in seconds 🛒👇`,
      `Stop overpaying. Experience seamless automated workflows today 🚀`
    ]
  };
}

// Client-side local state fallback for PayPal Subscriptions
let clientUsers: UserAccount[] = [
  { id: "user_chris", email: "chris.james378@gmail.com", username: "chris.james", registeredAt: "2026-01-15T08:00:00Z" },
  { id: "user_dev", email: "guest.dev@google.com", username: "guest_developer", registeredAt: "2026-02-28T14:30:00Z" },
  { id: "user_alpha", email: "alpha.tester@ai.studio", username: "alpha_tester", registeredAt: "2026-05-19T10:15:00Z" }
];
let clientCurrentUserId = "user_chris";

let clientPlans: SubscriptionPlan[] = [
  { id: 'stealth-solo', name: 'Stealth Solo Tracker', price: 29.00, features: ['Single Stealth Session', '100 OCR Scans/mo', 'Standard Proxy Hub'], billingCycle: 'monthly', description: 'For independent developers running individual tracking loops.' },
  { id: 'agent-cluster', name: 'Agent Cluster Premium', price: 99.00, features: ['Up to 5 Parallel Clusters', 'Unlimited Perceptual OCR', 'Residential Proxy Rotation', 'Stealth Vision Hook Access'], billingCycle: 'monthly', description: 'Our most popular plan for full automation scale.' },
  { id: 'enterprise-unlimited', name: 'Enterprise HyperScale', price: 349.00, features: ['Unlimited Concurrent Agents', 'Custom TLS Spoof Profiles', 'Dedicated Enclave Socket', 'Prioritized 24/7 Human-Aided Handover'], billingCycle: 'monthly', description: 'Maximum execution power for professional platforms.' }
];

let clientSubscriptions: PayPalSubscription[] = [
  { id: "sub_paypal_initial123", userId: "user_chris", planId: "agent-cluster", status: "ACTIVE", price: 99.00, currency: "USD", billingCycle: "monthly", createdAt: "2026-05-01T09:00:00Z", nextPaymentDate: "2026-06-01T09:00:00Z", autoRenew: true }
];

let clientNotifications: RenewalNotification[] = [
  { id: "notif_init1", subscriptionId: "sub_paypal_initial123", timestamp: "2026-05-01T09:05:00Z", type: "CREATED", amount: 99.00, message: "PayPal billing arrangement initialized successfully." },
  { id: "notif_init2", subscriptionId: "sub_paypal_initial123", timestamp: "2026-05-01T09:10:00Z", type: "BILLING_SUCCESS", amount: 99.00, message: "Authorized billing receipt charge for period May 1 to Jun 1." }
];

export function getClientPaypalState() {
  return {
    currentUserId: clientCurrentUserId,
    users: clientUsers,
    plans: clientPlans,
    subscriptions: clientSubscriptions,
    notifications: clientNotifications
  };
}

export function selectClientUser(userId: string) {
  clientCurrentUserId = userId;
  return getClientPaypalState();
}

export function createClientSubscription(planId: string, billingCycle: string = "monthly") {
  const plan = clientPlans.find(p => p.id === planId);
  if (!plan) throw new Error(`Plan ${planId} not found`);

  clientSubscriptions = clientSubscriptions.filter(s => !(s.userId === clientCurrentUserId && s.status === "APPROVAL_PENDING"));

  const newSub: PayPalSubscription = {
    id: `sub_paypal_${Math.floor(Math.random() * 1000000)}`,
    userId: clientCurrentUserId,
    planId: planId as any,
    status: "APPROVAL_PENDING",
    price: plan.price,
    currency: "USD",
    billingCycle: billingCycle as any,
    createdAt: new Date().toISOString(),
    nextPaymentDate: "",
    autoRenew: true
  };

  clientSubscriptions.push(newSub);
  clientNotifications.unshift({
    id: `notif_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: newSub.id,
    timestamp: new Date().toISOString(),
    type: "CREATED",
    amount: newSub.price,
    message: "PayPal Checkout token generated. Awaiting buyer authorization."
  });

  return newSub;
}

export function approveClientSubscription(subId: string) {
  const sub = clientSubscriptions.find(s => s.id === subId);
  if (!sub) throw new Error("Subscription not found");

  clientSubscriptions.forEach(s => {
    if (s.userId === sub.userId && s.id !== sub.id && s.status === "ACTIVE") {
      s.status = "CANCELLED";
      s.autoRenew = false;
    }
  });

  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);

  sub.status = "ACTIVE";
  sub.nextPaymentDate = nextDate.toISOString();

  clientNotifications.unshift({
    id: `notif_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: sub.id,
    timestamp: new Date().toISOString(),
    type: "BILLING_SUCCESS",
    amount: sub.price,
    message: `Payment authorized: Charged $${sub.price} USD for cycle period.`
  });

  return sub;
}

export function cancelClientSubscription(subId: string) {
  const sub = clientSubscriptions.find(s => s.id === subId);
  if (!sub) throw new Error("Subscription not found");

  sub.status = "CANCELLED";
  sub.autoRenew = false;

  clientNotifications.unshift({
    id: `notif_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: sub.id,
    timestamp: new Date().toISOString(),
    type: "CANCELLED",
    amount: 0,
    message: "PayPal subscription cancelled. Auto-renew halted."
  });

  return sub;
}

export function simulateClientRenewal(subId: string, simulateFailure: boolean) {
  const sub = clientSubscriptions.find(s => s.id === subId);
  if (!sub) throw new Error("Subscription not found");

  const timestamp = new Date().toISOString();
  if (simulateFailure) {
    sub.status = "SUSPENDED";
    clientNotifications.unshift({
      id: `notif_${Math.floor(Math.random() * 1000000)}`,
      subscriptionId: sub.id,
      timestamp,
      type: "BILLING_FAILED",
      amount: sub.price,
      message: "PayPal transaction failed (Code: INSTRUMENT_DECLINED). Access suspended."
    });
  } else {
    sub.status = "ACTIVE";
    const curDate = sub.nextPaymentDate ? new Date(sub.nextPaymentDate) : new Date();
    curDate.setMonth(curDate.getMonth() + 1);
    sub.nextPaymentDate = curDate.toISOString();

    clientNotifications.unshift({
      id: `notif_${Math.floor(Math.random() * 1000000)}`,
      subscriptionId: sub.id,
      timestamp,
      type: "BILLING_SUCCESS",
      amount: sub.price,
      message: `PayPal cycle auto-renewal verified: Charged $${sub.price} USD.`
    });
  }

  return sub;
}
