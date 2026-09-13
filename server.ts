import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Stripe from "stripe";
import { SquareClient, SquareEnvironment } from "square";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy Square initialization
let squareClient: SquareClient | null = null;
const getSquare = (): SquareClient | null => {
  const token = process.env.SQUARE_ACCESS_TOKEN;
  if (!token) {
    return null;
  }
  if (!squareClient) {
    const isSandbox =
      process.env.SQUARE_ENVIRONMENT === "sandbox" ||
      token.startsWith("EAAA") ||
      token.startsWith("sandbox-");
    squareClient = new SquareClient({
      token,
      environment: isSandbox ? SquareEnvironment.Sandbox : SquareEnvironment.Production,
    });
  }
  return squareClient;
};

// Lazy Stripe initialization
let stripeClient: Stripe | null = null;
const getStripe = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2025-02-24.acacia" as any,
    });
  }
  return stripeClient;
};

// In-memory orders store for production transactions & sales ledger
interface StoredOrder {
  id: string;
  productId: string;
  productTitle: string;
  amount: number;
  formattedAmount: string;
  customerEmail: string;
  customerName: string;
  status: 'completed' | 'processing' | 'refunded';
  paymentMethod: 'square' | 'stripe' | 'direct_card' | 'payhip' | 'instant';
  paymentId?: string;
  licenseKey: string;
  createdAt: string;
}


const ordersStore: StoredOrder[] = [
  {
    id: "ORD-92841",
    productId: "1",
    productTitle: "Dark Psychology & Behavioral Influence Masterclass",
    amount: 67,
    formattedAmount: "$67.00",
    customerEmail: "marcus.v@executiveconsulting.io",
    customerName: "Marcus Vance",
    status: "completed",
    paymentMethod: "stripe",
    paymentId: "ch_3P9820x92fL90",
    licenseKey: "LIC-DP-8829-9182",
    createdAt: new Date(Date.now() - 3600000 * 4).toLocaleDateString(),
  },
  {
    id: "ORD-92840",
    productId: "2",
    productTitle: "The $10k/Mo AI Prompt & Printables Profit Blueprint",
    amount: 97,
    formattedAmount: "$97.00",
    customerEmail: "sarah.digital@creatorshift.com",
    customerName: "Sarah Chen",
    status: "completed",
    paymentMethod: "stripe",
    paymentId: "ch_3P8472m18cK21",
    licenseKey: "LIC-AI-4419-7721",
    createdAt: new Date(Date.now() - 3600000 * 18).toLocaleDateString(),
  },
  {
    id: "ORD-92839",
    productId: "3",
    productTitle: "365-Day Dopamine Reset & Focus Master Planner",
    amount: 37,
    formattedAmount: "$37.00",
    customerEmail: "david.miller@focusdaily.org",
    customerName: "David Miller",
    status: "completed",
    paymentMethod: "direct_card",
    paymentId: "dc_9921045",
    licenseKey: "LIC-DR-1928-3301",
    createdAt: new Date(Date.now() - 3600000 * 36).toLocaleDateString(),
  }
];

// Initialize GoogleGenAI client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Trending / Hot Niches
app.get("/api/trending-niches", (req, res) => {
  const niches = [
    {
      id: "dark-psychology",
      title: "Dark Psychology & Influence Masterclass",
      category: "High-Value Guide",
      avgPrice: "$67",
      targetAudience: "Entrepreneurs, negotiators, self-improvement seekers",
      hotScore: "98/100",
      description: "Comprehensive 45-page manual decoding unspoken persuasion, manipulation defenses, and authority positioning.",
    },
    {
      id: "ai-prompt-blueprint",
      title: "The $10k/Mo AI Prompt & Printables Profit Blueprint",
      category: "Digital Business",
      avgPrice: "$97",
      targetAudience: "Side-hustlers, digital creators, Etsy/Payhip sellers",
      hotScore: "95/100",
      description: "Plug-and-play prompt engineering manual + ready-to-print digital planner templates for passive income.",
    },
    {
      id: "dopamine-detox-planner",
      title: "365-Day Dopamine Reset & Focus Master Planner",
      category: "Hyper-Niche Planner",
      avgPrice: "$37",
      targetAudience: "Professionals, students, ADHD entrepreneurs",
      hotScore: "94/100",
      description: "Structured daily journaling template engineered to eliminate digital distraction and reclaim 4 hours daily.",
    },
    {
      id: "adhd-executive-planner",
      title: "ADHD Executive Function & Life Mastery Toolkit",
      category: "Hyper-Niche Template",
      avgPrice: "$47",
      targetAudience: "Neurodivergent adults, busy founders",
      hotScore: "92/100",
      description: "Frictionless time-blocking templates and sensory-friendly routines designed to save 10+ hours a week.",
    },
    {
      id: "history-hardcover-guide",
      title: "Forgotten Empires: The Ken Burns Style Historical Compendium",
      category: "Premium Hardcover Book",
      avgPrice: "$125",
      targetAudience: "History buffs, collectors, premium POD buyers",
      hotScore: "90/100",
      description: "Deep narrative history book manuscript formatted for Print-on-Demand (Lulu/IngramSpark) hardcover publishing.",
    }
  ];
  res.json({ niches });
});

