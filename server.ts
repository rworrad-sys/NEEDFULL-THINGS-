import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

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
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PDF Profit Engine server running on http://localhost:${PORT}`);
  });
}

startServer();
