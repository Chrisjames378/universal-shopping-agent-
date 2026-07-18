/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load local environment variables if available
dotenv.config();

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY is not defined in the environment variables.");
    }
    geminiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY_FALLBACK",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// -------------------------------------------------------------
// 1. API Endpoint: Orchestrate Action Request
// -------------------------------------------------------------
app.post("/api/orchestrate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      res.status(400).json({ error: "Missing or invalid prompt string in request body." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Graceful fallback for preview / staging environments before API key setup
      console.log("No valid GEMINI_API_KEY found. Serving fallback simulation plan.");
      const mockPlan = mockDeconstructQuery(prompt);
      res.json({
        plan: mockPlan,
        isMocked: true,
        warning: "Note: Running in offline simulation mode. Set GEMINI_API_KEY in Secrets for real AI processing."
      });
      return;
    }

    const client = getGeminiClient();

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Translate the following shopping or browser command into a highly detailed and advanced agent execution plan. Make the steps technical and realistic, describing automated interactions with dynamic DOM nodes, proxy settings, or custom heuristics: "${prompt}"`,
      config: {
        systemInstruction: `You are the elite orchestration brain of an advanced Autonomous Web Action Agent.
Your core competency is to receive raw user intent and break it down into high-fidelity sequential execution steps.
You must always output a JSON schema match. Ensure elements are highly technical and descriptive.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent_classification: {
              type: Type.STRING,
              enum: ["purchase", "browse", "research", "unknown"],
            },
            extracted_constraints: {
              type: Type.OBJECT,
              properties: {
                budget: { type: Type.NUMBER, nullable: true },
                currency: { type: Type.STRING, nullable: true },
                attributes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                raw_query: { type: Type.STRING }
              },
              required: ["budget", "currency", "attributes", "raw_query"]
            },
            execution_steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  step_id: { type: Type.INTEGER },
                  action_type: { 
                    type: Type.STRING,
                    enum: ["NAVIGATE", "VISION_SCAN", "FILTER", "SELECT_ITEM", "ADD_TO_CART", "SECURE_CHECKOUT", "RESOLVE_CAPTCHA", "HUMAN_APPROVAL_WAIT"]
                  },
                  technical_details: { type: Type.STRING },
                  target_element_desc: { type: Type.STRING }
                },
                required: ["step_id", "action_type", "technical_details", "target_element_desc"]
              }
            },
            risk_assessment: {
              type: Type.OBJECT,
              properties: {
                bot_detection_probability: {
                  type: Type.STRING,
                  enum: ["LOW", "MEDIUM", "HIGH"]
                },
                anti_bot_triggers: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                requires_human_approval: { type: Type.BOOLEAN }
              },
              required: ["bot_detection_probability", "anti_bot_triggers", "requires_human_approval"]
            }
          },
          required: ["intent_classification", "extracted_constraints", "execution_steps", "risk_assessment"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No text content returned from Gemini model.");
    }

    const planData = JSON.parse(responseText.trim());
    res.json({ plan: planData, isMocked: false });
  } catch (err: any) {
    console.error("Orchestrate error:", err);
    res.status(500).json({
      error: "Failed to generate orchestration plan due to internal processor error.",
      message: err.message || String(err)
    });
  }
});

// -------------------------------------------------------------
// 2. API Endpoint: Ask the Architect Chat
// -------------------------------------------------------------
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      res.status(400).json({ error: "Missing or invalid chat request string." });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      console.log("No valid GEMINI_API_KEY found. Serving architect mock response.");
      const mockResponse = getMockArchitectReply(message);
      res.json({
        response: mockResponse + "\n\n*(Simulation Mode: Connect your Gemini API Key in the Secrets Panel to query the real LLM Brain!)*",
        isMocked: true
      });
      return;
    }

    const client = getGeminiClient();

    // Map history to Google GenAI schema structure [ { role: 'user', parts: [{ text: '...' }] }, { role: 'model', parts: [{ text: '...' }] } ]
    const formattedHistory = (history || []).map((h: any) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.text }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are the Chief Systems Architect for the "Universal Browser Action Agent".