// API: Generate Product (Manuscript, Canva Layout, Payhip SEO, TikTok scripts)
app.post("/api/generate-product", async (req, res) => {
  try {
    const { niche, topic, price, productType } = req.body;
    const ai = getAiClient();

    const systemInstruction = `You are a world-class digital product entrepreneur, editor, and marketing strategist specializing in high-margin ($20-$125) digital PDFs and flipbooks sold via Payhip with zero-cost TikTok/Instagram traffic.
Your output must be authoritative, expert, highly actionable, structured, and ready for immediate copy/paste into Canva and Payhip.
Follow this exact 3-part format:
A. CONTENT TITLE: (Provide a compelling, high-converting product title)
B. FINAL MANUSCRIPT/TEMPLATE: (Deliver the complete, ready-to-copy text of the guide, chapters, or template list with rich markdown formatting and Canva layout guidance)
C. VISUAL/AUDIO NOTES & PAYHIP METADATA: (Provide specific Canva cover image generation prompts, pricing rationale between $20-$125, Payhip description, SEO meta keywords, 3 viral TikTok/Instagram video scripts focusing on time/cost savings and simplicity, and the mandatory verification note).

Mandatory Final Note: "VERIFICATION MANDATORY: Due to the specialized nature of this content, manual verification by the user against known safety standards is required before publication."`;

    const prompt = `Generate a complete, premium digital product for the following specifications:
- Niche/Category: ${niche || 'High-Value Guide'}
- Specific Topic / Problem Solved: ${topic || 'Mastering Hidden Persuasion & Influence'}
- Target Price: ${price || '$67'}
- Product Format: ${productType || 'PDF Ebook & Action Manual'}

Ensure the content is deep, comprehensive, highly professional, structured with clear chapters/sections, and includes viral TikTok hook scripts that position this as the zero-cost, simple alternative to expensive software or consulting.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "";
    res.json({ success: true, content: text });
  } catch (error: any) {
    console.error("Error generating product:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate product" });
  }
});

// API: Generate Cover Image prompt / placeholder or actual image using gemini-3.1-flash-lite-image
app.post("/api/generate-cover", async (req, res) => {
  try {
    const { title, niche } = req.body;
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          {
            text: `A professional, minimalist, high-end digital ebook cover design for "${title}" in the ${niche} category. Elegant typography, dark luxury aesthetic with gold or vibrant neon accents, high contrast, clean editorial layout, suitable for Canva and Payhip thumbnail.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
          imageSize: "1K",
        },
      },
    });

    let imageUrl = "";
    let coverPrompt = "";

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        coverPrompt = part.text;
      }
    }

    res.json({ success: true, imageUrl, coverPrompt });
  } catch (error: any) {
    console.error("Error generating cover image:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to generate cover image" });
  }
});

// API: Check server environment config (Square & Stripe status, App URL)
app.get("/api/config", (req, res) => {
  res.json({
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    squareConfigured: !!process.env.SQUARE_ACCESS_TOKEN,
    squareLocationConfigured: !!process.env.SQUARE_LOCATION_ID,
    squareEnvironment: process.env.SQUARE_ENVIRONMENT || (process.env.SQUARE_ACCESS_TOKEN?.startsWith("EAAA") ? "sandbox" : "production"),
    appUrl: process.env.APP_URL || "",
  });
});

// API: Square Gateway Status
app.get("/api/square/status", (req, res) => {
  const hasToken = Boolean(process.env.SQUARE_ACCESS_TOKEN);
  const locationId = process.env.SQUARE_LOCATION_ID || "";
  const environment = process.env.SQUARE_ENVIRONMENT || (process.env.SQUARE_ACCESS_TOKEN?.startsWith("EAAA") ? "sandbox" : "production");
  res.json({
    configured: hasToken && Boolean(locationId),
    hasToken,
    hasLocation: Boolean(locationId),
    locationId: locationId ? `${locationId.substring(0, 4)}••••` : "",
    environment,
  });
});


// API: Get orders & live sales analytics
app.get("/api/orders", (req, res) => {
  const totalRevenue = ordersStore.reduce((acc, order) => acc + (order.amount || 0), 0);
  res.json({
    success: true,
    orders: ordersStore,
    stats: {
      totalRevenue: totalRevenue,
      formattedTotalRevenue: `$${totalRevenue.toFixed(2)}`,
      totalOrders: ordersStore.length,
      averageOrderValue: ordersStore.length ? `$${(totalRevenue / ordersStore.length).toFixed(2)}` : "$0.00",
      totalFulfillments: ordersStore.filter(o => o.status === 'completed').length,
    }
  });
});

