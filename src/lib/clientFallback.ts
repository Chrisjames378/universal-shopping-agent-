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

// Client-side fallback for Grok X-Ads analysis
export function getGrokAnalysisClient(adCopy: string, targetAudience?: string) {
  return {
    sentiment: "Neutral to Positive",
    trend_alignment: "High",
    score: 82,
    analysis: `The ad copy "${adCopy}" shows strong engagement potential. X firehose real-time trend metrics show an active conversation spike (+34% velocity) among ${targetAudience || "your target"} audiences.`,
    improvements: [
      "Add a high-converting call-to-action (e.g., 'Claim yours now at uniagent.website')",
      "Include trending category hashtags for immediate reach",
      "Lead with a bold 3-word hook to stop fast timeline scrolling"
    ],
    revised_copy_suggestions: [
      `🔥 Trending: The AI shopping assistant everybody is talking about. Find deals in seconds. Try it now: https://uniagent.website #UniAgent #AIShopping`,
      `Stop overpaying. Let UniAgent find and secure the best deals automatically. Check it out at https://uniagent.website 🚀`
    ],
    isMocked: true,
    warning: "Running client simulation mode. Add GROK_API_KEY for live firehose query."
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
