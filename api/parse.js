export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',responseLimit: '20mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key not configured on server." });

  try {
    const { fileBase64, mimeType } = req.body;

    const content = mimeType === "application/pdf"
      ? [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: fileBase64 } },
          { type: "text", text: "Extract all payment processing data from this merchant statement." }
        ]
      : [
          { type: "image", source: { type: "base64", media_type: mimeType, data: fileBase64 } },
          { type: "text", text: "Extract all payment processing data from this merchant statement." }
        ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: `You are an expert at reading merchant payment processing statements.
Extract data and return ONLY valid JSON, no markdown, no commentary. Use 0 for missing values.
{
  "totalVolume": <number>,
  "transactionCount": <number>,
  "discountFees": <number>,
  "transactionFees": <number>,
  "monthlyFees": <number>,
  "chargebackFees": <number>,
  "otherFees": <number>,
  "pricingModel": "<interchange_plus|flat_rate|tiered|unknown>",
  "icMarkupPct": <number>,
  "icMarkupPerTxn": <number>,
  "notes": "<1-2 sentence summary>"
}`,
        messages: [{ role: "user", content }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: err });
    }

    const data = await response.json();
    const raw = data.content?.find(b => b.type === "text")?.text || "{}";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