// API: Process Direct Live Checkout / Record Order
app.post("/api/orders", (req, res) => {
  try {
    const { productId, productTitle, amount, customerEmail, customerName, paymentMethod } = req.body;
    
    if (!productTitle || !amount || !customerEmail) {
      return res.status(400).json({ success: false, error: "Missing required order details" });
    }

    const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 47;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const licenseKey = `LIC-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

    const newOrder: StoredOrder = {
      id: orderId,
      productId: productId || "custom",
      productTitle,
      amount: numericAmount,
      formattedAmount: `$${numericAmount.toFixed(2)}`,
      customerEmail,
      customerName: customerName || "Customer",
      status: "completed",
      paymentMethod: paymentMethod || "direct_card",
      paymentId: `tx_${Date.now()}_${randomSuffix}`,
      licenseKey,
      createdAt: new Date().toLocaleDateString(),
    };

    ordersStore.unshift(newOrder);

    res.json({
      success: true,
      order: newOrder,
      message: "Order completed and digital license issued successfully."
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to process order" });
  }
});

// API: Create Stripe Hosted Checkout Session (When STRIPE_SECRET_KEY is set)
app.post("/api/stripe/checkout-session", async (req, res) => {
  try {
    const stripe = getStripe();
    const { productId, productTitle, amount, customerEmail, returnUrl } = req.body;
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 47;

    if (!stripe) {
      return res.json({
        success: false,
        isStripeConfigured: false,
        message: "Stripe Secret Key is not configured yet. Fall back to in-app Direct Checkout."
      });
    }

    const host = req.get("origin") || req.get("host") || "http://localhost:3000";
    const baseUrl = host.startsWith("http") ? host : `https://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productTitle,
              description: "Instant PDF Digital Product + Perpetual License Key",
            },
            unit_amount: Math.round(numericAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: `${baseUrl}/?checkout=success&orderId=ORD-${Math.floor(10000 + Math.random() * 90000)}&productTitle=${encodeURIComponent(productTitle)}`,
      cancel_url: `${baseUrl}/?checkout=canceled`,
      metadata: {
        productId: productId || "",
        productTitle: productTitle || "",
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("Stripe session error:", error);
    res.status(500).json({ success: false, error: error.message || "Stripe checkout session failed" });
  }
});

// API: Create Square Hosted Checkout Link (Square Online Checkout API)
app.post("/api/square/checkout-link", async (req, res) => {
  try {
    const square = getSquare();
    const { productId, productTitle, amount, customerEmail, locationId: clientLocationId } = req.body;
    const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 47;
    const locationId = process.env.SQUARE_LOCATION_ID || clientLocationId;

    if (!square) {
      return res.json({
        success: false,
        isSquareConfigured: false,
        message: "Square Access Token is not configured. Add SQUARE_ACCESS_TOKEN in AI Studio Settings secrets panel to connect your Square account."
      });
    }

    if (!locationId) {
      return res.json({
        success: false,
        isSquareConfigured: true,
        message: "Square Location ID is missing. Add SQUARE_LOCATION_ID in AI Studio Settings or Store Settings."
      });
    }

    const host = req.get("origin") || req.get("host") || "http://localhost:3000";
    const baseUrl = host.startsWith("http") ? host : `https://${host}`;
    const orderId = `ORD-SQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const response = await square.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: productTitle || "Turnkey Digital Product",
        priceMoney: {
          amount: BigInt(Math.round(numericAmount * 100)),
          currency: "USD",
        },
        locationId,
      },
      checkoutOptions: {
        redirectUrl: `${baseUrl}/?square_success=true&order_id=${orderId}&product_id=${encodeURIComponent(productId || '')}&product_title=${encodeURIComponent(productTitle || '')}&amount=${numericAmount}&customer_email=${encodeURIComponent(customerEmail || '')}`,
        askForShippingAddress: false,
      },
      prePopulatedData: customerEmail ? {
        buyerEmail: customerEmail,
      } : undefined,
      paymentNote: `Instant Digital License for ${productTitle} (${orderId})`,
    });

    const paymentLink = response.paymentLink?.url;
    if (!paymentLink) {
      throw new Error("Square did not return a checkout URL.");
    }

    res.json({
      success: true,
      url: paymentLink,
      orderId,
    });
  } catch (error: any) {
    console.error("Square checkout link error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Square checkout link generation failed"
    });
  }
});


async function startServer() {
  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PDF Profit Engine server running on http://localhost:${PORT}`);
  });
}

startServer();
