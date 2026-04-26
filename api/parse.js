export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: '50mb',
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });

  try {
    const { fileBase64, mimeType } = req.body;
    if (!fileBase64 || !mimeType) return res.status(400).json({ error: "Missing fileBase64 or mimeType" });

    const isImage = mimeType.startsWith("image/");
    const isPDF = mimeType === "application/pdf";
    if (!isImage && !isPDF) return res.status(400).json({ error: "Unsupported file type" });

    const contentBlock = isPDF
      ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: fileBase64 } }
      : { type: "image", source: { type: "base64", media_type: mimeType, data: fileBase64 } };

    const prompt = `You are an expert at reading merchant processing statements, especially FISERV, First Data, Heartland, TSYS, Elavon, and Square statements.

Carefully analyze this merchant statement and extract ALL fees. Be thorough — look at every line item.

IMPORTANT DEFINITIONS:
- totalVolume: Total gross card sales volume processed (look for "Net Sales", "Total Sales", "Gross Sales", "Total Volume" — NOT fee amounts)
- transactionCount: Total number of transactions (look for "Total Items", "Transaction Count", "Total Transactions")
- discountFees: ALL percentage-based fees (Discount Rate fees, Interchange fees, Assessment fees, Network fees — anything calculated as a % of volume)
- transactionFees: ALL per-transaction fees (Authorization fees, Per Item fees, Transaction fees — charged per swipe/dip/tap)
- monthlyFees: Fixed recurring fees (Monthly Service Fee, Statement Fee, PCI Fee, Gateway Fee, Minimum Fee, Annual Fee)
- chargebackFees: Any chargeback, dispute, or retrieval fees
- otherFees: Any other fees not captured above (regulatory fees, batch fees, misc fees)

For FISERV statements specifically:
- Look for a "Fee Summary" or "Fee Detail" section
- "Discount" or "Discount Amount" = discountFees
- "Per Item" or "Per Transaction" = transactionFees
- "Monthly" or "Service" fees = monthlyFees
- Total volume is usually labeled "Net Sales" or "Total Bankcard Volume"

pricingModel options: "interchange_plus", "flat_rate", or "tiered"

Return ONLY valid JSON, no markdown, no explanation:
{
  "totalVolume": number,
  "transactionCount": number,
  "discountFees": number,
  "transactionFees": number,
  "monthlyFees": number,
  "chargebackFees": number,
  "otherFees": number,
  "pricingModel": "interchange_plus",
  "icMarkupPct": number or null,
  "icMarkupPerTxn": number or null,
  "notes": "brief summary of what you found and any caveats"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [contentBlock, { type: "text", text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const cleaned = text.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: "AI returned invalid JSON: " + text.substring(0, 200) });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
