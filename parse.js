export const config = {
  api: {
    bodyParser: { sizeLimit: '50mb' },
    responseLimit: '50mb',
  },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Max-Age", "86400");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
  try {
    const { fileBase64, mimeType, csvText } = req.body;
    let messages;
    if (csvText) {
      messages = [{ role: "user", content: `You are an expert at reading merchant processing statement CSV exports. Analyze this CSV and extract fee totals. Return ONLY valid JSON with no markdown:\n{"totalVolume":number,"transactionCount":number,"discountFees":number,"transactionFees":number,"monthlyFees":number,"chargebackFees":number,"otherFees":number,"pricingModel":"interchange_plus","icMarkupPct":null,"icMarkupPerTxn":null,"notes":"brief summary"}\nCSV DATA:\n${csvText.substring(0, 8000)}` }];
    } else {
      if (!fileBase64 || !mimeType) return res.status(400).json({ error: "Missing fileBase64 or mimeType" });
      const isPDF = mimeType === "application/pdf";
      const isImage = mimeType.startsWith("image/");
      if (!isPDF && !isImage) return res.status(400).json({ error: "Unsupported file type: " + mimeType });
      const contentBlock = isPDF
        ? { type: "document", source: { type: "base64", media_type: "application/pdf", data: fileBase64 } }
        : { type: "image", source: { type: "base64", media_type: mimeType, data: fileBase64 } };
      messages = [{ role: "user", content: [contentBlock, { type: "text", text: `You are an expert at reading FISERV, Toast, Square, Heartland merchant statements. Extract ALL fees and return ONLY valid JSON with no markdown:\n{"totalVolume":number,"transactionCount":number,"discountFees":number,"transactionFees":number,"monthlyFees":number,"chargebackFees":number,"otherFees":number,"pricingModel":"interchange_plus","icMarkupPct":null,"icMarkupPerTxn":null,"notes":"brief summary"}\ntotalVolume = gross card sales (Net Sales, Total Sales, Total Volume — NOT fee amounts)\ntransactionCount = total number of transactions\ndiscountFees = all % of volume fees\ntransactionFees = all per-transaction fees\nmonthlyFees = fixed recurring fees\nchargebackFees = chargeback and dispute fees\notherFees = any other fees` }] }];
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-opus-4-5", max_tokens: 1024, messages }),
    });
    if (!response.ok) { const e = await response.text(); return res.status(response.status).json({ error: e }); }
    const data = await response.json();
    const text = (data.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
    try { return res.status(200).json(JSON.parse(text)); }
    catch(e) { return res.status(500).json({ error: "Bad JSON: " + text.substring(0, 300) }); }
  } catch(err) { return res.status(500).json({ error: err.message }); }
}
