<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Vori Payments Analyzer</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0D0D1A;font-family:'DM Sans',sans-serif;color:#F0F0FF;}
    input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
    input[type=number]{-moz-appearance:textfield;}
    @keyframes spin{to{transform:rotate(360deg);}}
    @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
    .fade{animation:fadeIn 0.3s ease;}
    ::-webkit-scrollbar{width:6px;height:6px;}
    ::-webkit-scrollbar-track{background:#13132A;}
    ::-webkit-scrollbar-thumb{background:#2A2A50;border-radius:3px;}
  </style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const {useState,useMemo,useRef,useCallback}=React;
const C={bg:"#0D0D1A",sur:"#13132A",alt:"#1A1A30",bdr:"#2A2A50",pur:"#8B5CF6",pdim:"#7C3AED",pbg:"rgba(139,92,246,0.08)",txt:"#F0F0FF",mut:"#9B9BC4",sub:"#4A4A78",grn:"#22c55e",red:"#EF4444",yel:"#F59E0B",wht:"#FFFFFF"};
const f$=v=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(v||0);
const fp=(v,d=3)=>(!v||isNaN(v)||!isFinite(v))?"—":`${Number(v).toFixed(d)}%`;
const n=v=>parseFloat(v)||0;
const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const MCC_5311_CONTEXT = {
  avgRate: 2.1,
  description: "Department Store (MCC 5311)",
  note: "Visa/MC typically charge ~1.43-1.58% interchange for MCC 5311 consumer cards. Debit cards run lower (~0.05% + $0.21 for regulated). Your effective rate above 2.5% likely means high markup or tiered pricing."
};

function rateColor(r){
  if(!r||r===0)return C.mut;
  if(r<1.8)return"#4ADE80";
  if(r<2.2)return"#86EFAC";
  if(r<2.8)return C.yel;
  if(r<3.5)return"#FB923C";
  return C.red;
}
function rateLabel(r){
  if(!r||r===0)return"—";
  if(r<1.8)return"Excellent ✦";
  if(r<2.2)return"Good";
  if(r<2.8)return"Average";
  if(r<3.5)return"High ⚠";
  return"Very High ⛔";
}

function calcStatement(s){
  const v=n(s.vol),t=n(s.txn),d=n(s.disc),tf=n(s.txnf),m=n(s.mnth),c=n(s.cb),o=n(s.oth);
  const tot=d+tf+m+c+o;
  const er=v>0?(tot/v)*100:0;
  const pr=v>0?((d+tf)/v)*100:0;
  const cpt=t>0?tot/t:0;
  const avg=t>0&&v>0?v/t:0;
  return{v,t,tot,er,pr,cpt,avg,d,tf,m,c,o};
}

async function parseAI(b64,mime){
  const res=await fetch("/api/parse",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({fileBase64:b64,mimeType:mime})
  });
  const text=await res.text();
  if(!res.ok)throw new Error(text);
  try{return JSON.parse(text);}catch(e){throw new Error("Invalid response: "+text.substring(0,150));}
}

async function toBase64(file){
  return new Promise((res,rej)=>{
    const r=new FileReader();
    r.onload=()=>res(r.result.split(",")[1]);
    r.onerror=rej;
    r.readAsDataURL(file);
  });
}

// ---- COMPONENTS ----
const Label=({s})=><p style={{margin:"0 0 4px",fontSize:"0.63rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.mut}}>{s}</p>;

function NumField({label,pre,suf,val,set,hint}){
  const[foc,setFoc]=useState(false);
  return(
    <div style={{marginBottom:"0.8rem"}}>
      {label&&<Label s={label}/>}
      <div style={{display:"flex",alignItems:"center",background:C.bg,border:`1px solid ${foc?C.pur+"80":C.bdr}`,borderRadius:6,overflow:"hidden"}}>
        {pre&&<span style={{padding:"0 8px",color:C.sub,fontSize:"0.8rem"}}>{pre}</span>}
        <input type="number" min="0" step="any" value={val}
          onChange={e=>set(e.target.value)}
          onFocus={()=>setFoc(true)} onBlur={()=>setFoc(false)}
          placeholder="0"
          style={{flex:1,background:"transparent",border:"none",outline:"none",color:C.txt,fontSize:"0.88rem",fontFamily:"'DM Mono',monospace",padding:"8px 6px"}}/>
        {suf&&<span style={{padding:"0 8px",color:C.sub,fontSize:"0.78rem"}}>{suf}</span>}
      </div>
      {hint&&<p style={{margin:"2px 0 0",fontSize:"0.62rem",color:C.sub}}>{hint}</p>}
    </div>
  );
}

function KPI({label,val,sub,accent,color}){
  return(
    <div style={{background:accent?"linear-gradient(135deg,#3b1f8c,#1e0e5c)":C.alt,border:`1px solid ${accent?C.pur+"50":C.bdr}`,borderRadius:10,padding:"0.9rem"}}>
      <p style={{margin:0,fontSize:"0.6rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:accent?C.pur+"cc":C.mut}}>{label}</p>
      <p style={{margin:"3px 0 0",fontSize:"1.25rem",fontWeight:800,color:color||(accent?C.pur:C.txt),fontFamily:"'DM Mono',monospace",lineHeight:1}}>{val}</p>
      {sub&&<p style={{margin:"3px 0 0",fontSize:"0.65rem",color:C.sub}}>{sub}</p>}
    </div>
  );
}

function BarRow({label,val,total,color}){
  const pct=total>0?(val/total)*100:0;
  return(
    <div style={{marginBottom:"0.65rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:"0.7rem",color:C.mut}}>{label}</span>
        <div style={{display:"flex",gap:12}}>
          <span style={{fontSize:"0.7rem",color:C.sub}}>{val>0?`${pct.toFixed(1)}%`:"—"}</span>
          <span style={{fontSize:"0.7rem",fontFamily:"monospace",color:C.txt,minWidth:65,textAlign:"right"}}>{val>0?f$(val):"—"}</span>
        </div>
      </div>
      <div style={{height:3,background:C.bdr,borderRadius:2}}>
        <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:color,borderRadius:2,transition:"width 0.4s ease"}}/>
      </div>
    </div>
  );
}

function SectionHead({icon,title}){
  return(
    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.85rem",paddingBottom:"0.5rem",borderBottom:`1px solid ${C.bdr}`}}>
      <span style={{fontSize:"0.8rem"}}>{icon}</span>
      <h3 style={{margin:0,fontSize:"0.63rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.mut}}>{title}</h3>
    </div>
  );
}

// Mini sparkline bar chart
function TrendChart({statements}){
  const valid=statements.filter(s=>s.vol&&n(s.vol)>0);
  if(valid.length<2)return null;
  const maxRate=Math.max(...valid.map(s=>calcStatement(s).er));
  return(
    <div style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"1.2rem",marginBottom:"1.2rem"}}>
      <SectionHead icon="📈" title="Effective Rate Trend"/>
      <div style={{display:"flex",alignItems:"flex-end",gap:8,height:80}}>
        {valid.map((s,i)=>{
          const{er}=calcStatement(s);
          const pct=maxRate>0?(er/maxRate)*100:0;
          const col=rateColor(er);
          return(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <span style={{fontSize:"0.6rem",color:col,fontFamily:"monospace"}}>{fp(er,2)}</span>
              <div style={{width:"100%",background:col+"40",borderRadius:"4px 4px 0 0",height:`${Math.max(pct,8)}%`,transition:"height 0.4s ease",borderBottom:`2px solid ${col}`}}/>
              <span style={{fontSize:"0.6rem",color:C.sub,whiteSpace:"nowrap"}}>{s.label||`S${i+1}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Side-by-side comparison table
function CompareTable({statements}){
  const valid=statements.filter(s=>n(s.vol)>0);
  if(valid.length<2)return null;
  const rows=[
    {label:"Volume",fn:s=>f$(calcStatement(s).v)},
    {label:"Transactions",fn:s=>calcStatement(s).t>0?calcStatement(s).t.toLocaleString():"—"},
    {label:"Total Fees",fn:s=>f$(calcStatement(s).tot)},
    {label:"Effective Rate",fn:s=>fp(calcStatement(s).er),highlight:true},
    {label:"Cost Per Txn",fn:s=>calcStatement(s).cpt>0?f$(calcStatement(s).cpt):"—"},
    {label:"Avg Ticket",fn:s=>calcStatement(s).avg>0?f$(calcStatement(s).avg):"—"},
    {label:"Discount Fees",fn:s=>f$(calcStatement(s).d)},
    {label:"Per-Txn Fees",fn:s=>f$(calcStatement(s).tf)},
    {label:"Monthly Fees",fn:s=>f$(calcStatement(s).m)},
  ];
  return(
    <div style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"1.2rem",marginBottom:"1.2rem",overflowX:"auto"}}>
      <SectionHead icon="🔀" title="Statement Comparison"/>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.75rem"}}>
        <thead>
          <tr>
            <th style={{textAlign:"left",padding:"6px 8px",color:C.mut,fontWeight:600,borderBottom:`1px solid ${C.bdr}`}}>Metric</th>
            {valid.map((s,i)=>(
              <th key={i} style={{textAlign:"right",padding:"6px 8px",color:C.pur,fontWeight:700,borderBottom:`1px solid ${C.bdr}`,whiteSpace:"nowrap"}}>{s.label||`Statement ${i+1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri)=>{
            const vals=valid.map(s=>row.fn(s));
            return(
              <tr key={ri} style={{background:ri%2===0?"transparent":C.alt+"80"}}>
                <td style={{padding:"6px 8px",color:C.mut}}>{row.label}</td>
                {vals.map((v,vi)=>(
                  <td key={vi} style={{textAlign:"right",padding:"6px 8px",fontFamily:"monospace",color:row.highlight?rateColor(calcStatement(valid[vi]).er):C.txt,fontWeight:row.highlight?700:400}}>{v}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Single statement panel
function StatementPanel({stmt,index,onChange,onRemove}){
  const[loading,setLoading]=useState(false);
  const[err,setErr]=useState("");
  const[drag,setDrag]=useState(false);
  const fileRef=useRef();
  const calc=calcStatement(stmt);

  const processFile=async(file)=>{
    if(!file)return;
    const ok=["application/pdf","image/png","image/jpeg","image/jpg","image/webp"];
    if(!ok.includes(file.type)){setErr("Upload a PDF or image.");return;}
    setErr("");setLoading(true);
    try{
      const b64=await toBase64(file);
      const result=await parseAI(b64,file.type);
      const updates={fname:file.name};
      if(result.totalVolume)updates.vol=String(result.totalVolume);
      if(result.transactionCount)updates.txn=String(result.transactionCount);
      if(result.discountFees)updates.disc=String(result.discountFees);
      if(result.transactionFees)updates.txnf=String(result.transactionFees);
      if(result.monthlyFees)updates.mnth=String(result.monthlyFees);
      if(result.chargebackFees)updates.cb=String(result.chargebackFees);
      if(result.otherFees)updates.oth=String(result.otherFees);
      if(result.notes)updates.notes=result.notes;
      onChange(updates);
    }catch(e){
      setErr("Error: "+e.message);
    }finally{setLoading(false);}
  };

  const set=key=>val=>onChange({[key]:val});

  return(
    <div className="fade" style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:16,overflow:"hidden"}}>
      {/* Header */}
      <div style={{background:C.alt,padding:"0.9rem 1.1rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:24,height:24,borderRadius:6,background:C.pbg,border:`1px solid ${C.pur}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:800,color:C.pur}}>{index+1}</div>
          <input value={stmt.label||""} onChange={e=>onChange({label:e.target.value})} placeholder={`Statement ${index+1} — e.g. "Dec 2024"`}
            style={{background:"transparent",border:"none",outline:"none",color:C.txt,fontSize:"0.82rem",fontWeight:600,minWidth:180}}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {calc.er>0&&<span style={{fontSize:"0.75rem",fontWeight:800,fontFamily:"monospace",color:rateColor(calc.er)}}>{fp(calc.er,2)} · {rateLabel(calc.er)}</span>}
          {onRemove&&<button onClick={onRemove} style={{background:"transparent",border:"none",cursor:"pointer",color:C.sub,fontSize:"0.8rem",padding:"2px 6px"}}>✕</button>}
        </div>
      </div>

      <div style={{padding:"1.1rem"}}>
        {/* Upload zone */}
        <div onClick={()=>fileRef.current?.click()}
          onDrop={e=>{e.preventDefault();setDrag(false);processFile(e.dataTransfer.files[0]);}}
          onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
          style={{border:`2px dashed ${drag?C.pur:loading?C.pur+"60":C.bdr}`,borderRadius:10,padding:"1rem",textAlign:"center",background:drag?C.pbg:"transparent",cursor:"pointer",marginBottom:"1rem",transition:"all 0.2s"}}>
          <input ref={fileRef} type="file" accept=".pdf,image/*" style={{display:"none"}} onChange={e=>processFile(e.target.files[0])}/>
          {loading?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <div style={{width:16,height:16,border:`2px solid ${C.pur}30`,borderTop:`2px solid ${C.pur}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
              <span style={{fontSize:"0.75rem",color:C.pur}}>AI reading statement…</span>
            </div>
          ):stmt.fname?(
            <div>
              <span style={{fontSize:"0.75rem",color:C.pur,fontWeight:600}}>✅ {stmt.fname}</span>
              <span style={{fontSize:"0.7rem",color:C.sub,display:"block",marginTop:2}}>Click to replace</span>
            </div>
          ):(
            <div>
              <div style={{fontSize:"1.3rem",marginBottom:4}}>📄</div>
              <span style={{fontSize:"0.75rem",color:C.mut,fontWeight:600}}>Click or drag to upload statement</span>
              <span style={{fontSize:"0.68rem",color:C.sub,display:"block",marginTop:2}}>PDF, PNG, JPG — AI auto-fills fields</span>
            </div>
          )}
        </div>

        {err&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:8,padding:"0.6rem 0.8rem",marginBottom:"0.8rem",fontSize:"0.72rem",color:"#FCA5A5"}}>⚠️ {err}</div>}
        {stmt.notes&&<div style={{background:C.pbg,border:`1px solid ${C.pur}25`,borderRadius:8,padding:"0.6rem 0.8rem",marginBottom:"0.8rem",fontSize:"0.7rem",color:C.pur}}>✦ {stmt.notes}</div>}

        {/* Fields grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem"}}>
          <NumField label="Monthly Volume" pre="$" val={stmt.vol} set={set("vol")} hint="Total sales processed"/>
          <NumField label="# Transactions" val={stmt.txn} set={set("txn")} hint="Total transaction count"/>
          <NumField label="Discount Fees" pre="$" val={stmt.disc} set={set("disc")} hint="% of volume fees"/>
          <NumField label="Per-Txn Fees" pre="$" val={stmt.txnf} set={set("txnf")} hint="Per-item fees"/>
          <NumField label="Monthly Fixed" pre="$" val={stmt.mnth} set={set("mnth")} hint="Statement, PCI, etc"/>
          <NumField label="Other Fees" pre="$" val={stmt.oth} set={set("oth")} hint="Chargebacks + misc"/>
        </div>

        {/* KPIs */}
        {calc.tot>0&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0.6rem",marginTop:"0.8rem"}}>
            <KPI label="Effective Rate" val={fp(calc.er)} color={rateColor(calc.er)} accent/>
            <KPI label="Total Fees" val={f$(calc.tot)}/>
            <KPI label="Cost / Txn" val={calc.cpt>0?f$(calc.cpt):"—"}/>
          </div>
        )}
      </div>
    </div>
  );
}

function emptyStmt(label=""){
  return{label,fname:"",notes:"",vol:"",txn:"",disc:"",txnf:"",mnth:"",cb:"",oth:""};
}

// ---- MAIN APP ----
function App(){
  const[statements,setStatements]=useState([emptyStmt("Statement 1")]);
  const[activeTab,setActiveTab]=useState("statements"); // "statements" | "compare"
  const[showMCC,setShowMCC]=useState(false);
  const[qr,setQr]=useState("");
  const[qpt,setQpt]=useState("");

  const updateStmt=(i,updates)=>setStatements(prev=>prev.map((s,idx)=>idx===i?{...s,...updates}:s));
  const removeStmt=i=>setStatements(prev=>prev.filter((_,idx)=>idx!==i));
  const addStmt=()=>setStatements(prev=>[...prev,emptyStmt(`Statement ${prev.length+1}`)]);

  const validStmts=statements.filter(s=>n(s.vol)>0);
  const hasMultiple=validStmts.length>=2;

  // Aggregate totals across all valid statements
  const totals=useMemo(()=>{
    if(validStmts.length===0)return null;
    const agg=validStmts.reduce((acc,s)=>{
      const c=calcStatement(s);
      return{v:acc.v+c.v,t:acc.t+c.t,tot:acc.tot+c.tot,d:acc.d+c.d,tf:acc.tf+c.tf,m:acc.m+c.m,c:acc.c+c.c,o:acc.o+c.o};
    },{v:0,t:0,tot:0,d:0,tf:0,m:0,c:0,o:0});
    const months=validStmts.length;
    agg.er=agg.v>0?(agg.tot/agg.v)*100:0;
    agg.pr=agg.v>0?((agg.d+agg.tf)/agg.v)*100:0;
    agg.cpt=agg.t>0?agg.tot/agg.t:0;
    agg.avg=agg.t>0&&agg.v>0?agg.v/agg.t:0;
    agg.months=months;
    agg.annualVol=agg.v/months*12;
    agg.annualFees=agg.tot/months*12;
    return agg;
  },[validStmts]);

  const qcost=totals&&n(qr)>0?((totals.v/totals.months)*(n(qr)/100)+(totals.t/totals.months)*n(qpt)):0;
  const qeff=totals&&qcost>0&&totals.v>0?(qcost/(totals.v/totals.months))*100:0;
  const actualMonthly=totals?totals.tot/totals.months:0;
  const sav=qcost>0?qcost-actualMonthly:null;

  return(
    <div style={{minHeight:"100vh",background:C.bg,padding:"1.5rem 1rem 3rem"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>

        {/* HEADER */}
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",flexWrap:"wrap",gap:"1rem",marginBottom:"1.8rem"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.8rem"}}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill={C.pur}/>
                <path d="M7 8l7 12 7-12" stroke="#0D0D1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{fontSize:"1.15rem",fontWeight:800,color:C.wht}}>vori</span>
              <span style={{width:1,height:16,background:C.bdr}}/>
              <span style={{fontSize:"0.72rem",color:C.mut}}>Payments Analyzer</span>
            </div>
            <h1 style={{margin:"0 0 0.3rem",fontSize:"clamp(1.6rem,3.5vw,2.3rem)",fontWeight:800,lineHeight:1.1,letterSpacing:"-0.02em"}}>
              Uncover Your True <span style={{color:C.pur}}>Processing Cost</span>
            </h1>
            <p style={{margin:0,color:C.mut,fontSize:"0.85rem"}}>Upload statements — AI extracts every fee automatically. Compare months, spot overcharges.</p>
          </div>
          {totals&&totals.er>0&&(
            <div style={{background:C.sur,border:`1.5px solid ${rateColor(totals.er)}40`,borderRadius:14,padding:"1rem 1.3rem",textAlign:"center"}}>
              <p style={{margin:0,fontSize:"0.58rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.mut}}>Blended Effective Rate</p>
              <p style={{margin:"3px 0",fontSize:"1.8rem",fontWeight:800,fontFamily:"monospace",color:rateColor(totals.er),lineHeight:1}}>{fp(totals.er)}</p>
              <p style={{margin:0,fontSize:"0.68rem",color:rateColor(totals.er)}}>{rateLabel(totals.er)}</p>
            </div>
          )}
        </div>

        {/* MCC BANNER */}
        <div style={{background:C.pbg,border:`1px solid ${C.pur}30`,borderRadius:12,padding:"0.8rem 1.1rem",marginBottom:"1.5rem",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between"}}
          onClick={()=>setShowMCC(!showMCC)}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:"0.8rem"}}>🏬</span>
            <span style={{fontSize:"0.75rem",fontWeight:700,color:C.pur}}>MCC 5311 — Department Store</span>
            <span style={{fontSize:"0.72rem",color:C.mut}}>· Typical effective rate: 1.8–2.3%</span>
          </div>
          <span style={{fontSize:"0.7rem",color:C.sub}}>{showMCC?"▲":"▼"} Context</span>
        </div>
        {showMCC&&(
          <div className="fade" style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"1rem 1.2rem",marginBottom:"1.5rem",fontSize:"0.77rem",color:C.mut,lineHeight:1.6}}>
            <strong style={{color:C.txt}}>MCC 5311 Interchange Benchmarks:</strong>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"0.5rem",marginTop:"0.6rem"}}>
              {[["Visa Consumer Credit","1.43–1.58% + $0.10"],["Visa Consumer Debit (unregulated)","0.80% + $0.15"],["Visa Debit (regulated)","0.05% + $0.21"],["MC Consumer Credit","1.48–1.58% + $0.10"],["MC Debit (regulated)","0.05% + $0.21"],["Amex OptBlue","1.35–2.40% + varies"]].map(([name,rate])=>(
                <div key={name} style={{background:C.alt,borderRadius:7,padding:"0.5rem 0.7rem"}}>
                  <div style={{color:C.txt,fontSize:"0.72rem",fontWeight:600}}>{name}</div>
                  <div style={{color:C.pur,fontFamily:"monospace",fontSize:"0.7rem",marginTop:1}}>{rate}</div>
                </div>
              ))}
            </div>
            <p style={{marginTop:"0.7rem",color:C.sub,fontSize:"0.71rem"}}>{MCC_5311_CONTEXT.note}</p>
          </div>
        )}

        {/* TABS */}
        {hasMultiple&&(
          <div style={{display:"flex",gap:4,marginBottom:"1.2rem",background:C.sur,borderRadius:10,padding:4,width:"fit-content"}}>
            {[{id:"statements",label:"📋 Statements"},{id:"compare",label:"🔀 Compare"}].map(t=>(
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{padding:"6px 16px",borderRadius:7,border:"none",cursor:"pointer",fontSize:"0.75rem",fontWeight:700,background:activeTab===t.id?C.pur:"transparent",color:activeTab===t.id?C.wht:C.mut,transition:"all 0.15s"}}>
                {t.label}
              </button>
            ))}
          </div>
        )}

        {activeTab==="compare"&&hasMultiple&&(
          <div className="fade">
            <TrendChart statements={statements}/>
            <CompareTable statements={statements}/>
          </div>
        )}

        {(activeTab==="statements"||!hasMultiple)&&(
          <div>
            {/* Statement panels */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(420px,1fr))",gap:"1.2rem",marginBottom:"1.2rem"}}>
              {statements.map((s,i)=>(
                <StatementPanel key={i} stmt={s} index={i}
                  onChange={updates=>updateStmt(i,updates)}
                  onRemove={statements.length>1?()=>removeStmt(i):null}/>
              ))}
            </div>

            {/* Add statement button */}
            <button onClick={addStmt}
              style={{width:"100%",padding:"0.85rem",background:"transparent",border:`2px dashed ${C.bdr}`,borderRadius:14,cursor:"pointer",color:C.sub,fontSize:"0.78rem",fontWeight:600,marginBottom:"1.5rem",transition:"all 0.2s"}}
              onMouseEnter={e=>{e.target.style.borderColor=C.pur;e.target.style.color=C.pur;}}
              onMouseLeave={e=>{e.target.style.borderColor=C.bdr;e.target.style.color=C.sub;}}>
              + Add Another Statement
            </button>

            {/* Summary section — only if data */}
            {totals&&(
              <div>
                <div style={{marginBottom:"1rem",paddingBottom:"0.6rem",borderBottom:`1px solid ${C.bdr}`}}>
                  <h2 style={{margin:0,fontSize:"0.65rem",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:C.mut}}>
                    {totals.months>1?"📊 Blended Summary — All Statements":"📊 Summary"}
                  </h2>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.2rem"}}>
                  {/* Left: KPIs */}
                  <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
                    <div style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"1.2rem"}}>
                      <SectionHead icon="💡" title="True Cost"/>
                      <div style={{display:"grid",gap:"0.6rem"}}>
                        <KPI label={totals.months>1?"Blended Effective Rate":"Effective Rate — All In"} val={fp(totals.er)} color={rateColor(totals.er)} accent/>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                          <KPI label="Avg Monthly Fees" val={f$(totals.tot/totals.months)}/>
                          <KPI label="Cost Per Transaction" val={totals.cpt>0?f$(totals.cpt):"—"}/>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                          <KPI label="Annual Volume (proj)" val={f$(totals.annualVol)}/>
                          <KPI label="Annual Fees (proj)" val={f$(totals.annualFees)}/>
                        </div>
                      </div>
                    </div>

                    {/* Quoted vs Actual */}
                    <div style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"1.2rem"}}>
                      <SectionHead icon="⚖️" title="Compare to Quoted Rate"/>
                      <NumField label="Quoted Rate" suf="%" val={qr} set={setQr} hint="e.g. 2.5"/>
                      <NumField label="Quoted Per-Transaction" pre="$" val={qpt} set={setQpt} hint="e.g. 0.10"/>
                      {qcost>0&&(
                        <div className="fade">
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem",marginBottom:"0.6rem"}}>
                            <KPI label="Quoted Monthly Cost" val={f$(qcost)} sub={`${fp(qeff,2)} effective`}/>
                            <KPI label="Actual Monthly Cost" val={f$(actualMonthly)} sub={`${fp(totals.er,2)} effective`}/>
                          </div>
                          {sav!==null&&(
                            <div style={{background:sav>0?"rgba(239,68,68,0.08)":"rgba(34,197,94,0.08)",border:`1px solid ${sav>0?"rgba(239,68,68,0.3)":"rgba(34,197,94,0.3)"}`,borderRadius:9,padding:"0.7rem 0.9rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                              <span style={{fontSize:"0.74rem",color:sav>0?"#FCA5A5":"#86EFAC"}}>{sav>0?"⚠️ Paying MORE than quoted":"✅ Paying LESS than quoted"}</span>
                              <span style={{fontFamily:"monospace",fontWeight:800,color:sav>0?C.red:C.grn}}>{sav>0?"+":"-"}{f$(Math.abs(sav))}/mo</span>
                            </div>
                          )}
                          {sav>0&&<p style={{marginTop:"0.5rem",fontSize:"0.68rem",color:C.sub}}>Annual overcharge: <span style={{color:C.red,fontWeight:700}}>{f$(sav*12)}</span></p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Fee breakdown */}
                  <div style={{background:C.sur,border:`1px solid ${C.bdr}`,borderRadius:14,padding:"1.2rem"}}>
                    <SectionHead icon="📋" title="Fee Breakdown"/>
                    <BarRow label="Discount / Interchange" val={totals.d} total={totals.tot} color="#8B5CF6"/>
                    <BarRow label="Per-Transaction Fees" val={totals.tf} total={totals.tot} color="#A78BFA"/>
                    <BarRow label="Monthly Fixed Fees" val={totals.m} total={totals.tot} color="#60A5FA"/>
                    <BarRow label="Chargeback Fees" val={totals.c} total={totals.tot} color="#F472B6"/>
                    <BarRow label="Other Fees" val={totals.o} total={totals.tot} color="#94A3B8"/>
                    <div style={{marginTop:"0.8rem",paddingTop:"0.6rem",borderTop:`1px solid ${C.bdr}`,display:"flex",justifyContent:"space-between"}}>
                      <span style={{fontSize:"0.75rem",fontWeight:700,color:C.txt}}>Total Fees {totals.months>1?"(all periods)":""}</span>
                      <span style={{fontFamily:"monospace",fontWeight:800,color:C.pur}}>{f$(totals.tot)}</span>
                    </div>
                    {totals.months>1&&(
                      <div style={{marginTop:"0.3rem",display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:"0.7rem",color:C.sub}}>Monthly average</span>
                        <span style={{fontFamily:"monospace",fontSize:"0.78rem",color:C.mut}}>{f$(totals.tot/totals.months)}</span>
                      </div>
                    )}

                    {/* MCC context bar */}
                    {totals.er>0&&(
                      <div style={{marginTop:"1rem",paddingTop:"0.8rem",borderTop:`1px solid ${C.bdr}`}}>
                        <p style={{margin:"0 0 6px",fontSize:"0.62rem",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.mut}}>vs. MCC 5311 Benchmark</p>
                        <div style={{position:"relative",height:6,background:C.bdr,borderRadius:3,marginBottom:4}}>
                          <div style={{position:"absolute",left:`${Math.min((MCC_5311_CONTEXT.avgRate/5)*100,100)}%`,top:-3,width:2,height:12,background:C.yel,borderRadius:1}}/>
                          <div style={{width:`${Math.min((totals.er/5)*100,100)}%`,height:"100%",background:rateColor(totals.er),borderRadius:3}}/>
                        </div>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.62rem"}}>
                          <span style={{color:rateColor(totals.er)}}>Your rate: {fp(totals.er,2)}</span>
                          <span style={{color:C.yel}}>Benchmark: ~{MCC_5311_CONTEXT.avgRate}%</span>
                        </div>
                        {totals.er>MCC_5311_CONTEXT.avgRate&&(
                          <p style={{marginTop:"0.4rem",fontSize:"0.67rem",color:"#FB923C"}}>
                            ⚠️ {fp(totals.er-MCC_5311_CONTEXT.avgRate,2)} above MCC 5311 benchmark — {f$((totals.er-MCC_5311_CONTEXT.avgRate)/100*(totals.v/totals.months))}/mo in potential overcharges
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <p style={{textAlign:"center",marginTop:"2rem",fontSize:"0.6rem",color:C.sub}}>
          MCC 5311 · Effective rate = total fees ÷ total volume · Vori Payments Intelligence
        </p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
</script>
</body>
</html>