You are speaking to elite developers, AI researchers, and engineering investors.

Your technical thesis and architecture focuses on the following paradigms:
1. Pure DOM automation is brittle and failing in the modern web. Instead, the agent combines raw Playwright control with Multimodal Vision (screenshot & pixel coordinate mapping) to perceive interactive targets like humans.
2. Anti-bot mitigation (Cloudflare, Akamai, Datadome, Kasada) is our chief barrier. We circumvent blocks using Residential Proxy rotation networks, JA3/HTTP2 TLS Fingerprint Spoofing, and human-like bezier mouse jitter algorithms.
3. Financial security is addressed via a 'Blind Vault' pattern. Credit credentials are held in a secure micro-enclave that cannot see the screen, while the Agent cannot read the Vault credentials. Credentials are injected directly into targeted element nodes programmatically over a secure local socket.

Answer questions concisely, professionally, and with depth. Use markdown for lists, structural subdivisions, code-snippets, and bold keywords.`
      }
    });

    const reply = response.text || "I was unable to formulate a response.";
    res.json({ response: reply.trim(), isMocked: false });
  } catch (err: any) {
    console.error("Chat error:", err);
    res.status(500).json({
      error: "Internal server error occurred when querying the Architect model.",
      message: err.message || String(err)
    });
  }
});

// -------------------------------------------------------------
// 3. API Endpoint: Grok X-Ads Sentiment Analysis (Simulated)
// -------------------------------------------------------------
app.post("/api/grok/analyze-ad", async (req, res) => {
  try {
    const { adCopy, targetAudience, metrics } = req.body;
    if (!adCopy || typeof adCopy !== "string") {
      res.status(400).json({ error: "Missing or invalid ad copy string in request body." });
      return;
    }

    const grokApiKey = process.env.GROK_API_KEY;
    
    // If no real Grok API key, we simulate the Grok X-Ads Advisor response
    if (!grokApiKey || grokApiKey === "YOUR_GROK_API_KEY") {
      console.log("No valid GROK_API_KEY found. Serving simulated X-Ads analysis.");
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const simulatedResponse = {
        sentiment: "Neutral to Positive",
        trend_alignment: "High",
        score: 78,
        analysis: `The ad copy "${adCopy}" shows solid potential but lacks urgency. Current X firehose data indicates a spike in conversations around 'immediate value' for the ${targetAudience || 'general'} demographic.`,
        improvements: [
          "Add a clearer Call-to-Action (e.g., 'Shop the drop now')",
          "Inject trending hashtags related to your product category",
          "Shorten the hook; X users scroll fast, capture attention in the first 3 words."
        ],
        revised_copy_suggestions: [
          `🔥 Trending now: The ultimate upgrade for your setup. Don't wait until they sell out. Shop the drop now: [LINK] #UpgradeYourLife`,
          `Why settle for less? Get the best for your ${targetAudience || 'setup'} today. 🚀 [LINK] #TrendingGear`
        ],
        isMocked: true,
        warning: "Note: Running in simulation mode. Set GROK_API_KEY in Secrets for live X-firehose integration."
      };
      
      res.json(simulatedResponse);
      return;
    }

    // In a real integration, you would use the xAI SDK or fetch to hit the Grok API
    // Example fetch to xAI endpoint:
    /*
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${grokApiKey}`
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are the Grok X-Ads Strategy Advisor..." },
          { role: "user", content: `Analyze this ad copy: ${adCopy}` }
        ],
        model: "grok-beta",
        temperature: 0.7
      })
    });
    */

    // For this example, since we don't have the xAI SDK installed, we return the mock anyway
    res.json({
      error: "Live Grok integration requires installing the OpenAI SDK or native fetch and configuring the endpoint."
    });
  } catch (err: any) {
    console.error("Grok integration error:", err);
    res.status(500).json({
      error: "Failed to analyze ad copy due to internal processor error.",
      message: err.message || String(err)
    });
  }
});

