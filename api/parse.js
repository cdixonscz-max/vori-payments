export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
    responseLimit: '25mb',
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

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({ error: "Missing fileBase64 or mimeType in request body." });
    }

    const content = mimeType === "application/pdf"
      ? [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: fileBase64 }
          },
          {
            type: "text",
            text: "This is a merchant payment processing statement (possibly multiple pages). Extract ALL fee and volume data from every page and return the totals."
          }
        ]
      : [
          {
            type: "image",
            source: { type: "base64", media_type: mimeType, data: fileBase64 }
          },
          {
            type: "text",
            text: "This is a merchant payment processing statement. Extract all fee and volume data."
          }
        ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `You are an expert at reading merchant payment processing statements — including multi-page statements.
Read ALL pages and sum up totals across the entire statement.
Return ONLY valid JSON with no markdown, no commentary, no extra text.
Use 0 for any value not found.

Return exactly this JSON:
{
  "totalVolume": <number>,
  "transactionCount": <number>,
  "discountFees": <number>,
  "transactionFees": <number>,
  "monthlyFees": <number>,
  "chargebackFees": <number>,
  "otherFees": <number>,
  "pricingModel": "interchange_plus" or "flat_rate" or "tiered" or "unknown",
  "icMarkupPct": <number>,
  "icMarkupPerTxn": <number>,
  "notes": "<1-2 sentence summary of what was found>"
}`,
        messages: [{ role: "user", content }]
      })
    });

    const responseText = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: responseText });
    }

    const data = JSON.parse(responseText);
    const raw = data.content?.find(b => b.type === "text")?.text || "{}";
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
