export const config={api:{bodyParser:{sizeLimit:'50mb'},responseLimit:'50mb'}};
export default async function handler(req,res){
res.setHeader("Access-Control-Allow-Origin","*");
res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
res.setHeader("Access-Control-Allow-Headers","*");
if(req.method==="OPTIONS"){res.status(200).end();return;}
if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
const apiKey=process.env.ANTHROPIC_API_KEY;
if(!apiKey)return res.status(500).json({error:"ANTHROPIC_API_KEY not configured"});
try{
const{fileBase64,mimeType,csvText}=req.body;
let messages;
if(csvText){messages=[{role:"user",content:`Extract merchant fees from this CSV. Return ONLY JSON:\n{"totalVolume":0,"transactionCount":0,"discountFees":0,"transactionFees":0,"monthlyFees":0,"chargebackFees":0,"otherFees":0,"notes":""}\nCSV:\n${csvText.substring(0,8000)}`}];}
else{
if(!fileBase64||!mimeType)return res.status(400).json({error:"Missing fields"});
const block=mimeType==="application/pdf"?{type:"document",source:{type:"base64",media_type:"application/pdf",data:fileBase64}}:{type:"image",source:{type:"base64",media_type:mimeType,data:fileBase64}};
messages=[{role:"user",content:[block,{type:"text",text:`Extract ALL fees from this merchant statement. Return ONLY JSON no markdown:\n{"totalVolume":number,"transactionCount":number,"discountFees":number,"transactionFees":number,"monthlyFees":number,"chargebackFees":number,"otherFees":number,"notes":"summary"}\ntotalVolume=gross card sales NOT fees. discountFees=interchange/discount rate fees. transactionFees=per-item fees. monthlyFees=fixed fees.`}]}];}
const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-opus-4-5",max_tokens:1024,messages})});
if(!r.ok){const e=await r.text();return res.status(r.status).json({error:e});}
const d=await r.json();
const t=(d.content?.[0]?.text||"").replace(/```json|```/g,"").trim();
try{return res.status(200).json(JSON.parse(t));}
catch(e){return res.status(500).json({error:"Bad JSON: "+t.substring(0,200)});}
}catch(e){return res.status(500).json({error:e.message});}}