// Helper: fallback mock plan builder
function mockDeconstructQuery(query: string) {
  const isVegan = /vegan/i.test(query);
  const isGf = /gluten|gf/i.test(query);
  const matchedPrice = query.match(/\$?(\d+)/);
  const budget = matchedPrice ? parseFloat(matchedPrice[1]) : 25;

  return {
    intent_classification: "purchase",
    extracted_constraints: {
      budget: budget,
      currency: "USD",
      attributes: [
        ...(isVegan ? ["vegan"] : []),
        ...(isGf ? ["gluten-free"] : []),
        "near downtown"
      ],
      raw_query: query
    },
    execution_steps: [
      {
        step_id: 1,
        action_type: "NAVIGATE",
        technical_details: "Initialize stealth browser profile with randomized user-agent. Target maps domain for service routing list.",
        target_element_desc: "Main viewport"
      },
      {
        step_id: 2,
        action_type: "VISION_SCAN",
        technical_details: "Execute multimodal segmentation on current viewport. Draw overlay boundaries for food listings matching vegan attributes.",
        target_element_desc: "Merchant result container list"
      },
      {
        step_id: 3,
        action_type: "FILTER",
        technical_details: "Click on 'Under $25' pricing range selector by simulating a realistic spline cursor transition.",
        target_element_desc: "Price slider or quick filter token"
      },
      {
        step_id: 4,
        action_type: "SELECT_ITEM",
        technical_details: "Trigger targeted focus onto the highest rated matching listing, capturing bounding box geometry for the dynamic click event.",
        target_element_desc: "Listing with label 'Gluten-Free Crust Special Pizza'"
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
    ],
    risk_assessment: {
      bot_detection_probability: "MEDIUM",
      anti_bot_triggers: ["Kasada device fingerprinting", "reCAPTCHA v3 score-checking", "Dynamic Canvas tracking"],
      requires_human_approval: true
    }
  };
}

// Helper: mock architect conversation
function getMockArchitectReply(msg: string): string {
  const text = msg.toLowerCase();
  if (text.includes("dom") || text.includes("brittle") || text.includes("scrape")) {
    return "**Dynamic DOM Parsing and Perception:**\nRather than parsing brittle HTML IDs or CSS selectors, our architecture employs standard high-fidelity screenshots converted to low-dimensional vector maps. By combining high-definition coordinates with optical-character-recognition (OCR) and YOLO segmentation on the browser viewport, our agent clicks based on **perceptual positions** rather than underlying HTML structure. This completely bypasses developer updates!";
  }
  if (text.includes("proxy") || text.includes("cloudflare") || text.includes("akami") || text.includes("bot")) {
    return "**Stealth Anti-Bot Mitigation:**\nWe prevent Cloudflare, Akamai, and Kasada blockouts at three levels:\n1. **Network level:** Routing all headless requests through high-speed, dynamic residential proxies with residential ISPs.\n2. **Handshake level:** Spoofing client TLS ja3 hash signatures in compiled Go/Rust proxies to perfectly match premium consumer devices.\n3. **Human Simulation:** Rather than straight-line mouse events, we emit bezier-curves with dynamic acceleration and randomized rest-frames to perfectly match organic hand jitter.";
  }
  if (text.includes("vault") || text.includes("card") || text.includes("security") || text.includes("payment")) {
    return "**The Blind Vault Pattern:**\nTo eliminate the vulnerability of LLM prompt injections (where an attacker manipulates the bot to spill its core memory), we isolated the financial credential store entirely. The agent navigates, fills out non-sensitive fields, and targets the checkout. When fields are active, a dedicated local crypt-process programmatically injects credit details on a localized Unix socket. The main AI agent never sees, reads, or holds the credentials in its context window.";
  }
  return "That is an excellent design question. As our core systems architecture evolves, we represent the Agent as a hybrid controller: standard business logic manages the strict deterministic gates (state validation, network handshakes, payment vault), while the Multimodal LLM behaves as the high-level Planner. This guarantees 100% predictability for checkout executions while scaling perfectly across millions of disparate e-commerce sites.";
}

// -------------------------------------------------------------
// 2.5. PayPal Subscriptions & User Account Database State Emulator
// -------------------------------------------------------------
const mockUsers: UserAccount[] = [
  { id: "user_chris", email: "chris.james378@gmail.com", username: "chris.james", registeredAt: "2026-01-15T08:00:00Z" },
  { id: "user_dev", email: "guest.dev@google.com", username: "guest_developer", registeredAt: "2026-02-28T14:30:00Z" },
  { id: "user_alpha", email: "alpha.tester@ai.studio", username: "alpha_tester", registeredAt: "2026-05-19T10:15:00Z" }
];

let currentUserId = "user_chris";

const mockPlans: SubscriptionPlan[] = [
  { id: 'stealth-solo', name: 'Stealth Solo Tracker', price: 29.00, features: ['Single Stealth Session', '100 OCR Scans/mo', 'Standard Proxy Hub'], billingCycle: 'monthly', description: 'For independent developers running individual tracking loops.' },
  { id: 'agent-cluster', name: 'Agent Cluster Premium', price: 99.00, features: ['Up to 5 Parallel Clusters', 'Unlimited Perceptual OCR', 'Residential Proxy Rotation', 'Stealth Vision Hook Access'], billingCycle: 'monthly', description: 'Our most popular plan for full automation scale.' },
  { id: 'enterprise-unlimited', name: 'Enterprise HyperScale', price: 349.00, features: ['Unlimited Concurrent Agents', 'Custom TLS Spoof Profiles', 'Dedicated Enclave Socket', 'Prioritized 24/7 Human-Aided Handover'], billingCycle: 'monthly', description: 'Maximum execution power for professional platforms.' }
];

let mockSubscriptions: PayPalSubscription[] = [
  { id: "sub_paypal_initial123", userId: "user_chris", planId: "agent-cluster", status: "ACTIVE", price: 99.00, currency: "USD", billingCycle: "monthly", createdAt: "2026-05-01T09:00:00Z", nextPaymentDate: "2026-06-01T09:00:00Z", autoRenew: true }
];

let mockNotifications: RenewalNotification[] = [
  { id: "notif_init1", subscriptionId: "sub_paypal_initial123", timestamp: "2026-05-01T09:05:00Z", type: "CREATED", amount: 99.00, message: "PayPal billing arrangement initialized successfully." },
  { id: "notif_init2", subscriptionId: "sub_paypal_initial123", timestamp: "2026-05-01T09:10:00Z", type: "BILLING_SUCCESS", amount: 99.00, message: "Authorized billing receipt charge for period May 1 to Jun 1." }
];

// Import state definitions
import { UserAccount, PayPalSubscription, SubscriptionPlan, RenewalNotification } from "./src/types";

// Get collective emulated subscription server state
app.get("/api/paypal/state", (req, res) => {
  res.json({
    currentUserId,
    users: mockUsers,
    plans: mockPlans,
    subscriptions: mockSubscriptions,
    notifications: mockNotifications
  });
});

// Switch emulated user account
app.post("/api/paypal/user/select", (req, res) => {
  const { userId } = req.body;
  const userExists = mockUsers.find(u => u.id === userId);
  if (!userExists) {
    res.status(404).json({ error: `User with ID "${userId}" not found.` });
    return;
  }
  currentUserId = userId;
  res.json({ success: true, currentUserId });
});

// Initialize approval pending PayPal Subscription
app.post("/api/paypal/subscription/create", (req, res) => {
  const { planId, billingCycle } = req.body;
  const plan = mockPlans.find(p => p.id === planId);
  if (!plan) {
    res.status(404).json({ error: `Selected billing plan "${planId}" not found.` });
    return;
  }

  // Cancel any prior approval_pending or active subscription for this user
  mockSubscriptions = mockSubscriptions.filter(s => !(s.userId === currentUserId && s.status === "APPROVAL_PENDING"));

  const newSub: PayPalSubscription = {
    id: `sub_paypal_${Math.floor(Math.random() * 1000000)}`,
    userId: currentUserId,
    planId: planId as "stealth-solo" | "agent-cluster" | "enterprise-unlimited",
    status: "APPROVAL_PENDING",
    price: plan.price,
    currency: "USD",
    billingCycle: billingCycle || "monthly",
    createdAt: new Date().toISOString(),
    nextPaymentDate: "",
    autoRenew: true
  };

  mockSubscriptions.push(newSub);

  // Add a tentative mock pending notification
  mockNotifications.unshift({
    id: `notif_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: newSub.id,
    timestamp: new Date().toISOString(),
    type: "CREATED",
    amount: newSub.price,
    message: `PayPal Checkout Redirect token generated. Awaiting buyer authorization.`
  });

  res.json({ success: true, subscription: newSub });
});

// Complete Paypal transaction (Simulate user clicks 'Approve')
app.post("/api/paypal/subscription/approve", (req, res) => {
  const { subscriptionId } = req.body;
  const sub = mockSubscriptions.find(s => s.id === subscriptionId);
  if (!sub) {
    res.status(404).json({ error: `Subscription ${subscriptionId} not found.` });
    return;
  }

  // Set any other active subscriptions for this user to cancelled
  mockSubscriptions.forEach(s => {
    if (s.userId === sub.userId && s.id !== sub.id && s.status === "ACTIVE") {
      s.status = "CANCELLED";
      s.autoRenew = false;
    }
  });

  const nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 1);

  sub.status = "ACTIVE";
  sub.nextPaymentDate = nextDate.toISOString();

  // Record SUCCESS webhooks
  const createNotif: RenewalNotification = {
    id: `notif_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: sub.id,
    timestamp: new Date().toISOString(),
    type: "CREATED",
    amount: sub.price,
    message: `PayPal billing plan successfully approved and signature captured.`
  };

  const successNotif: RenewalNotification = {
    id: `notif_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: sub.id,
    timestamp: new Date().toISOString(),
    type: "BILLING_SUCCESS",
    amount: sub.price,
    message: `Payment authorized: Charged $${sub.price} USD for cycle period.`
  };

  mockNotifications.unshift(createNotif);
  mockNotifications.unshift(successNotif);

  res.json({ success: true, subscription: sub });
});

// Cancel active subscription
app.post("/api/paypal/subscription/cancel", (req, res) => {
  const { subscriptionId } = req.body;
  const sub = mockSubscriptions.find(s => s.id === subscriptionId);
  if (!sub) {
    res.status(404).json({ error: `Subscription ${subscriptionId} not found.` });
    return;
  }

  sub.status = "CANCELLED";
  sub.autoRenew = false;

  // Insert CANCELLED notification
  mockNotifications.unshift({
    id: `notif_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: sub.id,
    timestamp: new Date().toISOString(),
    type: "CANCELLED",
    amount: 0,
    message: `PayPal subscription cancelled by buyer interface. Auto-renew halted.`
  });

  res.json({ success: true, subscription: sub });
});

// Force automated renewal / billing simulator
app.post("/api/paypal/subscription/simulate-renewal", (req, res) => {
  const { subscriptionId, simulateFailure } = req.body;
  const sub = mockSubscriptions.find(s => s.id === subscriptionId);
  if (!sub) {
    res.status(404).json({ error: `Subscription ${subscriptionId} not found.` });
    return;
  }

  if (sub.status !== "ACTIVE" && sub.status !== "SUSPENDED") {
    res.status(400).json({ error: "Can only simulate renewal events on Active or Suspended accounts." });
    return;
  }

  const notificationId = `notif_${Math.floor(Math.random() * 1000000)}`;
  const timestamp = new Date().toISOString();

  if (simulateFailure) {
    sub.status = "SUSPENDED";
    mockNotifications.unshift({
      id: notificationId,
      subscriptionId: sub.id,
      timestamp,
      type: "BILLING_FAILED",
      amount: sub.price,
      message: `PayPal checkout transaction failed (Code: INSTRUMENT_DECLINED). Access suspended.`
    });
  } else {
    sub.status = "ACTIVE";
    const curDate = sub.nextPaymentDate ? new Date(sub.nextPaymentDate) : new Date();
    curDate.setMonth(curDate.getMonth() + 1);
    sub.nextPaymentDate = curDate.toISOString();

    mockNotifications.unshift({
      id: notificationId,
      subscriptionId: sub.id,
      timestamp,
      type: "BILLING_SUCCESS",
      amount: sub.price,
      message: `PayPal cycle auto-renewal verified: Transmitted transaction sum of $${sub.price} USD.`
    });
  }

  res.json({ success: true, subscription: sub, notifications: mockNotifications });
});

// Simulated PayPal Webhook Listener Endpoint
app.post("/api/paypal/webhook", (req, res) => {
  const { event_type, resource } = req.body;
  if (!event_type) {
    res.status(400).json({ error: "Missing PayPal event_type payload wrapper." });
    return;
  }

  console.log(`[PayPal Webhook Received] type: ${event_type}`, resource);

  const subId = resource?.id || resource?.subscription_id || "unknown_sub";
  const amount = resource?.amount?.value ? parseFloat(resource.amount.value) : 0;

  let convertedType: RenewalNotification["type"] = "BILLING_SUCCESS";
  let message = `External Webhook [${event_type}] processed correctly.`;

  if (event_type === "BILLING.SUBSCRIPTION.CANCELLED") {
    convertedType = "CANCELLED";
    message = "PayPal transaction: Subscription agreement cancelled.";
    const sub = mockSubscriptions.find(s => s.id === subId);
    if (sub) {
      sub.status = "CANCELLED";
      sub.autoRenew = false;
    }
  } else if (event_type === "PAYMENT.SALE.COMPLETED") {
    convertedType = "BILLING_SUCCESS";
    message = `PayPal Transaction success: Collected settlement of $${amount} USD.`;
    const sub = mockSubscriptions.find(s => s.id === subId);
    if (sub) {
      sub.status = "ACTIVE";
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + 1);
      sub.nextPaymentDate = nextDate.toISOString();
    }
  } else if (event_type === "PAYMENT.SALE.DENIED") {
    convertedType = "BILLING_FAILED";
    message = `PayPal Transaction warning: Settlement verification denied.`;
    const sub = mockSubscriptions.find(s => s.id === subId);
    if (sub) {
      sub.status = "SUSPENDED";
    }
  }

  const notif: RenewalNotification = {
    id: `notif_webhook_${Math.floor(Math.random() * 1000000)}`,
    subscriptionId: subId,
    timestamp: new Date().toISOString(),
    type: convertedType,
    amount,
    message
  };

  mockNotifications.unshift(notif);

  res.json({
    received: true,
    processed_notification: notif
  });
});

// -------------------------------------------------------------
// 3. Mount Vite Developer Server or Production Build Static Handler
// -------------------------------------------------------------
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server listening at http://localhost:${PORT}`);
    console.log(`Current mode: ${process.env.NODE_ENV || "development"}`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal bootstrapper exception:", err);
  process.exit(1);
});
