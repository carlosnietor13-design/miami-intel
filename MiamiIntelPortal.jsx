'use client';
import { useState } from "react";

// ============================================================
// MOCK PROPERTY DATABASE
// ============================================================
const PROPERTIES = [
  {
    id: "P001",
    address: "2847 SW 22nd Terrace",
    city: "Miami",
    zipCode: "33133",
    neighborhood: "Coconut Grove",
    propertyType: "Single Family",
    price: 895000,
    beds: 4,
    baths: 3,
    livingArea: 2100,
    lotSize: 7500,
    yearBuilt: 1978,
    hoa: 0,
    taxes: 9200,
    insuranceEstimate: 4800,
    estimatedRent: 5800,
    currentUse: "Owner Occupied",
    zoningCode: "RS-1",
    folio: "01-4122-000-0120",
    lastSalePrice: 620000,
    lastSaleDate: "2019-03-14",
    assessedValue: 780000,
    notes: "Corner lot, older home with good bones. Large lot for area.",
    tags: ["Value-Add", "Corner Lot", "Grove"],
    color: "#1a6b4a"
  },
  {
    id: "P002",
    address: "1401 Brickell Bay Dr #2204",
    city: "Miami",
    zipCode: "33131",
    neighborhood: "Brickell",
    propertyType: "Condo",
    price: 1250000,
    beds: 2,
    baths: 2,
    livingArea: 1320,
    lotSize: 0,
    yearBuilt: 2008,
    hoa: 1850,
    taxes: 13500,
    insuranceEstimate: 3200,
    estimatedRent: 7500,
    currentUse: "Rental",
    zoningCode: "SD-2",
    folio: "01-4139-082-2204",
    lastSalePrice: 980000,
    lastSaleDate: "2021-07-22",
    assessedValue: 1100000,
    notes: "Bay views, luxury building. Strong STR demand. No STR restriction in building.",
    tags: ["Best ROI", "STR-Friendly", "Brickell"],
    color: "#1a4a6b"
  },
  {
    id: "P003",
    address: "5812 NE 4th Avenue",
    city: "Miami",
    zipCode: "33137",
    neighborhood: "Little Haiti / MiMo District",
    propertyType: "Duplex",
    price: 680000,
    beds: 5,
    baths: 3,
    livingArea: 2400,
    lotSize: 6250,
    yearBuilt: 1963,
    hoa: 0,
    taxes: 7100,
    insuranceEstimate: 4200,
    estimatedRent: 6200,
    currentUse: "Tenant Occupied",
    zoningCode: "T4-R",
    folio: "01-3214-009-0380",
    lastSalePrice: 410000,
    lastSaleDate: "2018-11-05",
    assessedValue: 595000,
    notes: "Both units currently rented. T4-R zoning may allow additional density. Emerging corridor.",
    tags: ["Best Cash Flow", "Duplex", "Value-Add"],
    color: "#6b3a1a"
  },
  {
    id: "P004",
    address: "430 NW 28th Street",
    city: "Miami",
    zipCode: "33127",
    neighborhood: "Wynwood",
    propertyType: "Vacant Lot",
    price: 1100000,
    beds: 0,
    baths: 0,
    livingArea: 0,
    lotSize: 10500,
    yearBuilt: null,
    hoa: 0,
    taxes: 11000,
    insuranceEstimate: 1200,
    estimatedRent: 0,
    currentUse: "Vacant",
    zoningCode: "T5-O",
    folio: "01-3125-018-0550",
    lastSalePrice: 600000,
    lastSaleDate: "2020-04-30",
    assessedValue: 920000,
    notes: "T5-O zoning. Active Wynwood arts corridor. High development upside. Adjacent parcels being assembled.",
    tags: ["Development Play", "Wynwood", "T5 Zoning"],
    color: "#5a1a6b"
  },
  {
    id: "P005",
    address: "1220 Coral Way",
    city: "Miami",
    zipCode: "33145",
    neighborhood: "Coral Way",
    propertyType: "Townhouse",
    price: 725000,
    beds: 3,
    baths: 2.5,
    livingArea: 1850,
    lotSize: 2200,
    yearBuilt: 2016,
    hoa: 320,
    taxes: 7800,
    insuranceEstimate: 3600,
    estimatedRent: 4400,
    currentUse: "Owner Occupied",
    zoningCode: "T3-O",
    folio: "01-4108-044-0270",
    lastSalePrice: 590000,
    lastSaleDate: "2020-09-18",
    assessedValue: 660000,
    notes: "Modern construction, low maintenance. Good schools nearby. Miami corridor appreciation trend.",
    tags: ["Best Fit", "Family-Friendly", "Low Risk"],
    color: "#1a5c6b"
  },
  {
    id: "P006",
    address: "7801 Biscayne Blvd",
    city: "Miami",
    zipCode: "33138",
    neighborhood: "Upper East Side",
    propertyType: "Mixed Use",
    price: 2200000,
    beds: 6,
    baths: 4,
    livingArea: 4800,
    lotSize: 14000,
    yearBuilt: 1951,
    hoa: 0,
    taxes: 22000,
    insuranceEstimate: 9800,
    estimatedRent: 14500,
    currentUse: "Mixed Retail/Residential",
    zoningCode: "T6-8",
    folio: "01-3207-001-0120",
    lastSalePrice: 1400000,
    lastSaleDate: "2017-02-14",
    assessedValue: 1850000,
    notes: "Large T6 lot. Potential to build 8-story mixed use. Strong corridor improvement. Rare opportunity.",
    tags: ["Redevelopment", "T6 Zoning", "Rare"],
    color: "#6b1a2a"
  }
];

// ============================================================
// SCORING ENGINE
// ============================================================
function scoreProperty(property, profile) {
  let budgetScore = 0;
  let locationScore = 0;
  let featureScore = 0;
  let investmentScore = 0;
  let developmentScore = 0;
  const reasons = [];

  // Budget (25%)
  const priceFit = property.price <= profile.budget * 1.1;
  const monthlyPI = calcMortgagePI(property.price * (1 - (profile.downPayment || 20) / 100), 7.25, 30);
  const totalMonthly = monthlyPI + property.taxes / 12 + property.insuranceEstimate / 12 + property.hoa;
  const paymentFit = totalMonthly <= (profile.monthlyPaymentTarget || 99999) * 1.15;

  if (priceFit && paymentFit) { budgetScore = 100; reasons.push("Fits your budget and monthly target"); }
  else if (priceFit) { budgetScore = 75; reasons.push("Within purchase budget"); }
  else if (property.price <= profile.budget * 1.2) { budgetScore = 40; }
  else { budgetScore = 10; }

  // Location (20%)
  const preferred = profile.preferredAreas || [];
  const avoided = profile.avoidedAreas || [];
  if (avoided.some(a => property.neighborhood.toLowerCase().includes(a.toLowerCase()))) {
    locationScore = 0;
  } else if (preferred.length === 0 || preferred.some(a => property.neighborhood.toLowerCase().includes(a.toLowerCase()))) {
    locationScore = 90;
    if (preferred.some(a => property.neighborhood.toLowerCase().includes(a.toLowerCase()))) reasons.push("In your preferred area");
  } else {
    locationScore = 50;
  }

  // Features (15%)
  const bedMatch = !profile.beds || property.beds >= parseInt(profile.beds || 0);
  const typeMatch = !profile.propertyType || profile.propertyType === "Any" || property.propertyType.toLowerCase().includes(profile.propertyType.toLowerCase());
  if (bedMatch && typeMatch) { featureScore = 95; }
  else if (bedMatch || typeMatch) { featureScore = 60; }
  else { featureScore = 25; }

  // Investment (20%)
  if (profile.userType === "investor" || profile.userType === "developer") {
    const rentYield = property.estimatedRent > 0 ? (property.estimatedRent * 12 / property.price) * 100 : 0;
    if (rentYield >= 7) { investmentScore = 100; reasons.push("Strong rental yield above 7%"); }
    else if (rentYield >= 5) { investmentScore = 75; reasons.push("Solid rental income potential"); }
    else if (rentYield >= 3) { investmentScore = 50; }
    else { investmentScore = 20; }
  } else {
    investmentScore = 60;
  }

  // Development (20%)
  const devZones = ["T4", "T5", "T6", "SD", "duplex", "multifamily"];
  const hasDevPotential = devZones.some(z => property.zoningCode.toUpperCase().includes(z.toUpperCase()) || property.propertyType.toLowerCase().includes(z.toLowerCase()));
  const bigLot = property.lotSize >= 6000;
  if (profile.developmentInterest === "high" || profile.userType === "developer") {
    if (hasDevPotential && bigLot) { developmentScore = 100; reasons.push("Strong development upside—large lot + flexible zoning"); }
    else if (hasDevPotential || bigLot) { developmentScore = 65; reasons.push("Possible development potential—needs verification"); }
    else { developmentScore = 20; }
  } else {
    developmentScore = hasDevPotential ? 70 : 50;
  }

  const totalScore = Math.round(
    budgetScore * 0.25 + locationScore * 0.20 + featureScore * 0.15 + investmentScore * 0.20 + developmentScore * 0.20
  );

  return { budgetScore, locationScore, featureScore, investmentScore, developmentScore, totalScore, reasons };
}

// ============================================================
// FINANCIAL ENGINE
// ============================================================
function calcMortgagePI(principal, annualRate, years) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return Math.round(principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

function analyzeFinancials(property, profile, scenario = "base") {
  const downPct = (profile.downPayment || 20) / 100;
  const multiplier = scenario === "conservative" ? 0.88 : scenario === "aggressive" ? 1.12 : 1.0;
  const rateAdj = scenario === "conservative" ? 0.5 : scenario === "aggressive" ? -0.25 : 0;

  const loanAmount = property.price * (1 - downPct);
  const rate = 7.25 + rateAdj;
  const mortgagePI = calcMortgagePI(loanAmount, rate, 30);
  const taxesMonthly = Math.round(property.taxes / 12);
  const insuranceMonthly = Math.round(property.insuranceEstimate / 12);
  const hoaMonthly = property.hoa;
  const maintenanceReserve = Math.round(property.price * 0.01 / 12);
  const vacancyReserve = property.estimatedRent > 0 ? Math.round(property.estimatedRent * 0.08) : 0;
  const managementReserve = property.estimatedRent > 0 ? Math.round(property.estimatedRent * 0.10) : 0;

  const totalMonthlyCost = mortgagePI + taxesMonthly + insuranceMonthly + hoaMonthly + maintenanceReserve;
  const monthlyRent = Math.round(property.estimatedRent * multiplier);
  const grossIncome = monthlyRent * 12;
  const operatingExpenses = (taxesMonthly + insuranceMonthly + hoaMonthly + maintenanceReserve + vacancyReserve + managementReserve) * 12;
  const noi = grossIncome - operatingExpenses;
  const annualDebt = mortgagePI * 12;
  const annualCashFlow = noi - annualDebt;
  const downPaymentAmt = property.price * downPct;
  const cashOnCash = downPaymentAmt > 0 ? ((annualCashFlow / downPaymentAmt) * 100).toFixed(1) : "N/A";
  const capRate = property.price > 0 && noi > 0 ? ((noi / property.price) * 100).toFixed(2) : "N/A";
  const roi = downPaymentAmt > 0 ? (((annualCashFlow + property.price * 0.04) / downPaymentAmt) * 100).toFixed(1) : "N/A";

  return {
    loanAmount: Math.round(loanAmount),
    rate,
    mortgagePI,
    taxesMonthly,
    insuranceMonthly,
    hoaMonthly,
    maintenanceReserve,
    vacancyReserve,
    managementReserve,
    totalMonthlyCost,
    monthlyRent,
    grossIncome,
    operatingExpenses,
    noi: Math.round(noi),
    annualCashFlow: Math.round(annualCashFlow),
    cashOnCash,
    capRate,
    roi,
    downPaymentAmt: Math.round(downPaymentAmt),
    scenario
  };
}

// ============================================================
// ZONING ENGINE
// ============================================================
function analyzeZoning(property) {
  const z = property.zoningCode;
  const lot = property.lotSize;
  let maxUnits = 1, aduPotential = false, duplexPotential = false, multifamilyPotential = false, redevelopmentPotential = false;
  let densityClue = "Single-family residential";
  let confidence = "medium";
  let explanation = "";

  if (z.startsWith("T6") || z.includes("SD-2")) {
    maxUnits = lot > 10000 ? 20 : 8;
    multifamilyPotential = true;
    redevelopmentPotential = true;
    densityClue = "High-density mixed-use or multifamily";
    confidence = "high";
    explanation = `${z} zoning generally permits high-density development. Lot size of ${lot > 0 ? lot.toLocaleString() : "N/A"} sq ft may support significant unit count. Height allowances and FAR require municipal verification.`;
  } else if (z.startsWith("T5")) {
    maxUnits = lot > 8000 ? 12 : 6;
    multifamilyPotential = true;
    redevelopmentPotential = true;
    duplexPotential = true;
    densityClue = "Urban center—5-story possible";
    confidence = "high";
    explanation = `T5 zoning (Urban Center) in Miami's Transect system allows mid-rise multifamily. This lot may support 6–12 units depending on exact dimensions, setbacks, and parking requirements.`;
  } else if (z.startsWith("T4")) {
    maxUnits = 4;
    duplexPotential = true;
    aduPotential = true;
    densityClue = "General urban—duplex to fourplex range";
    confidence = "medium";
    explanation = `T4 zoning (General Urban) typically permits duplexes and potentially small multifamily. An ADU may also be possible. Exact allowances depend on lot dimensions and local variances.`;
  } else if (z.startsWith("T3")) {
    maxUnits = 2;
    aduPotential = lot >= 5000;
    densityClue = "Sub-urban—primarily single-family, possible ADU";
    confidence = "medium";
    explanation = `T3 (Sub-Urban) is primarily single-family. ADU potential if lot exceeds 5,000 sq ft—which ${lot >= 5000 ? "this lot does" : "this lot may not"}. Verification with City of Miami required.`;
  } else if (z.startsWith("RS")) {
    maxUnits = 1;
    aduPotential = lot >= 7500;
    densityClue = "Single-family only (RS zoning)";
    confidence = "high";
    explanation = `RS zoning is strictly residential single-family. No duplex or multifamily is typically permitted. ${lot >= 7500 ? "The larger lot may allow an accessory dwelling unit (ADU)—verify with Miami-Dade." : "Lot size limits additional unit potential."}`;
  } else {
    densityClue = "Custom / mixed-use zoning";
    confidence = "low";
    explanation = `Zoning code ${z} requires direct lookup in the Miami-Dade property portal and Gridics zoning map for accurate development parameters.`;
  }

  return {
    zoningCode: z,
    lotSize: lot,
    maxUnitsEstimated: maxUnits,
    aduPotential,
    duplexPotential,
    multifamilyPotential,
    redevelopmentPotential,
    densityClue,
    confidenceLevel: confidence,
    explanation,
    warnings: [
      "All zoning analysis is preliminary and must be verified with the City of Miami or Miami-Dade County.",
      "Actual unit count depends on setbacks, FAR, parking, and current code amendments.",
      "This analysis does not constitute legal or planning advice."
    ],
    sources: ["Miami-Dade Property Search", "City of Miami Miami 21 Code", "Gridics Zoning Map"]
  };
}

// ============================================================
// COLOR & UTILITY HELPERS
// ============================================================
const fmt = (n) => n != null ? `$${Math.round(n).toLocaleString()}` : "N/A";
const pct = (n) => n != null ? `${n}%` : "N/A";
const scoreColor = (s) => s >= 80 ? "#16a34a" : s >= 60 ? "#d97706" : "#dc2626";
const tagColors = {
  "Best Fit": { bg: "#dbeafe", text: "#1e40af" },
  "Best ROI": { bg: "#d1fae5", text: "#065f46" },
  "Best Cash Flow": { bg: "#d1fae5", text: "#065f46" },
  "Value-Add": { bg: "#fef3c7", text: "#92400e" },
  "Development Play": { bg: "#ede9fe", text: "#4c1d95" },
  "Redevelopment": { bg: "#ede9fe", text: "#4c1d95" },
  "Low Risk": { bg: "#e0f2fe", text: "#075985" },
  "STR-Friendly": { bg: "#fce7f3", text: "#9d174d" },
  "Family-Friendly": { bg: "#e0f2fe", text: "#075985" },
};

// ============================================================
// COMPONENTS
// ============================================================

const Tag = ({ label }) => {
  const style = tagColors[label] || { bg: "#f3f4f6", text: "#374151" };
  return (
    <span style={{ background: style.bg, color: style.text, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, letterSpacing: "0.3px" }}>
      {label}
    </span>
  );
};

const ScoreBar = ({ label, value, max = 100 }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ fontWeight: 600, color: scoreColor(value) }}>{value}</span>
    </div>
    <div style={{ background: "#f3f4f6", borderRadius: 99, height: 5 }}>
      <div style={{ width: `${(value / max) * 100}%`, height: 5, borderRadius: 99, background: scoreColor(value), transition: "width 0.6s ease" }} />
    </div>
  </div>
);

const Stat = ({ label, value, sub, highlight }) => (
  <div style={{ background: highlight ? "#f0fdf4" : "#f9fafb", borderRadius: 10, padding: "10px 14px", border: highlight ? "1px solid #bbf7d0" : "1px solid #e5e7eb" }}>
    <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: highlight ? "#15803d" : "#111827" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{sub}</div>}
  </div>
);

// ============================================================
// PAGES
// ============================================================

// --- LANDING PAGE ---
const LandingPage = ({ onStart, onAnalyze, onZoning, onPreApproval, onSeller, onStrategy }) => (
  <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f2027 100%)", fontFamily: "'Georgia', serif" }}>
    {/* Nav */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #10b981, #3b82f6)", borderRadius: 8 }} />
        <span style={{ color: "#f1f5f9", fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "sans-serif" }}>MiamiIntel</span>
      </div>
      <div style={{ display: "flex", gap: 20, fontSize: 14, color: "#94a3b8", fontFamily: "sans-serif", alignItems: "center" }}>
        <span style={{ cursor: "pointer", transition: "color 0.2s" }} onMouseOver={e => e.target.style.color = "#f1f5f9"} onMouseOut={e => e.target.style.color = "#94a3b8"}>Mercado</span>
        <span onClick={onSeller} style={{ cursor: "pointer", color: "#c084fc", fontWeight: 600 }}>¿Cuánto vale mi casa?</span>
        <span onClick={onPreApproval} style={{ cursor: "pointer", color: "#fbbf24", fontWeight: 600 }}>Pre-Aprobación</span>
      </div>
    </div>

    {/* Hero */}
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "72px 40px 56px", textAlign: "center" }}>
      <div style={{ display: "inline-block", background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 99, padding: "6px 16px", fontSize: 12, color: "#34d399", marginBottom: 32, fontFamily: "sans-serif", letterSpacing: "0.5px" }}>
        MIAMI REAL ESTATE INTELLIGENCE PLATFORM
      </div>
      <h1 style={{ fontSize: "clamp(34px, 6vw, 64px)", fontWeight: 700, color: "#f8fafc", lineHeight: 1.1, marginBottom: 24, letterSpacing: "-2px" }}>
        Find the right property<br />
        <span style={{ background: "linear-gradient(90deg, #10b981, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>with AI intelligence</span>
      </h1>
      <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 600, margin: "0 auto 44px", lineHeight: 1.7, fontFamily: "sans-serif", fontWeight: 400 }}>
        Comprá, vendé o invertí con datos reales, análisis financiero en tiempo real y asesoría IA del mercado de Miami.
      </p>

      {/* CTAs */}
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 60 }}>
        <button onClick={onStart} style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: 12, padding: "15px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", boxShadow: "0 4px 24px rgba(16,185,129,0.4)" }}>
          🔍 Buscar propiedades
        </button>
        <button onClick={onAnalyze} style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 12, padding: "15px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif" }}>
          📊 Analizar un link
        </button>
        <button onClick={onStrategy} style={{ background: "linear-gradient(135deg, #0f766e, #0d9488)", color: "white", border: "none", borderRadius: 12, padding: "15px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", boxShadow: "0 4px 24px rgba(13,148,136,0.4)" }}>
          🎯 6 Estrategias de Inversión
        </button>
        <button onClick={onSeller} style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", border: "none", borderRadius: 12, padding: "15px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", boxShadow: "0 4px 24px rgba(124,58,237,0.4)" }}>
          🏠 ¿Cuánto vale mi casa?
        </button>
        <button onClick={onPreApproval} style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 12, padding: "15px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "sans-serif", boxShadow: "0 4px 24px rgba(245,158,11,0.4)" }}>
          💰 Pre-Aprobación
        </button>
      </div>

      {/* Feature Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, textAlign: "left" }}>
        {[
          { icon: "🏠", title: "AI Property Matching", desc: "Scored against your exact budget, lifestyle, and goals." },
          { icon: "🎯", title: "6 Estrategias IA", desc: "Buy & Hold, Flip, BRRRR, House Hack, Value Add, Airbnb — proyecciones y consejos." },
          { icon: "🏡", title: "Valuación del Vendedor", desc: "Net sheet, comps reales, y qué hacer con el dinero de la venta." },
          { icon: "💰", title: "Pre-Aprobación IA", desc: "Calculá cuánto podés pedir prestado basado en tu perfil financiero." },
        ].map(f => (
          <div key={f.title} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 16px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 5, fontFamily: "sans-serif" }}>{f.title}</div>
            <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, fontFamily: "sans-serif" }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- AI INTAKE ---
const INTAKE_QUESTIONS = [
  { id: "userType", question: "What's your primary goal?", type: "choice", choices: [{ value: "homebuyer", label: "Buy a home to live in" }, { value: "investor", label: "Investment & rental income" }, { value: "developer", label: "Development / value-add" }] },
  { id: "budget", question: "What's your maximum purchase budget?", type: "choice", choices: [{ value: 500000, label: "Up to $500K" }, { value: 750000, label: "Up to $750K" }, { value: 1000000, label: "Up to $1M" }, { value: 2000000, label: "Up to $2M" }, { value: 5000000, label: "$2M+" }] },
  { id: "downPayment", question: "Down payment you're working with?", type: "choice", choices: [{ value: 5, label: "5% (FHA / low down)" }, { value: 10, label: "10%" }, { value: 20, label: "20% (conventional)" }, { value: 25, label: "25%+" }] },
  { id: "monthlyPaymentTarget", question: "Max comfortable monthly payment (PITI)?", type: "choice", choices: [{ value: 3500, label: "Under $3,500" }, { value: 5000, label: "Under $5,000" }, { value: 8000, label: "Under $8,000" }, { value: 15000, label: "Under $15,000" }, { value: 99999, label: "Not a constraint" }] },
  { id: "preferredAreas", question: "Preferred neighborhoods? (pick all that apply)", type: "multi", choices: [{ value: "Brickell", label: "Brickell" }, { value: "Coconut Grove", label: "Coconut Grove" }, { value: "Wynwood", label: "Wynwood" }, { value: "Coral Way", label: "Coral Way" }, { value: "Upper East Side", label: "Upper East Side" }, { value: "Little Haiti", label: "Little Haiti / MiMo" }] },
  { id: "propertyType", question: "Property type preference?", type: "choice", choices: [{ value: "Any", label: "No preference" }, { value: "Single Family", label: "Single Family" }, { value: "Condo", label: "Condo" }, { value: "Duplex", label: "Duplex / Multifamily" }, { value: "Vacant Lot", label: "Land / Lot" }, { value: "Townhouse", label: "Townhouse" }] },
  { id: "beds", question: "Minimum bedrooms?", type: "choice", choices: [{ value: 0, label: "No minimum" }, { value: 2, label: "2+ beds" }, { value: 3, label: "3+ beds" }, { value: 4, label: "4+ beds" }] },
  { id: "riskTolerance", question: "Risk tolerance?", type: "choice", choices: [{ value: "low", label: "Low — stable, proven assets" }, { value: "medium", label: "Medium — some upside risk is fine" }, { value: "high", label: "High — max upside, accept more risk" }] },
  { id: "developmentInterest", question: "Interest in development / adding units?", type: "choice", choices: [{ value: "none", label: "Not interested" }, { value: "low", label: "Nice to have" }, { value: "high", label: "Major priority" }] },
  { id: "timeline", question: "Timeline to purchase?", type: "choice", choices: [{ value: "asap", label: "As soon as possible" }, { value: "3months", label: "1–3 months" }, { value: "6months", label: "3–6 months" }, { value: "exploring", label: "Just exploring" }] },
];

const IntakePage = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({});
  const [selected, setSelected] = useState(null);
  const [multiSelected, setMultiSelected] = useState([]);
  const q = INTAKE_QUESTIONS[step];
  const isLast = step === INTAKE_QUESTIONS.length - 1;

  const handleNext = () => {
    const val = q.type === "multi" ? multiSelected : selected;
    const newProfile = { ...profile, [q.id]: val };
    setProfile(newProfile);
    if (isLast) { onComplete(newProfile); }
    else { setStep(s => s + 1); setSelected(null); setMultiSelected([]); }
  };

  const toggleMulti = (val) => setMultiSelected(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const progressPct = ((step) / INTAKE_QUESTIONS.length) * 100;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        {/* Progress */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 8 }}>
            <span>Step {step + 1} of {INTAKE_QUESTIONS.length}</span>
            <span>{Math.round(progressPct)}% complete</span>
          </div>
          <div style={{ background: "#1e293b", borderRadius: 99, height: 4 }}>
            <div style={{ width: `${progressPct}%`, height: 4, background: "linear-gradient(90deg, #10b981, #3b82f6)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>

        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 20, padding: 40 }}>
          <div style={{ fontSize: 13, color: "#10b981", marginBottom: 12, letterSpacing: "0.5px", textTransform: "uppercase" }}>AI Intake</div>
          <h2 style={{ fontSize: 24, color: "#f1f5f9", fontWeight: 600, marginBottom: 32, lineHeight: 1.3, fontFamily: "Georgia, serif" }}>{q.question}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {q.choices.map(c => {
              const isActive = q.type === "multi" ? multiSelected.includes(c.value) : selected === c.value;
              return (
                <button key={String(c.value)} onClick={() => q.type === "multi" ? toggleMulti(c.value) : setSelected(c.value)}
                  style={{ background: isActive ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)", border: isActive ? "1px solid #10b981" : "1px solid #334155", borderRadius: 12, padding: "14px 20px", color: isActive ? "#34d399" : "#94a3b8", fontSize: 15, cursor: "pointer", textAlign: "left", transition: "all 0.15s", fontFamily: "sans-serif" }}>
                  {isActive ? "✓ " : ""}{c.label}
                </button>
              );
            })}
          </div>

          <button onClick={handleNext} disabled={q.type === "multi" ? multiSelected.length === 0 : !selected}
            style={{ width: "100%", background: (q.type === "multi" ? multiSelected.length > 0 : selected) ? "linear-gradient(135deg, #10b981, #059669)" : "#1e293b", color: (q.type === "multi" ? multiSelected.length > 0 : selected) ? "white" : "#475569", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 600, cursor: (q.type === "multi" ? multiSelected.length > 0 : selected) ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            {isLast ? "Find My Properties →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- RESULTS PAGE ---
const ResultsPage = ({ profile, onSelect, onCompare }) => {
  const [compareList, setCompareList] = useState([]);
  const scored = PROPERTIES.map(p => ({ ...p, score: scoreProperty(p, profile) }))
    .filter(p => p.price <= (profile.budget || 99999999) * 1.25)
    .sort((a, b) => b.score.totalScore - a.score.totalScore)
    .slice(0, 5);

  const toggleCompare = (id) => {
    setCompareList(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 4 ? [...prev, id] : prev);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "#0f172a", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, color: "#10b981", marginBottom: 4 }}>AI MATCH RESULTS</div>
          <div style={{ fontSize: 22, color: "#f1f5f9", fontWeight: 600, fontFamily: "Georgia, serif" }}>Top {scored.length} Properties for You</div>
        </div>
        {compareList.length >= 2 && (
          <button onClick={() => onCompare(compareList.map(id => scored.find(p => p.id === id)))}
            style={{ background: "#3b82f6", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            Compare {compareList.length} Properties
          </button>
        )}
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ background: "#e0f2fe", border: "1px solid #bae6fd", borderRadius: 12, padding: "14px 20px", marginBottom: 28, fontSize: 14, color: "#0369a1" }}>
          <strong>Profile Summary:</strong> {profile.userType === "homebuyer" ? "Primary Home Buyer" : profile.userType === "investor" ? "Real Estate Investor" : "Developer / Value-Add"} · Budget {fmt(profile.budget)} · Down {profile.downPayment}% · {(profile.preferredAreas || []).join(", ") || "Miami-wide"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {scored.map((p, i) => {
            const fin = analyzeFinancials(p, profile);
            const isComparing = compareList.includes(p.id);
            return (
              <div key={p.id} style={{ background: "white", borderRadius: 16, border: isComparing ? "2px solid #3b82f6" : "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: 200 }}>
                  {/* Left: image placeholder */}
                  <div style={{ background: `linear-gradient(135deg, ${p.color}cc, ${p.color}44)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: 20 }}>
                    {i === 0 && <div style={{ position: "absolute", top: 12, left: 12, background: "#10b981", color: "white", fontSize: 11, fontWeight: 700, borderRadius: 99, padding: "4px 10px" }}>BEST MATCH</div>}
                    <div style={{ fontSize: 40, marginBottom: 8 }}>{p.propertyType === "Vacant Lot" ? "🏗️" : p.propertyType === "Condo" ? "🏢" : p.propertyType === "Duplex" ? "🏘️" : p.propertyType === "Mixed Use" ? "🏙️" : "🏡"}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: "white" }}>{fmt(p.price)}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginTop: 4 }}>{p.neighborhood}</div>
                    <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
                      {p.tags.map(t => <Tag key={t} label={t} />)}
                    </div>
                  </div>

                  {/* Right: details */}
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{p.address}</div>
                        <div style={{ fontSize: 13, color: "#6b7280" }}>{p.city}, FL {p.zipCode} · {p.propertyType} · Zoning: {p.zoningCode}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: scoreColor(p.score.totalScore) }}>{p.score.totalScore}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>Match Score</div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 14 }}>
                      {p.beds > 0 && <Stat label="Beds" value={p.beds} />}
                      {p.baths > 0 && <Stat label="Baths" value={p.baths} />}
                      {p.livingArea > 0 && <Stat label="Sq Ft" value={p.livingArea.toLocaleString()} />}
                      {p.lotSize > 0 && <Stat label="Lot" value={`${p.lotSize.toLocaleString()} sf`} />}
                      <Stat label="Est Rent" value={p.estimatedRent > 0 ? fmt(p.estimatedRent) + "/mo" : "N/A"} />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                      <Stat label="Monthly PITI" value={fmt(fin.totalMonthlyCost)} />
                      <Stat label="NOI (est.)" value={fin.noi > 0 ? fmt(fin.noi) : "N/A"} highlight={fin.noi > 0} />
                      <Stat label="Cap Rate" value={fin.capRate !== "N/A" ? `${fin.capRate}%` : "N/A"} highlight={parseFloat(fin.capRate) > 4} />
                    </div>

                    {p.score.reasons.length > 0 && (
                      <div style={{ fontSize: 12, color: "#16a34a", background: "#f0fdf4", borderRadius: 8, padding: "8px 12px", marginBottom: 14 }}>
                        ✓ {p.score.reasons.join(" · ")}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => onSelect(p)} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        Full Analysis →
                      </button>
                      <button onClick={() => toggleCompare(p.id)} style={{ background: isComparing ? "#eff6ff" : "white", color: isComparing ? "#1d4ed8" : "#374151", border: isComparing ? "1px solid #3b82f6" : "1px solid #e5e7eb", borderRadius: 8, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        {isComparing ? "✓ Comparing" : "+ Compare"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- PROPERTY DETAIL PAGE ---
const DetailPage = ({ property, profile, onBack, onLead }) => {
  const zoning = analyzeZoning(property);
  const score  = scoreProperty(property, profile);

  // ── Editable financial inputs ──
  const [isCash,     setIsCash]     = useState(false);
  const [editRate,   setEditRate]   = useState(7.25);
  const [editDown,   setEditDown]   = useState(profile.downPayment || 20);
  const [editPlazo,  setEditPlazo]  = useState(30);
  const [editTaxes,  setEditTaxes]  = useState(Math.round((property.taxes || property.price * 0.011) / 12));
  const [editIns,    setEditIns]    = useState(Math.round((property.insuranceEstimate || property.price * 0.005) / 12));
  const [editRent,   setEditRent]   = useState(property.estimatedRent || 0);
  const [editVac,    setEditVac]    = useState(8);
  const [editAdmin,  setEditAdmin]  = useState(10);
  const [editMaint,  setEditMaint]  = useState(Math.round(property.price * 0.01 / 12));
  const [showEdit,   setShowEdit]   = useState(false);
  const [chartTab,   setChartTab]   = useState("amort"); // amort | cashflow | costs | comps
  const [aiInsight,  setAiInsight]  = useState("");
  const [aiLoading,  setAiLoading]  = useState(false);
  const [comps,      setComps]      = useState(null);
  const [compsLoading, setCompsLoading] = useState(false);
  const [hoverYear,  setHoverYear]  = useState(null);

  // ── Core financial computation ──
  const price    = property.price;
  const loan     = isCash ? 0 : price * (1 - editDown / 100);
  const downAmt  = isCash ? price : Math.round(price * editDown / 100);
  const mpi      = isCash ? 0 : calcMPI(loan, editRate, editPlazo);
  const totalMes = mpi + editTaxes + editIns + (property.hoa || 0) + editMaint;

  // Rental analysis
  const vac      = Math.round(editRent * editVac / 100);
  const adm      = Math.round(editRent * editAdmin / 100);
  const noi      = Math.round(editRent * 12 - (editTaxes + editIns + (property.hoa||0) + editMaint + vac + adm) * 12);
  const flujoAn  = noi - mpi * 12;
  const capRate  = price > 0 && noi > 0 ? ((noi / price) * 100).toFixed(2) : "N/A";
  const coc      = downAmt > 0 ? ((flujoAn / downAmt) * 100).toFixed(1) : "N/A";
  const roi      = downAmt > 0 ? (((flujoAn + price * 0.04) / downAmt) * 100).toFixed(1) : "N/A";

  // ── Amortization table (30 years, yearly) ──
  const amortTable = (() => {
    if (isCash || !loan) return [];
    const rows = [];
    let balance = loan;
    const r = editRate / 100 / 12;
    for (let yr = 1; yr <= editPlazo; yr++) {
      let interest = 0, principal = 0;
      for (let m = 0; m < 12; m++) {
        const intM = balance * r;
        const prinM = mpi - intM;
        interest  += intM;
        principal += prinM;
        balance   -= prinM;
      }
      rows.push({ yr, interest: Math.round(interest), principal: Math.round(principal), balance: Math.round(Math.max(balance, 0)) });
    }
    return rows;
  })();

  // ── Cash flow projection 15 years ──
  const cfProjection = (() => {
    const rows = [];
    let balance = loan;
    const r = editRate / 100 / 12;
    for (let yr = 1; yr <= 15; yr++) {
      const rentYr   = Math.round(editRent * Math.pow(1.03, yr - 1));
      const vacYr    = Math.round(rentYr * editVac / 100);
      const admYr    = Math.round(rentYr * editAdmin / 100);
      const fixedYr  = (editTaxes + editIns + (property.hoa||0) + editMaint) * 12;
      const noiYr    = rentYr * 12 - fixedYr - (vacYr + admYr) * 12;
      const flujoYr  = noiYr - mpi * 12;
      const valYr    = Math.round(price * Math.pow(1.04, yr));
      // equity
      let bal2 = balance;
      for (let m = 0; m < 12; m++) { const intM = bal2 * r; bal2 -= (mpi - intM); }
      const equity = valYr - Math.max(bal2, 0);
      balance = bal2;
      rows.push({ yr, flujoYr: Math.round(flujoYr), noiYr: Math.round(noiYr), valYr, equity: Math.round(equity), rentYr });
    }
    return rows;
  })();

  // ── Donut cost breakdown data ──
  const costItems = [
    { label: "Hipoteca", val: mpi,          color: "#3b82f6" },
    { label: "Impuestos", val: editTaxes,   color: "#8b5cf6" },
    { label: "Seguro",    val: editIns,     color: "#f59e0b" },
    { label: "HOA",       val: property.hoa||0, color: "#ec4899" },
    { label: "Mant.",     val: editMaint,   color: "#6b7280" },
  ].filter(d => d.val > 0);
  const totalCostMes = costItems.reduce((s, d) => s + d.val, 0);

  // ── Comps fetch ──
  const fetchComps = async () => {
    setCompsLoading(true);
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: `Search for recent comparable properties (comps) near "${property.address}, ${property.neighborhood}, Miami, FL" that are similar in type (${property.propertyType}), size (~${property.livingArea} sqft), and beds/baths (${property.beds}/${property.baths}). Find 4-5 recent sales or active listings within 0.5 miles.\n\nReturn ONLY a JSON array (no markdown):\n[{"address":"","type":"sale|listing","price":0,"beds":0,"baths":0,"sqft":0,"pricePerSqft":0,"daysAgo":0,"rentEstimate":0,"source":""}]\n\nAlso estimate fair market rent range for this property based on the neighborhood. Include a "rentRange":{"min":0,"max":0,"avg":0} field at the top level.\n\nReturn format: {"comps":[...],"rentRange":{"min":0,"max":0,"avg":0},"marketNote":"brief market context"}`}]
        })
      });
      const data = await res.json();
      const txt  = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
      const m    = txt.match(/\{[\s\S]*\}/);
      if (m) setComps(JSON.parse(m[0]));
    } catch(e) { setComps({ error: true }); }
    setCompsLoading(false);
  };

  // ── AI insight ──
  const getAIInsight = async () => {
    setAiLoading(true);
    setAiInsight("");
    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 900,
          messages: [{ role: "user", content: `Miami real estate senior advisor. Analyze in Spanish (3 short paragraphs): ${property.address} ${property.neighborhood} — ${property.propertyType} $${price.toLocaleString()} ${property.beds}b/${property.baths}ba ${property.livingArea}sqft. ${isCash?"Compra en efectivo.":"Financiado al "+editRate+"% "+editDown+"% down "+editPlazo+"a."} Renta est. $${editRent}/mes. NOI $${noi.toLocaleString()}. Cap ${capRate}%. Flujo $${flujoAn.toLocaleString()}/año. Zonificación: ${property.zoningCode}. Sé honesto, menciona riesgos Miami (seguro, HOA, huracanes), termina con recomendación clara.` }]
        })
      });
      const d = await res.json();
      setAiInsight(d.content?.[0]?.text || "No disponible.");
    } catch(e) { setAiInsight("No disponible."); }
    setAiLoading(false);
  };

  // ── Chart helpers ──
  const maxCF   = Math.max(...cfProjection.map(r => Math.abs(r.flujoYr)), 1);
  const maxAmort = amortTable.length ? amortTable[0].interest + amortTable[0].principal : 1;
  const hY      = hoverYear ? cfProjection.find(r => r.yr === hoverYear) : null;

  // SVG donut
  const DonutSVG = () => {
    let offset = 0;
    const r = 52, circ = 2 * Math.PI * r, total = totalCostMes || 1;
    return (
      <svg width="130" height="130" viewBox="0 0 130 130">
        {costItems.map((d, i) => {
          const pct  = d.val / total;
          const dash = circ * pct;
          const el   = <circle key={i} cx="65" cy="65" r={r} fill="none" stroke={d.color} strokeWidth="18"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-(offset * circ - circ * 0.25)}
          />;
          offset += pct;
          return el;
        })}
        <text x="65" y="60" textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">${totalCostMes.toLocaleString()}</text>
        <text x="65" y="75" textAnchor="middle" fontSize="9" fill="#9ca3af">/mes total</text>
      </svg>
    );
  };

  const MiniInp = ({ label, value, onChange, prefix = "$", step = 10 }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
        <span style={{ padding: "6px 8px", fontSize: 12, color: "#9ca3af", borderRight: "1px solid #e5e7eb" }}>{prefix}</span>
        <input type="number" value={value} step={step} onChange={e => onChange(Number(e.target.value))}
          style={{ flex: 1, border: "none", background: "transparent", padding: "6px 8px", fontSize: 13, fontWeight: 600, color: "#111827", width: "100%" }} />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "#0f172a", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: 14 }}>← Resultados</button>
        <div style={{ fontSize: 12, color: "#10b981", letterSpacing: "0.5px" }}>ANÁLISIS DE PROPIEDAD</div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "24px 20px" }}>

        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, ${property.color}ee, ${property.color}55)`, borderRadius: 20, padding: "28px 32px", marginBottom: 20, color: "white" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>{property.tags.map(t => <Tag key={t} label={t} />)}</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6, fontFamily: "Georgia, serif" }}>{property.address}</h1>
          <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 20 }}>{property.city}, FL {property.zipCode} · {property.neighborhood}</div>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              { v: `$${price.toLocaleString()}`, l: "Precio" },
              property.beds > 0 && { v: `${property.beds}/${property.baths}`, l: "Hab/Baños" },
              property.livingArea > 0 && { v: `${property.livingArea.toLocaleString()} sf`, l: "Superficie" },
              property.lotSize > 0 && { v: `${property.lotSize.toLocaleString()} sf`, l: "Terreno" },
              { v: score.totalScore, l: "Match Score", accent: "#fbbf24" },
            ].filter(Boolean).map(x => (
              <div key={x.l}><div style={{ fontSize: 26, fontWeight: 900, color: x.accent || "white" }}>{x.v}</div><div style={{ fontSize: 11, opacity: 0.6 }}>{x.l}</div></div>
            ))}
          </div>
        </div>

        {/* ── ANÁLISIS FINANCIERO PRINCIPAL ── */}
        <div style={{ background: "white", borderRadius: 18, border: "1px solid #e5e7eb", marginBottom: 20, overflow: "hidden" }}>

          {/* Header del módulo financiero */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Análisis Financiero</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* Cash toggle */}
              <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3 }}>
                {[["Financiado", false],["Efectivo", true]].map(([l, v]) => (
                  <button key={l} onClick={() => setIsCash(v)}
                    style={{ background: isCash === v ? "white" : "transparent", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 12, fontWeight: isCash === v ? 700 : 400, color: isCash === v ? "#111827" : "#6b7280", cursor: "pointer", boxShadow: isCash === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                    {l}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowEdit(!showEdit)}
                style={{ background: showEdit ? "#0f172a" : "#f3f4f6", color: showEdit ? "white" : "#374151", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                ✏️ Editar costos
              </button>
            </div>
          </div>

          {/* Panel editable */}
          {showEdit && (
            <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "16px 24px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#92400e", marginBottom: 12 }}>Editar parámetros — se recalcula en tiempo real</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
                {!isCash && <>
                  <MiniInp label="Tasa (%)" value={editRate} onChange={setEditRate} prefix="%" step={0.25} />
                  <MiniInp label="Enganche (%)" value={editDown} onChange={setEditDown} prefix="%" step={1} />
                  <MiniInp label="Plazo (años)" value={editPlazo} onChange={setEditPlazo} prefix="Yr" step={5} />
                </>}
                <MiniInp label="Impuestos/mes" value={editTaxes} onChange={setEditTaxes} step={50} />
                <MiniInp label="Seguro/mes" value={editIns} onChange={setEditIns} step={25} />
                <MiniInp label="Mantenimiento/mes" value={editMaint} onChange={setEditMaint} step={25} />
                <MiniInp label="Renta estimada/mes" value={editRent} onChange={setEditRent} step={50} />
                <MiniInp label="Vacancia (%)" value={editVac} onChange={setEditVac} prefix="%" step={1} />
                <MiniInp label="Administración (%)" value={editAdmin} onChange={setEditAdmin} prefix="%" step={1} />
              </div>
            </div>
          )}

          {/* KPIs principales */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
              {[
                { l: isCash ? "Compra efectivo" : "Préstamo", v: isCash ? `$${price.toLocaleString()}` : `$${Math.round(loan).toLocaleString()}`, s: isCash ? "sin deuda" : `${editDown}% down · ${editRate}% · ${editPlazo}a` },
                { l: isCash ? "Sin hipoteca" : "Hipoteca P&I", v: isCash ? "$0/mes" : `$${mpi.toLocaleString()}/mes`, hi: isCash },
                { l: "Costo total/mes", v: `$${totalMes.toLocaleString()}`, hi: false },
                { l: "Renta estimada", v: editRent > 0 ? `$${editRent.toLocaleString()}/mes` : "N/A" },
                { l: "NOI anual", v: noi > 0 ? `$${noi.toLocaleString()}` : `-$${Math.abs(noi).toLocaleString()}`, hi: noi > 0 },
                { l: "Flujo anual", v: `${flujoAn >= 0 ? "+" : ""}$${flujoAn.toLocaleString()}`, hi: flujoAn > 0 },
                { l: "Cap Rate", v: capRate !== "N/A" ? `${capRate}%` : "N/A", hi: parseFloat(capRate) > 4 },
                { l: "Cash-on-Cash", v: coc !== "N/A" ? `${coc}%` : "N/A", hi: parseFloat(coc) > 5 },
              ].map(k => (
                <div key={k.l} style={{ background: k.hi ? "#f0fdf4" : "#f9fafb", border: `1px solid ${k.hi ? "#bbf7d0" : "#e5e7eb"}`, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>{k.l}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: k.hi ? "#15803d" : "#111827" }}>{k.v}</div>
                  {k.s && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>{k.s}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Chart tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
            {[["amort","📉 Amortización"],["cashflow","📈 Cash Flow 15A"],["costs","🥧 Costos"],["comps","🏘️ Comparables"]].map(([k,l]) => (
              <button key={k} onClick={() => { setChartTab(k); if (k==="comps" && !comps && !compsLoading) fetchComps(); }}
                style={{ padding: "11px 18px", background: chartTab===k ? "white" : "transparent", border: "none", borderBottom: `2px solid ${chartTab===k ? "#0f172a" : "transparent"}`, fontSize: 12, fontWeight: chartTab===k ? 700 : 400, color: chartTab===k ? "#111827" : "#6b7280", cursor: "pointer", whiteSpace: "nowrap" }}>
                {l}
              </button>
            ))}
          </div>

          <div style={{ padding: "20px 24px" }}>

            {/* ── AMORTIZACIÓN ── */}
            {chartTab === "amort" && (
              <div>
                {isCash ? (
                  <div style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    <div style={{ fontSize: 32 }}>💵</div>
                    <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>Compra en efectivo — sin hipoteca</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Todo el flujo de renta es ingreso neto desde el día 1.</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                      Desglose anual de hipoteca — principal vs. interés · Préstamo: ${Math.round(loan).toLocaleString()} @ {editRate}% · {editPlazo} años
                    </div>
                    {/* Stacked bar chart */}
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 160, marginBottom: 8 }}>
                      {amortTable.filter((_, i) => i % Math.ceil(editPlazo / 20) === 0 || i === editPlazo - 1).map(row => {
                        const maxPay = amortTable[0].interest + amortTable[0].principal;
                        const hInt  = (row.interest   / maxPay) * 140;
                        const hPrin = (row.principal  / maxPay) * 140;
                        return (
                          <div key={row.yr} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <div style={{ width: "100%", height: Math.max(hInt,2), background: "#fca5a5", borderRadius: "3px 3px 0 0" }} title={`Interés: $${row.interest.toLocaleString()}`} />
                              <div style={{ width: "100%", height: Math.max(hPrin,2), background: "#34d399" }} title={`Principal: $${row.principal.toLocaleString()}`} />
                            </div>
                            <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 3 }}>A{row.yr}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#6b7280", marginBottom: 12 }}>
                      <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#fca5a5", borderRadius: 2, marginRight: 4 }} />Interés</span>
                      <span><span style={{ display: "inline-block", width: 10, height: 10, background: "#34d399", borderRadius: 2, marginRight: 4 }} />Principal</span>
                    </div>
                    {/* Balance curve */}
                    <div style={{ fontSize: 11, color: "#374151", fontWeight: 600, marginBottom: 6 }}>Saldo del préstamo por año</div>
                    <div style={{ position: "relative", height: 60, background: "#f9fafb", borderRadius: 8, overflow: "hidden" }}>
                      <svg width="100%" height="60" viewBox={`0 0 ${amortTable.length} 60`} preserveAspectRatio="none">
                        <defs><linearGradient id="balGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#10b981" /></linearGradient></defs>
                        <polyline points={amortTable.map((r,i) => `${i},${(1 - r.balance/loan)*60}`).join(" ")} fill="none" stroke="url(#balGrad)" strokeWidth="2" />
                      </svg>
                      <div style={{ position: "absolute", top: 6, left: 8, fontSize: 10, color: "#3b82f6", fontWeight: 700 }}>${Math.round(loan/1000)}K</div>
                      <div style={{ position: "absolute", bottom: 6, right: 8, fontSize: 10, color: "#10b981", fontWeight: 700 }}>$0</div>
                    </div>
                    {/* Key milestones */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12 }}>
                      {[5,10,15].map(yr => {
                        const row = amortTable[yr-1];
                        if (!row) return null;
                        const equity = price * Math.pow(1.04, yr) - row.balance;
                        return (
                          <div key={yr} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 8, padding: "8px 10px" }}>
                            <div style={{ fontSize: 10, color: "#0369a1" }}>Año {yr}</div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "#0c4a6e" }}>Saldo: ${Math.round(row.balance/1000)}K</div>
                            <div style={{ fontSize: 11, color: "#16a34a" }}>Equity est: ${Math.round(equity/1000)}K</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── CASH FLOW 15 AÑOS ── */}
            {chartTab === "cashflow" && (
              <div>
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14 }}>
                  Flujo de caja neto proyectado año a año · Renta crece 3%/año · Apreciación 4%/año · {isCash ? "Compra en efectivo" : `Financiado ${editDown}% down · ${editRate}%`}
                </div>
                {/* Interactive bars */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 180, marginBottom: 8, position: "relative" }}>
                  {/* Zero line */}
                  {cfProjection.some(r => r.flujoYr < 0) && cfProjection.some(r => r.flujoYr > 0) && (
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: (Math.max(...cfProjection.map(r=>Math.abs(r.flujoYr)),1) > 0 ? (0 / (maxCF*2)) * 160 + 10 : 90), height: 1, background: "#e5e7eb", zIndex: 1 }} />
                  )}
                  {cfProjection.map(row => {
                    const pos  = row.flujoYr >= 0;
                    const h    = Math.max(Math.abs(row.flujoYr) / maxCF * 140, 4);
                    const isHov = hoverYear === row.yr;
                    return (
                      <div key={row.yr} onMouseEnter={() => setHoverYear(row.yr)} onMouseLeave={() => setHoverYear(null)}
                        style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                        <div style={{ fontSize: 9, fontWeight: 700, color: pos ? "#16a34a" : "#dc2626", marginBottom: 2, opacity: isHov ? 1 : 0.7 }}>
                          {pos?"+":""}{Math.round(row.flujoYr/1000)}K
                        </div>
                        <div style={{ width: "100%", height: h, background: pos
                          ? (isHov ? "#059669" : "linear-gradient(to top,#10b981,#34d399)")
                          : (isHov ? "#b91c1c" : "#fca5a5"),
                          borderRadius: pos ? "4px 4px 0 0" : "0 0 4px 4px",
                          transition: "all 0.15s", border: isHov ? "2px solid #0f172a" : "none"
                        }} />
                        <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 2 }}>A{row.yr}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Hover detail */}
                {hY && (
                  <div style={{ background: "#0f172a", borderRadius: 12, padding: "12px 16px", marginBottom: 12, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
                    {[
                      ["Año", hY.yr],
                      ["Renta/mes", `$${Math.round(hY.rentYr/12).toLocaleString()}`],
                      ["NOI", `$${hY.noiYr.toLocaleString()}`],
                      ["Flujo", `${hY.flujoYr>=0?"+":""}$${hY.flujoYr.toLocaleString()}`],
                      ["Equity est.", `$${Math.round(hY.equity/1000)}K`],
                    ].map(([l,v]) => (
                      <div key={l}><div style={{ fontSize: 10, color: "#94a3b8" }}>{l}</div><div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{v}</div></div>
                    ))}
                  </div>
                )}

                {/* Equity line */}
                <div style={{ fontSize: 11, color: "#374151", fontWeight: 600, marginBottom: 6 }}>Equity acumulado (valor propiedad − saldo préstamo)</div>
                <div style={{ position: "relative", height: 50, background: "#f0fdf4", borderRadius: 8, overflow: "hidden" }}>
                  <svg width="100%" height="50" viewBox={`0 0 ${cfProjection.length} 50`} preserveAspectRatio="none">
                    <defs><linearGradient id="eqGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#059669" /></linearGradient></defs>
                    <polygon points={`0,50 ${cfProjection.map((r,i)=>`${i},${50 - (r.equity / Math.max(...cfProjection.map(x=>x.equity),1))*46}`).join(" ")} ${cfProjection.length-1},50`} fill="#10b981" opacity="0.2" />
                    <polyline points={cfProjection.map((r,i)=>`${i},${50 - (r.equity / Math.max(...cfProjection.map(x=>x.equity),1))*46}`).join(" ")} fill="none" stroke="url(#eqGrad)" strokeWidth="2" />
                  </svg>
                  <div style={{ position: "absolute", bottom: 4, right: 8, fontSize: 10, color: "#16a34a", fontWeight: 700 }}>
                    Año 15: ${Math.round(cfProjection[14]?.equity/1000)}K
                  </div>
                </div>
              </div>
            )}

            {/* ── COSTOS ── */}
            {chartTab === "costs" && (
              <div>
                <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                  <DonutSVG />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Desglose mensual de costos</div>
                    {costItems.map(d => (
                      <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "#6b7280", flex: 1 }}>{d.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>${d.val.toLocaleString()}</span>
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>{((d.val/totalCostMes)*100).toFixed(0)}%</span>
                        <div style={{ width: 60, background: "#f3f4f6", borderRadius: 99, height: 5 }}>
                          <div style={{ width: `${(d.val/totalCostMes)*100}%`, height: 5, background: d.color, borderRadius: 99 }} />
                        </div>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 4, display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                      <span>Total mensual</span><span>${totalMes.toLocaleString()}</span>
                    </div>
                    {editRent > 0 && (
                      <div style={{ marginTop: 8, background: flujoAn >= 0 ? "#f0fdf4" : "#fef2f2", border: `1px solid ${flujoAn>=0?"#bbf7d0":"#fca5a5"}`, borderRadius: 8, padding: "8px 12px" }}>
                        <div style={{ fontSize: 11, color: flujoAn>=0?"#16a34a":"#dc2626", fontWeight: 700 }}>
                          {flujoAn>=0?"✓ Flujo positivo":"⚠ Flujo negativo"}: ${Math.abs(flujoAn).toLocaleString()}/año · ${Math.abs(Math.round(flujoAn/12)).toLocaleString()}/mes
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── COMPARABLES ── */}
            {chartTab === "comps" && (
              <div>
                {compsLoading && (
                  <div style={{ textAlign: "center", padding: "32px", color: "#6b7280" }}>
                    <div style={{ fontSize: 13 }}>Buscando propiedades comparables en {property.neighborhood}…</div>
                  </div>
                )}
                {!comps && !compsLoading && (
                  <div style={{ textAlign: "center", padding: "24px" }}>
                    <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>Comparar con ventas y listings recientes similares en la zona</div>
                    <button onClick={fetchComps} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      Buscar comparables →
                    </button>
                  </div>
                )}
                {comps && !comps.error && (
                  <div>
                    {/* Rent range */}
                    {comps.rentRange && (
                      <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 24, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontSize: 10, color: "#0369a1", marginBottom: 2 }}>Renta de mercado estimada</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#0c4a6e" }}>${(comps.rentRange.avg||0).toLocaleString()}/mes</div>
                          <div style={{ fontSize: 11, color: "#0369a1" }}>Rango: ${(comps.rentRange.min||0).toLocaleString()} – ${(comps.rentRange.max||0).toLocaleString()}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 10, color: "#0369a1", marginBottom: 2 }}>vs. tu estimado</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: editRent >= (comps.rentRange.avg||0) ? "#16a34a" : "#dc2626" }}>
                            {editRent >= (comps.rentRange.avg||0) ? "✓ Conservador" : "⚠ Por debajo del mercado"} — ${editRent.toLocaleString()}/mes
                          </div>
                        </div>
                        {comps.marketNote && <div style={{ fontSize: 12, color: "#374151", maxWidth: 300, lineHeight: 1.5 }}>{comps.marketNote}</div>}
                      </div>
                    )}
                    {/* Comp table */}
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                        <thead>
                          <tr style={{ background: "#f9fafb" }}>
                            {["Dirección","Tipo","Precio","$/sqft","Bed/Ba","Sqft","Días"].map(h => (
                              <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 600, color: "#6b7280", fontSize: 10, textTransform: "uppercase", borderBottom: "2px solid #e5e7eb" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {/* This property */}
                          <tr style={{ background: "#f0fdf4", borderBottom: "2px solid #bbf7d0" }}>
                            <td style={{ padding: "8px 10px", fontWeight: 700, color: "#15803d" }}>{property.address.split(",")[0]} ← Esta</td>
                            <td style={{ padding: "8px 10px" }}>{property.propertyType}</td>
                            <td style={{ padding: "8px 10px", fontWeight: 700 }}>${price.toLocaleString()}</td>
                            <td style={{ padding: "8px 10px" }}>{property.livingArea > 0 ? `$${Math.round(price/property.livingArea).toLocaleString()}` : "—"}</td>
                            <td style={{ padding: "8px 10px" }}>{property.beds}/{property.baths}</td>
                            <td style={{ padding: "8px 10px" }}>{property.livingArea?.toLocaleString()}</td>
                            <td style={{ padding: "8px 10px" }}>—</td>
                          </tr>
                          {(comps.comps||[]).map((c, i) => {
                            const cheaper = c.price < price;
                            return (
                              <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                <td style={{ padding: "8px 10px", color: "#374151" }}>{c.address || "—"}</td>
                                <td style={{ padding: "8px 10px" }}>
                                  <span style={{ background: c.type==="sale" ? "#d1fae5" : "#dbeafe", color: c.type==="sale" ? "#065f46" : "#1e40af", fontSize: 10, padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>
                                    {c.type==="sale" ? "Venta" : "Listado"}
                                  </span>
                                </td>
                                <td style={{ padding: "8px 10px", fontWeight: 600, color: cheaper?"#16a34a":"#dc2626" }}>${(c.price||0).toLocaleString()}</td>
                                <td style={{ padding: "8px 10px" }}>{c.pricePerSqft ? `$${c.pricePerSqft}` : "—"}</td>
                                <td style={{ padding: "8px 10px" }}>{c.beds}/{c.baths}</td>
                                <td style={{ padding: "8px 10px" }}>{c.sqft?.toLocaleString()}</td>
                                <td style={{ padding: "8px 10px", color: "#9ca3af" }}>{c.daysAgo > 0 ? `${c.daysAgo}d` : "Activo"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    {/* Price comparison bar */}
                    {(comps.comps||[]).length > 0 && (() => {
                      const allPrices = [price, ...(comps.comps||[]).map(c=>c.price||0)].filter(Boolean);
                      const minP = Math.min(...allPrices), maxP = Math.max(...allPrices);
                      const pct  = maxP > minP ? ((price - minP) / (maxP - minP)) * 100 : 50;
                      return (
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Posición de precio vs. comparables</div>
                          <div style={{ background: "#f3f4f6", borderRadius: 99, height: 12, position: "relative" }}>
                            <div style={{ position: "absolute", left: `${pct}%`, top: -4, width: 20, height: 20, borderRadius: "50%", background: "#0f172a", border: "3px solid white", transform: "translateX(-50%)", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
                            <span>${Math.round(minP/1000)}K</span><span style={{ fontWeight: 700, color: "#0f172a" }}>Esta prop.</span><span>${Math.round(maxP/1000)}K</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                {comps?.error && (
                  <div style={{ textAlign: "center", padding: "20px", color: "#6b7280" }}>
                    No se pudieron cargar comparables. <button onClick={fetchComps} style={{ color: "#3b82f6", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Reintentar</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Match Breakdown */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Match Breakdown</h3>
          <ScoreBar label="Budget Fit (25%)" value={score.budgetScore} />
          <ScoreBar label="Location Match (20%)" value={score.locationScore} />
          <ScoreBar label="Feature Match (15%)" value={score.featureScore} />
          <ScoreBar label="Investment Fit (20%)" value={score.investmentScore} />
          <ScoreBar label="Development Potential (20%)" value={score.developmentScore} />
        </div>

        {/* Zoning */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Zonificación y Potencial de Desarrollo</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 10, marginBottom: 14 }}>
            <Stat label="Zoning Code" value={zoning.zoningCode} />
            <Stat label="Max Units" value={zoning.maxUnitsEstimated} highlight={zoning.maxUnitsEstimated > 1} />
            <Stat label="ADU" value={zoning.aduPotential ? "Posible" : "Improbable"} highlight={zoning.aduPotential} />
            <Stat label="Duplex" value={zoning.duplexPotential ? "Posible" : "Improbable"} highlight={zoning.duplexPotential} />
            <Stat label="Multifamiliar" value={zoning.multifamilyPotential ? "Posible" : "Improbable"} highlight={zoning.multifamilyPotential} />
          </div>
          <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#4b5563", lineHeight: 1.7, marginBottom: 10 }}>{zoning.explanation}</div>
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", fontSize: 11, color: "#78350f" }}>
            ⚠ Análisis preliminar. Verificar con City of Miami, Miami-Dade Property Search y Gridics Zoning Map.
          </div>
        </div>

        {/* AI Advisory */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Opinión del Asesor IA</h3>
          {!aiInsight && !aiLoading && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>Análisis personalizado basado en tus parámetros editados y el mercado de Miami.</div>
              <button onClick={getAIInsight} style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Generar análisis →
              </button>
            </div>
          )}
          {aiLoading && <div style={{ textAlign: "center", padding: "24px", color: "#6b7280", fontSize: 13 }}>Analizando propiedad contra el mercado de Miami…</div>}
          {aiInsight && <div style={{ fontSize: 14, lineHeight: 1.8, color: "#374151", whiteSpace: "pre-wrap" }}>{aiInsight}</div>}
        </div>

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 20, padding: "32px", color: "white", textAlign: "center" }}>
          <div style={{ fontSize: 12, color: "#10b981", marginBottom: 10 }}>¿LISTO PARA AVANZAR?</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, fontFamily: "Georgia, serif" }}>Hablá con un Asesor de Miami</h3>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>Nuestro equipo puede verificar zonificación, correr comps reales, estructurar el financiamiento y negociar en tu nombre.</p>
          <button onClick={onLead} style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            Conectar con un asesor →
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPARE PAGE ---
const ComparePage = ({ properties, profile, onBack }) => {
  if (!properties || properties.length < 2) return null;
  const fins = properties.map(p => analyzeFinancials(p, profile));
  const zonings = properties.map(p => analyzeZoning(p));
  const scores = properties.map(p => scoreProperty(p, profile));
  const bestOverall = scores.indexOf(scores.reduce((best, s) => s.totalScore > best.totalScore ? s : best, scores[0]));
  const bestCashFlow = fins.indexOf(fins.reduce((best, f) => f.annualCashFlow > best.annualCashFlow ? f : best, fins[0]));
  const bestDev = zonings.indexOf(zonings.reduce((best, z) => z.maxUnitsEstimated > best.maxUnitsEstimated ? z : best, zonings[0]));

  const rows = [
    { label: "Price", vals: fins.map((f, i) => fmt(properties[i].price)) },
    { label: "Monthly Cost", vals: fins.map(f => fmt(f.totalMonthlyCost)) },
    { label: "Est Rent", vals: properties.map(p => p.estimatedRent > 0 ? fmt(p.estimatedRent) : "N/A") },
    { label: "NOI", vals: fins.map(f => f.noi > 0 ? fmt(f.noi) : "N/A") },
    { label: "Cap Rate", vals: fins.map(f => f.capRate !== "N/A" ? `${f.capRate}%` : "N/A") },
    { label: "Cash-on-Cash", vals: fins.map(f => f.cashOnCash !== "N/A" ? `${f.cashOnCash}%` : "N/A") },
    { label: "Zoning", vals: properties.map(p => p.zoningCode) },
    { label: "Max Units (est)", vals: zonings.map(z => z.maxUnitsEstimated) },
    { label: "Lot Size", vals: properties.map(p => p.lotSize > 0 ? `${p.lotSize.toLocaleString()} sf` : "N/A") },
    { label: "Match Score", vals: scores.map(s => s.totalScore) },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "#0f172a", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: 14 }}>← Back</button>
        <div style={{ fontSize: 13, color: "#10b981" }}>PROPERTY COMPARISON</div>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Headers */}
        <div style={{ display: "grid", gridTemplateColumns: `200px ${properties.map(() => "1fr").join(" ")}`, gap: 12, marginBottom: 4 }}>
          <div />
          {properties.map((p, i) => (
            <div key={p.id} style={{ background: `linear-gradient(135deg, ${p.color}cc, ${p.color}44)`, borderRadius: 14, padding: "20px 16px", color: "white", textAlign: "center" }}>
              {[i === bestOverall && "🏆 Best Overall", i === bestCashFlow && "💰 Best Cash Flow", i === bestDev && "🏗️ Most Dev. Upside"].filter(Boolean).map(badge => (
                <div key={badge} style={{ background: "rgba(255,255,255,0.2)", borderRadius: 99, fontSize: 10, padding: "3px 8px", marginBottom: 6, display: "inline-block" }}>{badge}</div>
              ))}
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.address.split(",")[0]}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{p.neighborhood}</div>
              <div style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>{fmt(p.price)}</div>
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.map((row, ri) => (
          <div key={row.label} style={{ display: "grid", gridTemplateColumns: `200px ${properties.map(() => "1fr").join(" ")}`, gap: 12, marginBottom: 4 }}>
            <div style={{ background: ri % 2 === 0 ? "#f3f4f6" : "white", borderRadius: 8, padding: "12px 14px", fontSize: 13, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center" }}>{row.label}</div>
            {row.vals.map((v, i) => (
              <div key={i} style={{ background: ri % 2 === 0 ? "#f3f4f6" : "white", borderRadius: 8, padding: "12px 14px", fontSize: 14, fontWeight: 500, textAlign: "center", color: "#111827" }}>{v}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- LEAD CAPTURE ---
const LeadPage = ({ property, profile, onBack }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
        <h2 style={{ color: "#f1f5f9", fontSize: 28, fontWeight: 700, marginBottom: 16, fontFamily: "Georgia, serif" }}>You're on our radar.</h2>
        <p style={{ color: "#94a3b8", fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>A licensed Miami advisor will reach out within 1 business day to discuss your goals, verify zoning, and build your custom buy box.</p>
        <button onClick={onBack} style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>← Continue Exploring</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 520, width: "100%" }}>
        <button onClick={onBack} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: 14, marginBottom: 24 }}>← Back</button>
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 20, padding: 40 }}>
          <div style={{ fontSize: 13, color: "#10b981", marginBottom: 12, letterSpacing: "0.5px" }}>CONNECT WITH AN ADVISOR</div>
          <h2 style={{ fontSize: 26, color: "#f1f5f9", fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" }}>Build Your Investment Plan</h2>
          {property && <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Interested in: {property.address} · {fmt(property.price)}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[{ id: "name", label: "Full Name", placeholder: "Jane Smith" }, { id: "email", label: "Email", placeholder: "jane@email.com" }, { id: "phone", label: "Phone", placeholder: "(305) 555-0100" }].map(f => (
              <div key={f.id}>
                <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input value={form[f.id]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} placeholder={f.placeholder}
                  style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: 15, boxSizing: "border-box", fontFamily: "sans-serif" }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 13, color: "#94a3b8", display: "block", marginBottom: 6 }}>Anything else you want us to know?</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Questions, constraints, or goals..."
                style={{ width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: 15, minHeight: 80, boxSizing: "border-box", fontFamily: "sans-serif", resize: "vertical" }} />
            </div>
            <button onClick={() => form.name && form.email && setSubmitted(true)}
              style={{ background: form.name && form.email ? "linear-gradient(135deg, #10b981, #059669)" : "#334155", color: form.name && form.email ? "white" : "#64748b", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 600, cursor: form.name && form.email ? "pointer" : "not-allowed", marginTop: 8 }}>
              Request Advisor Consultation →
            </button>
          </div>

          <div style={{ marginTop: 20, fontSize: 12, color: "#475569", textAlign: "center" }}>
            No pressure. No spam. Your information is only shared with our licensed advisors.
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// UTILIDADES NUMÉRICAS COMPARTIDAS
// ============================================================
const fmtUSD  = v => `$${Math.round(Math.abs(v)).toLocaleString()}`;
const fmtSign = v => `${v >= 0 ? "+" : "-"}$${Math.round(Math.abs(v)).toLocaleString()}`;
const calcMPI = (principal, annualRate, years) => {
  if (!principal || !annualRate) return 0;
  const r = annualRate / 100 / 12, n = years * 12;
  return Math.round(principal * (r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1));
};

// ============================================================
// FINANCIAL EDITOR — editable analysis + live scenario chart
// ============================================================
const FinancialEditor = ({ property, profile, advRentaRango }) => {
  const price = property.price || 0;
  const [eTasa,    setETasa]    = useState(7.25);
  const [eDown,    setEDown]    = useState(profile.downPayment || 20);
  const [ePlazo,   setEPlazo]   = useState(30);
  const [eTaxes,   setETaxes]   = useState(Math.round((property.taxes || price * 0.011) / 12));
  const [eIns,     setEIns]     = useState(Math.round((property.insuranceEstimate || price * 0.005) / 12));
  const [eHOA,     setEHOA]     = useState(property.hoa || 0);
  const [eMaint,   setEMaint]   = useState(Math.round(price * 0.01 / 12));
  const [eRenta,   setERenta]   = useState(property.estimatedRent || 0);
  const [eVac,     setEVac]     = useState(8);
  const [eAdmin,   setEAdmin]   = useState(10);
  const [eCrec,    setECrec]    = useState(3);
  const [eAprec,   setEAprec]   = useState(4);
  const [isCash,   setIsCash]   = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [hoverYr,  setHoverYr]  = useState(null);

  const loan    = isCash ? 0 : price * (1 - eDown / 100);
  const downAmt = isCash ? price : Math.round(price * eDown / 100);
  const mpi     = isCash ? 0 : calcMPI(loan, eTasa, ePlazo);
  const fixedMes = eTaxes + eIns + eHOA + eMaint;
  const totalMes = mpi + fixedMes;

  const buildScenario = (rentMult, rateDelta) => {
    const adjMPI = isCash ? 0 : calcMPI(loan, eTasa + rateDelta, ePlazo);
    const renta  = Math.round(eRenta * rentMult);
    const vac    = Math.round(renta * eVac / 100);
    const adm    = Math.round(renta * eAdmin / 100);
    const noi    = Math.round(renta * 12 - (fixedMes + vac + adm) * 12);
    const flujo  = noi - adjMPI * 12;
    const cap    = price > 0 && noi > 0 ? ((noi / price) * 100).toFixed(2) : "N/A";
    const coc    = downAmt > 0 ? ((flujo / downAmt) * 100).toFixed(1) : "N/A";
    const piti   = adjMPI + fixedMes;
    return { renta, noi, flujo, cap, coc, piti, adjMPI };
  };

  const scC = buildScenario(0.88,  0.5);
  const scB = buildScenario(1.0,   0.0);
  const scA = buildScenario(1.12, -0.25);

  const proj15 = Array.from({ length: 15 }, (_, i) => {
    const yr = i + 1;
    const rentaYr = Math.round(eRenta * Math.pow(1 + eCrec / 100, i));
    const vacYr   = Math.round(rentaYr * eVac / 100);
    const admYr   = Math.round(rentaYr * eAdmin / 100);
    const noiYr   = Math.round(rentaYr * 12 - (fixedMes + vacYr + admYr) * 12);
    const flujoYr = noiYr - mpi * 12;
    const valYr   = Math.round(price * Math.pow(1 + eAprec / 100, yr));
    let bal = loan;
    const r2 = eTasa / 100 / 12;
    for (let m = 0; m < 12 * yr; m++) {
      const intM = bal * r2;
      bal = Math.max(bal - (mpi - intM), 0);
    }
    return { yr, flujoYr, noiYr, rentaYr, valYr, equity: Math.round(valYr - bal) };
  });

  const maxFlAbs = Math.max(...proj15.map(r => Math.abs(r.flujoYr)), 1);
  const hY = hoverYr ? proj15.find(r => r.yr === hoverYr) : null;

  const EInput = ({ label, value, onChange, prefix = "$", step = 10, min = 0 }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden" }}>
        <span style={{ padding: "5px 8px", fontSize: 11, color: "#9ca3af", background: "#f3f4f6", borderRight: "1px solid #e5e7eb" }}>{prefix}</span>
        <input type="number" value={value} min={min} step={step}
          onChange={e => onChange(Math.max(Number(e.target.value), min))}
          style={{ flex: 1, border: "none", background: "transparent", padding: "5px 8px", fontSize: 13, fontWeight: 700, color: "#111827", width: "100%" }} />
      </div>
    </div>
  );

  const ScenCol = ({ label, sc, active, color }) => (
    <div style={{ flex: 1, background: active ? color + "18" : "#f9fafb", border: `${active ? 2 : 1}px solid ${active ? color : "#e5e7eb"}`, borderRadius: 12, padding: "14px 12px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: active ? color : "#6b7280", marginBottom: 10, textTransform: "uppercase" }}>{label}</div>
      {[
        ["Renta", `$${sc.renta.toLocaleString()}/mes`],
        ["PITI total", `$${sc.piti.toLocaleString()}/mes`],
        ["NOI anual", sc.noi > 0 ? `+$${sc.noi.toLocaleString()}` : `-$${Math.abs(sc.noi).toLocaleString()}`],
        ["Flujo anual", sc.flujo >= 0 ? `+$${sc.flujo.toLocaleString()}` : `-$${Math.abs(sc.flujo).toLocaleString()}`],
        ["Cap Rate", sc.cap !== "N/A" ? `${sc.cap}%` : "N/A"],
        ["Cash-on-Cash", sc.coc !== "N/A" ? `${sc.coc}%` : "N/A"],
      ].map(([l, v]) => (
        <div key={l} style={{ marginBottom: 7 }}>
          <div style={{ fontSize: 9, color: "#9ca3af", textTransform: "uppercase", marginBottom: 1 }}>{l}</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: (l === "Flujo anual" || l === "NOI anual") ? (v.startsWith("+") ? "#16a34a" : "#dc2626") : "#111827" }}>{v}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Análisis Financiero</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 8, padding: 2 }}>
            {[["Financiado", false], ["Efectivo", true]].map(([l, v]) => (
              <button key={l} onClick={() => setIsCash(v)}
                style={{ background: isCash === v ? "white" : "transparent", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: isCash === v ? 700 : 400, color: isCash === v ? "#111827" : "#6b7280", cursor: "pointer", boxShadow: isCash === v ? "0 1px 3px rgba(0,0,0,0.08)" : "none" }}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={() => setShowEdit(p => !p)}
            style={{ background: showEdit ? "#0f172a" : "#f3f4f6", color: showEdit ? "white" : "#374151", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
            ✏️ {showEdit ? "Cerrar" : "Editar parámetros"}
          </button>
        </div>
      </div>

      {showEdit && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "14px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>Editar — recalcula en tiempo real</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 8 }}>
            {!isCash && <>
              <EInput label="Tasa %" value={eTasa} onChange={setETasa} prefix="%" step={0.125} min={1} />
              <EInput label="Enganche %" value={eDown} onChange={setEDown} prefix="%" step={1} min={3} />
              <EInput label="Plazo años" value={ePlazo} onChange={setEPlazo} prefix="yr" step={5} min={5} />
            </>}
            <EInput label="Impuestos/mes" value={eTaxes} onChange={setETaxes} step={25} />
            <EInput label="Seguro/mes" value={eIns} onChange={setEIns} step={25} />
            <EInput label="HOA/mes" value={eHOA} onChange={setEHOA} step={10} />
            <EInput label="Mantenimiento/mes" value={eMaint} onChange={setEMaint} step={25} />
            <EInput label="Renta/mes" value={eRenta} onChange={setERenta} step={50} />
            <EInput label="Vacancia %" value={eVac} onChange={setEVac} prefix="%" step={1} />
            <EInput label="Administración %" value={eAdmin} onChange={setEAdmin} prefix="%" step={1} />
            <EInput label="Crecim. renta %/año" value={eCrec} onChange={setECrec} prefix="%" step={0.5} />
            <EInput label="Apreciación %/año" value={eAprec} onChange={setEAprec} prefix="%" step={0.5} />
          </div>
        </div>
      )}

      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 8, marginBottom: 16 }}>
          {[
            { l: isCash ? "Compra efectivo" : `Préstamo (${eDown}%)`, v: isCash ? `$${price.toLocaleString()}` : `$${Math.round(loan).toLocaleString()}`, s: isCash ? "sin deuda" : `${eTasa}% · ${ePlazo}a` },
            { l: "Hipoteca P&I", v: isCash ? "$0/mes" : `$${mpi.toLocaleString()}/mes`, hi: isCash },
            { l: "Total mensual", v: `$${totalMes.toLocaleString()}/mes` },
            { l: "Renta estimada", v: eRenta > 0 ? `$${eRenta.toLocaleString()}/mes` : "Sin renta" },
            { l: "NOI base", v: scB.noi > 0 ? `+$${scB.noi.toLocaleString()}` : `-$${Math.abs(scB.noi).toLocaleString()}`, hi: scB.noi > 0 },
            { l: "Flujo base", v: scB.flujo >= 0 ? `+$${scB.flujo.toLocaleString()}/año` : `-$${Math.abs(scB.flujo).toLocaleString()}/año`, hi: scB.flujo >= 0 },
          ].map(k => (
            <div key={k.l} style={{ background: k.hi ? "#f0fdf4" : "#f9fafb", border: `1px solid ${k.hi ? "#bbf7d0" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 12px" }}>
              <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 3 }}>{k.l}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: k.hi ? "#15803d" : "#111827" }}>{k.v}</div>
              {k.s && <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 1 }}>{k.s}</div>}
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase" }}>Desglose mensual</div>
          {[
            { label: "Hipoteca P&I", value: mpi, color: "#3b82f6" },
            { label: "Impuestos", value: eTaxes, color: "#8b5cf6" },
            { label: "Seguro", value: eIns, color: "#f59e0b" },
            { label: "HOA", value: eHOA, color: "#ec4899" },
            { label: "Mantenimiento", value: eMaint, color: "#6b7280" },
          ].filter(d => d.value > 0).map(d => {
            const pct = Math.min((d.value / Math.max(totalMes, 1)) * 100, 100);
            return (
              <div key={d.label} style={{ marginBottom: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                  <span style={{ color: "#374151" }}>{d.label}</span>
                  <span style={{ fontWeight: 700 }}>${d.value.toLocaleString()}/mes <span style={{ color: "#9ca3af", fontWeight: 400 }}>({pct.toFixed(0)}%)</span></span>
                </div>
                <div style={{ background: "#f3f4f6", borderRadius: 99, height: 6 }}>
                  <div style={{ width: `${pct}%`, height: 6, background: d.color, borderRadius: 99, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>

        {eRenta > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 10, textTransform: "uppercase" }}>Flujo anual por escenario</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <ScenCol label="Conservador" sc={scC} active={false} color="#6b7280" />
              <ScenCol label="Base" sc={scB} active color="#10b981" />
              <ScenCol label="Optimista" sc={scA} active={false} color="#3b82f6" />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 90 }}>
              {[
                { lbl: "Conservador", val: scC.flujo, color: "#94a3b8" },
                { lbl: "Base",        val: scB.flujo, color: "#10b981" },
                { lbl: "Optimista",   val: scA.flujo, color: "#3b82f6" },
              ].map(s => {
                const maxV = Math.max(Math.abs(scC.flujo), Math.abs(scB.flujo), Math.abs(scA.flujo), 1);
                const h = Math.max(Math.abs(s.val) / maxV * 72, 4);
                const pos = s.val >= 0;
                return (
                  <div key={s.lbl} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: pos ? s.color : "#dc2626", marginBottom: 4 }}>
                      {s.val >= 0 ? "+" : ""}${Math.round(Math.abs(s.val) / 1000 * 10) / 10}K/año
                    </div>
                    <div style={{ width: "100%", height: h, background: pos ? s.color : "#fca5a5", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }} />
                    <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>{s.lbl}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {eRenta > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase" }}>
              Proyección 15 años
              <span style={{ fontWeight: 400, marginLeft: 6, fontSize: 9 }}>Renta +{eCrec}%/año · Apreciación +{eAprec}%/año · Hover para detalle</span>
            </div>
            {hY && (
              <div style={{ background: "#0f172a", borderRadius: 10, padding: "8px 14px", marginBottom: 8, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
                {[["Año", hY.yr], ["Renta/mes", `$${Math.round(hY.rentaYr/12).toLocaleString()}`], ["NOI", `$${hY.noiYr.toLocaleString()}`], ["Flujo", (hY.flujoYr>=0?"+":"")+`$${hY.flujoYr.toLocaleString()}`], ["Equity", `$${Math.round(hY.equity/1000)}K`]].map(([l,v]) => (
                  <div key={l}><div style={{ fontSize: 9, color: "#94a3b8" }}>{l}</div><div style={{ fontSize: 12, fontWeight: 700, color: "white" }}>{v}</div></div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100 }}>
              {proj15.map(yr => {
                const pos = yr.flujoYr >= 0;
                const h = Math.max(Math.abs(yr.flujoYr) / maxFlAbs * 82, 3);
                const isHov = hoverYr === yr.yr;
                return (
                  <div key={yr.yr} onMouseEnter={() => setHoverYr(yr.yr)} onMouseLeave={() => setHoverYr(null)}
                    style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                    <div style={{ fontSize: 7, fontWeight: 700, color: pos ? "#16a34a" : "#dc2626", marginBottom: 2 }}>{Math.round(yr.flujoYr/1000)}K</div>
                    <div style={{ width: "100%", height: h, background: isHov ? (pos ? "#059669" : "#b91c1c") : (pos ? "#10b981" : "#fca5a5"), borderRadius: "3px 3px 0 0", border: isHov ? "2px solid #0f172a" : "none", transition: "all 0.12s" }} />
                    <div style={{ fontSize: 7, color: "#9ca3af", marginTop: 2 }}>A{yr.yr}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 8, background: "#f0fdf4", borderRadius: 8, height: 32, position: "relative", overflow: "hidden" }}>
              <svg width="100%" height="32" viewBox={`0 0 ${proj15.length} 32`} preserveAspectRatio="none">
                <defs><linearGradient id="eqG2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#059669"/></linearGradient></defs>
                <polygon points={`0,32 ${proj15.map((r,i)=>`${i},${32-(r.equity/Math.max(...proj15.map(x=>x.equity),1))*29}`).join(" ")} ${proj15.length-1},32`} fill="#10b981" opacity="0.15"/>
                <polyline points={proj15.map((r,i)=>`${i},${32-(r.equity/Math.max(...proj15.map(x=>x.equity),1))*29}`).join(" ")} fill="none" stroke="url(#eqG2)" strokeWidth="1.5"/>
              </svg>
              <div style={{ position: "absolute", right: 6, bottom: 3, fontSize: 8, color: "#16a34a", fontWeight: 700 }}>Equity A15: ${Math.round((proj15[14]?.equity||0)/1000)}K</div>
            </div>
            {advRentaRango?.rentaRangoMin && (
              <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", marginBottom: 3 }}>Rango de renta de mercado (IA)</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1d4ed8" }}>
                  ${(advRentaRango.rentaRangoMin||0).toLocaleString()} – ${(advRentaRango.rentaRangoMax||0).toLocaleString()}/mes
                </div>
                {eRenta < (advRentaRango.rentaRangoMin||0) && (
                  <button onClick={() => setERenta(advRentaRango.rentaRangoMin)} style={{ marginTop: 5, background: "#1d4ed8", color: "white", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                    Usar mínimo de mercado
                  </button>
                )}
              </div>
            )}
            <div style={{ fontSize: 9, color: "#d1d5db", marginTop: 6, fontStyle: "italic" }}>
              * {isCash ? "Compra en efectivo." : `${eTasa}% · ${ePlazo}a · ${eDown}% down.`} Vacancia {eVac}% · Admin {eAdmin}% · Renta +{eCrec}%/año · Apreciación +{eAprec}%/año.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// SIMULADOR — MOTOR PRINCIPAL
// ============================================================
const SimuladorCashFlow = ({ property, profile, zoningInfo }) => {
  const base = property;

  // ─── PANEL: Condiciones de financiamiento ───
  const [tasa,     setTasa]     = useState(7.25);
  const [downPct,  setDownPct]  = useState(profile.downPayment || 20);
  const [plazoHip, setPlazoHip] = useState(30);
  const [vacPct,   setVacPct]   = useState(8);
  const [adminPct, setAdminPct] = useState(10);

  // ─── PANEL: Dividir unidades (punto de partida) ───
  const totalBeds  = base.beds  || 3;
  const totalBaths = base.baths || 2;

  // Auto-genera splits posibles a partir de beds/baths reales
  const genSplits = (beds, baths) => {
    const splits = [
      {
        id: "nosplit",
        label: `Sin dividir — ${beds}/${baths} completo`,
        units: [{ id: "u0", label: `Unidad ${beds}b/${baths}ba`, beds, baths }],
        costoRef: 0,
      },
    ];
    if (beds >= 2) splits.push({
      id: "s1r",
      label: `Suite + ${beds-1}b/${Math.max(1,baths-1)}ba`,
      units: [
        { id: "u0", label: `Suite 1b/1ba`, beds: 1, baths: 1 },
        { id: "u1", label: `${beds-1}b/${Math.max(1,baths-1)}ba`, beds: beds-1, baths: Math.max(1,baths-1) },
      ],
      costoRef: 12000,
    });
    if (beds >= 3) splits.push({
      id: "smit",
      label: `${Math.floor(beds/2)}b/${Math.max(1,Math.floor(baths/2))}ba + ${beds-Math.floor(beds/2)}b/${Math.max(1,baths-Math.floor(baths/2))}ba`,
      units: [
        { id: "u0", label: `Unidad A ${Math.floor(beds/2)}b/${Math.max(1,Math.floor(baths/2))}ba`, beds: Math.floor(beds/2), baths: Math.max(1,Math.floor(baths/2)) },
        { id: "u1", label: `Unidad B ${beds-Math.floor(beds/2)}b/${Math.max(1,baths-Math.floor(baths/2))}ba`, beds: beds-Math.floor(beds/2), baths: Math.max(1,baths-Math.floor(baths/2)) },
      ],
      costoRef: 18000,
    });
    if (beds >= 4) splits.push({
      id: "s3u",
      label: `3 unidades: 1b/1ba · 1b/1ba · ${beds-2}b/${Math.max(1,baths-2)}ba`,
      units: [
        { id: "u0", label: `Unidad A 1b/1ba`, beds: 1, baths: 1 },
        { id: "u1", label: `Unidad B 1b/1ba`, beds: 1, baths: 1 },
        { id: "u2", label: `Unidad C ${beds-2}b/${Math.max(1,baths-2)}ba`, beds: beds-2, baths: Math.max(1,baths-2) },
      ],
      costoRef: 32000,
    });
    splits.push({
      id: "room",
      label: `${beds} cuartos individuales (rooming)`,
      units: Array.from({ length: beds }, (_, i) => ({ id: `r${i}`, label: `Cuarto ${i+1}`, beds: 1, baths: 0 })),
      costoRef: beds * 3500,
    });
    return splits;
  };

  const SPLITS = genSplits(totalBeds, totalBaths);
  const [splitIdx,    setSplitIdx]    = useState(0);
  const [splitRentas, setSplitRentas] = useState({});  // renta por unit id

  // Referencia de renta Miami por tamaño
  const rentaRefMiami = (beds) => {
    if (beds === 0) return 900;
    if (beds === 1) return 2100;
    if (beds === 2) return 2900;
    if (beds === 3) return 3700;
    return 4500;
  };
  const getSplitRenta = (uid, beds) => splitRentas[uid] !== undefined ? splitRentas[uid] : 0;

  // ─── PANEL: Cuartos extra (sobre el split) ───
  const [extraRooms,     setExtraRooms]     = useState(0);   // número de cuartos a agregar
  const [rentaXCuarto,   setRentaXCuarto]   = useState(0);   // renta por cuarto extra

  // ─── PANEL: ADU (sobre el split + cuartos) ───
  const [extraADUs,      setExtraADUs]      = useState(0);   // número de ADUs
  const [rentaXADU,      setRentaXADU]      = useState(0);   // renta por ADU

  // ─── Costo de remodelación (obra de vivienda) ───
  const [costoObra,      setCostoObra]      = useState(0);
  const [tasaObra,       setTasaObra]       = useState(8);
  const [plazoObraM,     setPlazoObraM]     = useState(24);  // plazo en MESES

  // ─── Tab activo ───
  const [tab, setTab] = useState("fin");  // fin | split | cuartos | adu | breakeven

  // ─── CÁLCULOS CENTRALIZADOS ───

  // 1. Hipoteca sobre precio de compra (no cambia con obras)
  const loan    = base.price * (1 - downPct / 100);
  const mpiComp = calcMPI(loan, tasa, plazoHip);
  const downAmt = Math.round(base.price * downPct / 100);

  // 2. Gastos fijos mensuales (impuestos, seguro, HOA, mantenimiento)
  const taxes = Math.round((base.taxes || base.price * 0.011) / 12);
  const ins   = Math.round((base.insuranceEstimate || base.price * 0.005) / 12);
  const hoa   = base.hoa || 0;
  const maint = Math.round(base.price * 0.01 / 12);
  const gastosFijosMes = taxes + ins + hoa + maint;

  // 3. Préstamo de obra (SEPARADO de la hipoteca)
  const cuotaObra = costoObra > 0 ? calcMPI(costoObra, Math.max(tasaObra, 0.1), plazoObraM / 12) : 0;

  // 4. Renta BASE (propiedad sin modificar)
  const rentaBase = base.estimatedRent || 0;

  // 5. Renta del SPLIT seleccionado
  const splitActual = SPLITS[splitIdx];
  const rentaSplit  = splitActual.units.reduce((sum, u) => sum + getSplitRenta(u.id, u.beds), 0);

  // 6. Renta por cuartos extra (acumulada sobre split)
  const rentaCuartos = extraRooms * rentaXCuarto;

  // 7. Renta por ADUs (acumulada sobre split + cuartos)
  const rentaADUs = extraADUs * rentaXADU;

  // 8. Renta TOTAL simulada
  const rentaSim = rentaSplit + rentaCuartos + rentaADUs;

  // 9. Vacancia y administración sobre renta total
  const calcFlujoAnual = (renta) => {
    const vacancia = Math.round(renta * vacPct / 100);
    const admin    = Math.round(renta * adminPct / 100);
    const noi = renta * 12 - (gastosFijosMes + vacancia + admin) * 12;
    const flujo = noi - mpiComp * 12;
    return { noi: Math.round(noi), flujo: Math.round(flujo) };
  };

  const baseCF  = calcFlujoAnual(rentaBase);
  const simCF   = calcFlujoAnual(rentaSim);

  // 10. Flujo neto separando cuota de obra
  const flujoNetoObra  = simCF.flujo - cuotaObra * 12;  // con préstamo de obra
  const flujoSinObra   = simCF.flujo;                    // sin préstamo de obra

  // 11. Break-even: renta mínima para flujo = 0 (sin obra y con obra)
  const breakEvenSinObra = Math.ceil((mpiComp * 12 + gastosFijosMes * 12) / (12 * (1 - vacPct/100 - adminPct/100)));
  const breakEvenConObra = Math.ceil((mpiComp * 12 + gastosFijosMes * 12 + cuotaObra * 12) / (12 * (1 - vacPct/100 - adminPct/100)));

  // 12. Métricas de inversión
  const capRateBase = base.price > 0 && baseCF.noi > 0 ? ((baseCF.noi / base.price) * 100).toFixed(2) : "N/A";
  const capRateSim  = base.price > 0 && simCF.noi  > 0 ? ((simCF.noi  / base.price) * 100).toFixed(2) : "N/A";
  const cocBase     = downAmt > 0 ? ((baseCF.flujo / downAmt) * 100).toFixed(1) : "N/A";
  const cocSim      = downAmt > 0 ? ((flujoNetoObra / downAmt) * 100).toFixed(1) : "N/A";

  // 13. ROI de obra
  const mejoraFlujo = flujoSinObra - baseCF.flujo;
  const roiObra     = costoObra > 0 && mejoraFlujo > 0 ? ((mejoraFlujo / costoObra) * 100).toFixed(1) : null;

  // 14. Proyección 10 años — flujo acumulado año a año
  const proyFlujos = Array.from({ length: 10 }, (_, i) => {
    const yr = i + 1;
    // Renta crece 3% anual
    const rentaYr = Math.round(rentaSim * Math.pow(1.03, i));
    const { flujo } = calcFlujoAnual(rentaYr);
    // Obra: solo se paga si hay préstamo (hasta plazoObraM meses)
    const obraEsteAnio = costoObra > 0 && yr <= Math.ceil(plazoObraM / 12) ? cuotaObra * 12 : 0;
    return { yr, flujoNeto: flujo - obraEsteAnio, rentaYr };
  });

  // ─── COMPONENTES INTERNOS ───

  const SSlider = ({ label, value, min, max, step = 1, onChange, fmt = v => String(v), color = "#0e7490", sub }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color, background: color + "18", padding: "2px 10px", borderRadius: 99 }}>{fmt(value)}</span>
      </div>
      {sub && <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 3 }}>{sub}</div>}
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, height: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#d1d5db", marginTop: 1 }}>
        <span>{fmt(min)}</span><span>{fmt(max)}</span>
      </div>
    </div>
  );

  // Mini barra horizontal para comparación
  const MiniBar = ({ label, base: bv, sim: sv, fmt = v => fmtSign(v), colorGood = "#16a34a", colorBad = "#dc2626" }) => {
    const diff = sv - bv;
    const better = diff > 0;
    const maxAbs = Math.max(Math.abs(bv), Math.abs(sv), 1);
    const bPct = Math.min(Math.abs(bv) / maxAbs * 100, 100);
    const sPct = Math.min(Math.abs(sv) / maxAbs * 100, 100);
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3, fontSize: 11 }}>
          <span style={{ color: "#6b7280" }}>{label}</span>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#9ca3af" }}>{fmtSign(bv)}</span>
            <span style={{ fontWeight: 700, color: better ? colorGood : sv < 0 ? colorBad : "#374151" }}>
              {diff !== 0 ? (better ? "▲ " : "▼ ") : ""}{fmt(sv)}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${bPct}%`, height: 6, background: "#d1d5db", borderRadius: 99 }} />
          </div>
          <div style={{ flex: 1, background: "#f3f4f6", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{ width: `${sPct}%`, height: 6, background: sv >= 0 ? colorGood : colorBad, borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#d1d5db", marginTop: 1 }}>
          <span>Base</span><span>Simulado</span>
        </div>
      </div>
    );
  };

  const TABS = [
    { key: "fin",      icon: "🏦", label: "Financiamiento" },
    { key: "split",    icon: "🔀", label: "Dividir" },
    { key: "cuartos",  icon: "🛏️", label: "+Cuartos" },
    { key: "adu",      icon: "🏠", label: "+ADU" },
    { key: "obra",     icon: "🔨", label: "Obra" },
    { key: "breakeven",icon: "⚖️", label: "Break-even" },
  ];

  const positivo = flujoNetoObra >= 0;
  const haySim   = rentaSim > 0 || tasa !== 7.25 || downPct !== (profile.downPayment || 20);

  return (
    <div style={{ background: "white", borderRadius: 20, border: "2px solid #a5f3fc", marginBottom: 16, overflow: "hidden" }}>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(135deg, #0c4a6e, #0e7490)", padding: "16px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, color: "#67e8f9", letterSpacing: "0.5px", marginBottom: 3 }}>SIMULADOR — MOTOR PRINCIPAL</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "white", margin: 0, fontFamily: "Georgia, serif" }}>¿Qué pasa si…?</h3>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>Ajustá todo y mirá el flujo de caja año por año</div>
          </div>
          {/* Flujo simulado en el header */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: positivo ? "#34d399" : "#fca5a5", fontVariantNumeric: "tabular-nums" }}>
              {fmtSign(flujoNetoObra)}<span style={{ fontSize: 11, fontWeight: 400 }}>/año</span>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>flujo neto simulado</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", overflowX: "auto", borderBottom: "2px solid #e5e7eb", background: "#f8fafc" }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flexShrink: 0, padding: "10px 14px", background: tab === t.key ? "white" : "transparent", border: "none", borderBottom: `2px solid ${tab === t.key ? "#0e7490" : "transparent"}`, cursor: "pointer", fontSize: 11, fontWeight: tab === t.key ? 700 : 400, color: tab === t.key ? "#0e7490" : "#6b7280", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, whiteSpace: "nowrap", marginBottom: -2 }}>
            <span style={{ fontSize: 15 }}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>

        {/* ─── PANEL IZQUIERDO: controles ─── */}
        <div style={{ padding: "18px 20px", borderRight: "1px solid #f3f4f6" }}>

          {/* ── Financiamiento ── */}
          {tab === "fin" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0c4a6e", marginBottom: 12 }}>🏦 Condiciones del préstamo hipotecario</div>
              <SSlider label="Tasa de interés" value={tasa} min={4} max={12} step={0.25} onChange={setTasa} fmt={v => `${v}%`} color="#0e7490" />
              <SSlider label="Enganche" value={downPct} min={3} max={50} step={1} onChange={setDownPct} fmt={v => `${v}%`} color="#0e7490"
                sub={`Enganche: $${Math.round(base.price * downPct / 100).toLocaleString()} · Préstamo: $${Math.round(base.price * (1-downPct/100)).toLocaleString()}`} />
              <SSlider label="Plazo" value={plazoHip} min={10} max={30} step={5} onChange={setPlazoHip} fmt={v => `${v} años`} color="#0e7490" />
              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 12, marginTop: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 8 }}>Supuestos operativos</div>
                <SSlider label="Vacancia" value={vacPct} min={0} max={20} step={1} onChange={setVacPct} fmt={v => `${v}%`} color="#7c3aed" />
                <SSlider label="Administración" value={adminPct} min={0} max={20} step={1} onChange={setAdminPct} fmt={v => `${v}%`} color="#7c3aed" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5, marginTop: 4 }}>
                {[["FHA 3.5%",{t:7.0,d:3.5,p:30}],["Conv 20%",{t:7.25,d:20,p:30}],["15 años",{t:6.75,d:20,p:15}],["+30% down",{t:6.5,d:30,p:30}]].map(([l,pr]) => (
                  <button key={l} onClick={() => { setTasa(pr.t); setDownPct(pr.d); setPlazoHip(pr.p); }}
                    style={{ background: "#f0f9ff", color: "#0369a1", border: "1px solid #bae6fd", borderRadius: 8, padding: "5px", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>{l}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── Dividir unidades ── */}
          {tab === "split" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0c4a6e", marginBottom: 4 }}>🔀 Dividir la propiedad en unidades</div>
              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12, lineHeight: 1.5 }}>
                {totalBeds}hab/{totalBaths}ba · Las rentas inician en $0 — configurá cada unidad abajo.
              </div>
              {SPLITS.map((sp, idx) => (
                <button key={sp.id} onClick={() => { setSplitIdx(idx); setSplitRentas({}); }}
                  style={{ width: "100%", textAlign: "left", background: splitIdx === idx ? "#f0f9ff" : "#f9fafb", border: `1.5px solid ${splitIdx === idx ? "#0e7490" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 11px", marginBottom: 6, cursor: "pointer" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: splitIdx === idx ? "#0c4a6e" : "#374151" }}>{sp.label}</div>
                    {sp.costoRef > 0 && <span style={{ fontSize: 10, background: "#fef3c7", color: "#92400e", padding: "1px 7px", borderRadius: 99, fontWeight: 600 }}>~${sp.costoRef.toLocaleString()}</span>}
                  </div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {sp.units.map(u => (
                      <span key={u.id} style={{ background: splitIdx === idx ? "#bae6fd" : "#e5e7eb", color: splitIdx === idx ? "#0c4a6e" : "#6b7280", fontSize: 10, padding: "1px 7px", borderRadius: 99 }}>{u.label}</span>
                    ))}
                  </div>
                </button>
              ))}
              {/* Renta por unidad (parte desde 0) */}
              {splitIdx > 0 && (
                <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "12px", marginTop: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#0c4a6e", marginBottom: 8 }}>Renta por unidad (parte de $0)</div>
                  {splitActual.units.map(u => (
                    <SSlider key={u.id}
                      label={u.label}
                      value={getSplitRenta(u.id, u.beds)}
                      min={0} max={6000} step={50}
                      onChange={v => setSplitRentas(p => ({ ...p, [u.id]: v }))}
                      fmt={v => v === 0 ? "$0 — sin asignar" : `$${v.toLocaleString()}/mes`}
                      color="#0e7490"
                      sub={`Ref. Miami: $${rentaRefMiami(u.beds).toLocaleString()}/mes`}
                    />
                  ))}
                  <div style={{ background: "#e0f2fe", borderRadius: 8, padding: "8px 10px", marginTop: 4 }}>
                    <div style={{ fontSize: 10, color: "#0369a1", marginBottom: 1 }}>Renta total del split</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0c4a6e" }}>${rentaSplit.toLocaleString()}/mes</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Cuartos extra ── */}
          {tab === "cuartos" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0c4a6e", marginBottom: 4 }}>🛏️ Cuartos extra (sobre el split actual)</div>
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "9px 12px", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#0369a1" }}>Parte desde la configuración del split:</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0c4a6e" }}>{splitActual.label} — renta: ${rentaSplit.toLocaleString()}/mes</div>
              </div>
              <SSlider label="Cuartos a agregar" value={extraRooms} min={0} max={6} step={1} onChange={setExtraRooms}
                fmt={v => v === 0 ? "Ninguno" : `${v} cuarto${v > 1 ? "s" : ""}`} color="#0e7490" />
              {extraRooms > 0 && (
                <SSlider label="Renta por cuarto/mes" value={rentaXCuarto} min={0} max={2500} step={50} onChange={setRentaXCuarto}
                  fmt={v => v === 0 ? "$0 — sin asignar" : `$${v.toLocaleString()}/mes`} color="#0e7490"
                  sub="Ref. Miami: cuarto amueblado $900–$1,400/mes" />
              )}
              {extraRooms > 0 && rentaXCuarto > 0 && (
                <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, padding: "9px 12px", marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: "#065f46" }}>Ingreso adicional por cuartos</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#15803d" }}>+${(extraRooms * rentaXCuarto).toLocaleString()}/mes</div>
                </div>
              )}
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 12, lineHeight: 1.5, background: "#f9fafb", borderRadius: 8, padding: "8px 10px" }}>
                Renta total acumulada:<br />
                Split: <strong>${rentaSplit.toLocaleString()}</strong> + Cuartos: <strong>${rentaCuartos.toLocaleString()}</strong> + ADUs: <strong>${rentaADUs.toLocaleString()}</strong> = <strong style={{ color: "#0c4a6e" }}>${rentaSim.toLocaleString()}/mes</strong>
              </div>
            </div>
          )}

          {/* ── ADU ── */}
          {tab === "adu" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0c4a6e", marginBottom: 4 }}>🏠 ADUs (sobre split + cuartos extra)</div>
              {zoningInfo?.aduPotential
                ? <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, padding: "9px 12px", marginBottom: 12, fontSize: 11, color: "#065f46" }}>✓ Potencial ADU según zonificación — verificar con municipio.</div>
                : <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 10, padding: "9px 12px", marginBottom: 12, fontSize: 11, color: "#92400e" }}>⚠ ADU no confirmada. Verificar con City of Miami antes de proyectar.</div>
              }
              <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "9px 12px", marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "#0369a1" }}>Renta acumulada hasta ahora:</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0c4a6e" }}>${(rentaSplit + rentaCuartos).toLocaleString()}/mes</div>
              </div>
              <SSlider label="Cantidad de ADUs" value={extraADUs} min={0} max={3} step={1} onChange={setExtraADUs}
                fmt={v => v === 0 ? "Ninguna" : `${v} ADU`} color="#0e7490" />
              {extraADUs > 0 && (
                <SSlider label="Renta por ADU/mes" value={rentaXADU} min={0} max={5000} step={100} onChange={setRentaXADU}
                  fmt={v => v === 0 ? "$0 — sin asignar" : `$${v.toLocaleString()}/mes`} color="#0e7490"
                  sub="Ref. Miami: ADU estudio $1,400 · 1b/1ba $2,100 · 2b/1ba $2,800" />
              )}
              {extraADUs > 0 && rentaXADU > 0 && (
                <div style={{ background: "#d1fae5", border: "1px solid #6ee7b7", borderRadius: 10, padding: "9px 12px", marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: "#065f46" }}>Ingreso adicional por ADUs</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#15803d" }}>+${rentaADUs.toLocaleString()}/mes</div>
                </div>
              )}
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 12, lineHeight: 1.5, background: "#f9fafb", borderRadius: 8, padding: "8px 10px" }}>
                Renta total acumulada:<br />
                Split: <strong>${rentaSplit.toLocaleString()}</strong> + Cuartos: <strong>${rentaCuartos.toLocaleString()}</strong> + ADUs: <strong>${rentaADUs.toLocaleString()}</strong> = <strong style={{ color: "#0c4a6e" }}>${rentaSim.toLocaleString()}/mes</strong>
              </div>
            </div>
          )}

          {/* ── Obra ── */}
          {tab === "obra" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", marginBottom: 12 }}>🔨 Préstamo de construcción / remodelación</div>
              <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 11, color: "#6b21a8" }}>
                Este préstamo es <strong>separado de la hipoteca</strong>. Se descuenta del flujo de caja durante el plazo configurado.
              </div>
              <SSlider label="Monto de la obra ($)" value={costoObra} min={0} max={300000} step={2500} onChange={setCostoObra}
                fmt={v => v === 0 ? "$0 — sin obra" : `$${v.toLocaleString()}`} color="#7c3aed" />
              {costoObra > 0 && <>
                <SSlider label="Tasa del préstamo de obra (%)" value={tasaObra} min={0} max={20} step={0.25} onChange={setTasaObra} fmt={v => `${v}%`} color="#7c3aed" />
                <SSlider label="Plazo de la obra (meses)" value={plazoObraM} min={6} max={120} step={6} onChange={setPlazoObraM}
                  fmt={v => `${v} meses (${(v/12).toFixed(1)} años)`} color="#7c3aed" />
                <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "10px 12px", marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: "#7c3aed" }}>Cuota mensual de obra</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#6b21a8" }}>${cuotaObra.toLocaleString()}/mes</div>
                  <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>Total a pagar: ${(cuotaObra * plazoObraM).toLocaleString()} en {plazoObraM} meses</div>
                </div>
              </>}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6 }}>Costos típicos Miami</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 5 }}>
                  {[["Cuarto (cosmético)", 8000],["Cuarto (estándar)", 18000],["ADU garaje", 45000],["ADU modular", 80000],["ADU nueva", 140000],["Duplex conv.", 55000]].map(([l, v]) => (
                    <button key={l} onClick={() => setCostoObra(v)}
                      style={{ background: costoObra === v ? "#7c3aed" : "#faf5ff", color: costoObra === v ? "white" : "#6b21a8", border: "1px solid #e9d5ff", borderRadius: 8, padding: "5px 6px", fontSize: 10, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                      {l}<br /><span style={{ fontWeight: 800 }}>${v.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Break-even ── */}
          {tab === "breakeven" && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0c4a6e", marginBottom: 12 }}>⚖️ Renta mínima para no perder</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#0369a1", marginBottom: 2 }}>Sin préstamo de obra</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#0c4a6e" }}>${breakEvenSinObra.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>por mes</div>
                </div>
                <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#7c3aed", marginBottom: 2 }}>Con préstamo de obra</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#6b21a8" }}>${breakEvenConObra.toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: "#9ca3af" }}>por mes</div>
                </div>
              </div>
              <div style={{ marginTop: 12, background: "#f9fafb", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Estado actual del simulador</div>
                {[
                  ["Renta base (sin cambios)", rentaBase, breakEvenSinObra],
                  ["Renta simulada (con todos los cambios)", rentaSim, breakEvenConObra],
                ].map(([l, renta, be]) => {
                  const diff = renta - be;
                  const ok = diff >= 0;
                  return (
                    <div key={l} style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, color: "#6b7280" }}>{l}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>${renta.toLocaleString()}/mes</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: ok ? "#16a34a" : "#dc2626", background: ok ? "#d1fae5" : "#fee2e2", padding: "2px 8px", borderRadius: 99 }}>
                          {ok ? `✓ +$${diff.toLocaleString()} sobre break-even` : `⚠ faltan $${Math.abs(diff).toLocaleString()}/mes`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
                Con la configuración actual necesitás <strong>${breakEvenConObra.toLocaleString()}/mes</strong> de renta para cubrir hipoteca, gastos operativos{costoObra > 0 ? ", y préstamo de obra" : ""}.
              </div>
            </div>
          )}
        </div>

        {/* ─── PANEL DERECHO: resultados ─── */}
        <div style={{ padding: "18px 20px" }}>

          {/* Resumen de renta */}
          <div style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#0369a1", marginBottom: 6, textTransform: "uppercase" }}>Composición de renta simulada</div>
            {[
              ["Split / unidades", rentaSplit],
              ["Cuartos extra", rentaCuartos],
              ["ADUs", rentaADUs],
            ].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: v > 0 ? "#0c4a6e" : "#9ca3af", marginBottom: 2 }}>
                <span>{l}</span>
                <span style={{ fontWeight: v > 0 ? 700 : 400 }}>{v > 0 ? `$${v.toLocaleString()}/mes` : "—"}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid #bae6fd", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0c4a6e" }}>Total mensual</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#0c4a6e" }}>${rentaSim.toLocaleString()}</span>
            </div>
          </div>

          {/* Comparación base vs simulado */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", marginBottom: 8, textTransform: "uppercase" }}>Base → Simulado</div>
            <MiniBar label="Renta mensual" base={rentaBase} sim={rentaSim} fmt={v => `$${Math.abs(v).toLocaleString()}/mes`} />
            <MiniBar label="NOI anual" base={baseCF.noi} sim={simCF.noi} />
            <MiniBar label="Flujo (sin obra)" base={baseCF.flujo} sim={flujoSinObra} />
            {costoObra > 0 && <MiniBar label="Flujo (con obra)" base={baseCF.flujo} sim={flujoNetoObra} />}
            <MiniBar label="Cap Rate" base={parseFloat(capRateBase)||0} sim={parseFloat(capRateSim)||0} fmt={v=>`${Math.abs(v).toFixed(2)}%`} />
          </div>

          {/* Desglose de costos mensuales */}
          <div style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Desglose mensual</div>
            {[
              { l: "Hipoteca P&I", v: mpiComp, c: "#3b82f6" },
              { l: "Impuestos", v: taxes, c: "#8b5cf6" },
              { l: "Seguro", v: ins, c: "#f59e0b" },
              { l: "HOA", v: hoa, c: "#ec4899" },
              { l: "Mantenimiento", v: maint, c: "#6b7280" },
              ...(costoObra > 0 ? [{ l: "Cuota obra", v: cuotaObra, c: "#7c3aed" }] : []),
            ].filter(d => d.v > 0).map(d => {
              const total = mpiComp + taxes + ins + hoa + maint + (costoObra > 0 ? cuotaObra : 0);
              return (
                <div key={d.l} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.c, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "#6b7280", flex: 1 }}>{d.l}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#374151" }}>${d.v.toLocaleString()}</span>
                  <div style={{ width: 50, background: "#e5e7eb", borderRadius: 99, height: 4 }}>
                    <div style={{ width: `${Math.min(d.v/total*100, 100)}%`, height: 4, background: d.c, borderRadius: 99 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ROI de obra */}
          {roiObra && (
            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1e40af", marginBottom: 2 }}>ROI DE LA OBRA</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1d4ed8" }}>{roiObra}%<span style={{ fontSize: 11, fontWeight: 400 }}> anual</span></div>
              <div style={{ fontSize: 11, color: parseFloat(roiObra) > 10 ? "#16a34a" : "#d97706", fontWeight: 600, marginTop: 2 }}>
                {parseFloat(roiObra) > 10 ? "✓ Supera costo de capital" : "Evaluá si justifica el riesgo"}
              </div>
            </div>
          )}

          {/* Diagnóstico */}
          <div style={{ background: positivo ? "#d1fae5" : "#fef2f2", border: `1px solid ${positivo ? "#6ee7b7" : "#fca5a5"}`, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: positivo ? "#065f46" : "#991b1b", marginBottom: 4 }}>
              {positivo ? "✓ Cash flow positivo" : "⚠ Cash flow negativo"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: positivo ? "#15803d" : "#dc2626" }}>
              {fmtSign(flujoNetoObra)}/año · {fmtSign(Math.round(flujoNetoObra/12))}/mes
            </div>
            {!positivo && rentaSim > 0 && (
              <div style={{ fontSize: 11, color: "#991b1b", marginTop: 4 }}>
                Falta ${Math.ceil(-flujoNetoObra/12).toLocaleString()}/mes · Break-even: ${breakEvenConObra.toLocaleString()}/mes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── PROYECCIÓN AÑO A AÑO ─── */}
      <div style={{ borderTop: "2px solid #f3f4f6", padding: "18px 22px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 14 }}>
          Flujo de caja año a año — separado: operativo vs. préstamo de obra
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6 }}>
          {proyFlujos.map(yr => {
            const obraEsteAnio = costoObra > 0 && yr.yr <= Math.ceil(plazoObraM / 12) ? cuotaObra * 12 : 0;
            const flujoOp  = yr.flujoNeto + obraEsteAnio;  // flujo operativo puro (sin obra)
            const flujoNet = yr.flujoNeto;                  // flujo neto (con obra si aplica)
            const maxAbs   = Math.max(...proyFlujos.map(y => Math.abs(y.flujoNeto)), 1);
            const hOp  = Math.max(Math.abs(flujoOp)  / maxAbs * 80, 4);
            const hNet = Math.max(Math.abs(flujoNet) / maxAbs * 80, 4);
            const posOp  = flujoOp  >= 0;
            const posNet = flujoNet >= 0;
            return (
              <div key={yr.yr} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                {/* Etiqueta flujo neto */}
                <div style={{ fontSize: 9, fontWeight: 700, color: posNet ? "#16a34a" : "#dc2626", textAlign: "center" }}>
                  {posNet ? "+" : ""}{Math.round(flujoNet / 1000)}K
                </div>
                {/* Barras apiladas */}
                <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 84 }}>
                  {/* Barra operativa */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 84 }}>
                    <div style={{ width: 10, height: hOp, background: posOp ? "#10b981" : "#ef4444", borderRadius: "2px 2px 0 0", opacity: 0.5 }} />
                  </div>
                  {/* Barra neta */}
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: 84 }}>
                    <div style={{ width: 10, height: hNet, background: posNet ? "#10b981" : "#ef4444", borderRadius: "2px 2px 0 0" }} />
                  </div>
                </div>
                <div style={{ fontSize: 9, color: "#9ca3af" }}>Año {yr.yr}</div>
                {obraEsteAnio > 0 && <div style={{ fontSize: 8, color: "#7c3aed", fontWeight: 700 }}>obra</div>}
              </div>
            );
          })}
        </div>
        {/* Leyenda */}
        <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 10, color: "#6b7280" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 6, background: "#10b981", opacity: 0.5, borderRadius: 2 }} />
            <span>Flujo operativo (sin obra)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 6, background: "#10b981", borderRadius: 2 }} />
            <span>Flujo neto (descontando obra)</span>
          </div>
          {costoObra > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 10, height: 6, background: "#7c3aed", borderRadius: 2 }} />
            <span>Años con cuota de obra</span>
          </div>}
        </div>
        <div style={{ fontSize: 9, color: "#d1d5db", marginTop: 6 }}>
          * Renta crece 3% anual. Gastos fijos constantes. Préstamo de obra se descuenta solo durante el plazo configurado.
        </div>
      </div>
    </div>
  );
};
// ============================================================
// LINK ANALYZER PAGE
// ============================================================

// Detect source platform from URL
// ============================================================
// LINK ANALYZER — single-click AI extraction + full analysis
// ============================================================

function detectSource(url) {
  if (!url) return "other";
  const u = url.toLowerCase();
  if (u.includes("zillow.com")) return "zillow";
  if (u.includes("redfin.com")) return "redfin";
  if (u.includes("realtor.com")) return "realtor";
  if (u.includes("trulia.com")) return "trulia";
  if (u.includes("loopnet.com")) return "loopnet";
  if (u.includes("crexi.com")) return "crexi";
  return "other";
}

const SOURCE_META = {
  zillow:  { label: "Zillow",       color: "#006aff", bg: "#e6f0ff" },
  redfin:  { label: "Redfin",       color: "#c8200e", bg: "#fde8e6" },
  realtor: { label: "Realtor.com",  color: "#d6001c", bg: "#fde8ea" },
  trulia:  { label: "Trulia",       color: "#5a4fcf", bg: "#ede9fe" },
  loopnet: { label: "LoopNet",      color: "#1a5276", bg: "#d6eaf8" },
  crexi:   { label: "Crexi",        color: "#0d6efd", bg: "#dbeafe" },
  other:   { label: "External",     color: "#374151", bg: "#f3f4f6" },
};

// Build a full property object from AI-extracted JSON
function buildPropertyFromAI(ai, url, source) {
  const price       = Number(ai.price) || 0;
  const beds        = Number(ai.beds)  || 0;
  const baths       = Number(ai.baths) || 0;
  const sqft        = Number(ai.sqft)  || 0;
  const hoa         = Number(ai.hoa)   || 0;
  const lotSize     = Number(ai.lotSize)  || 0;
  const yearBuilt   = Number(ai.yearBuilt)|| 0;
  const propType    = ai.propertyType  || "Single Family";
  const address     = ai.address       || "Property from link";
  const neighborhood= ai.neighborhood  || "Miami";
  const zipCode     = ai.zipCode       || "";
  const zoningCode  = ai.zoningCode    || "RS-1";
  const taxes       = Number(ai.taxes) || Math.round(price * 0.011);
  const insurance   = Number(ai.insurance) || Math.round(price * 0.005);
  let estimatedRent = Number(ai.estimatedRent) || 0;
  if (!estimatedRent && price > 0) {
    if (propType.toLowerCase().includes("condo"))
      estimatedRent = Math.round(sqft > 0 ? sqft * 3.2 : price * 0.0055);
    else if (/duplex|multi/i.test(propType))
      estimatedRent = Math.round(price * 0.0065);
    else
      estimatedRent = Math.round(price * 0.005);
  }
  return {
    id: "LINK-" + Date.now(),
    address, city: "Miami", zipCode, neighborhood,
    propertyType: propType, price, beds, baths,
    livingArea: sqft, lotSize, yearBuilt, hoa,
    taxes, insuranceEstimate: insurance, estimatedRent,
    currentUse: ai.currentUse || "Unknown",
    zoningCode, folio: ai.folio || "Requires lookup",
    lastSalePrice: Number(ai.lastSalePrice) || null,
    lastSaleDate: ai.lastSaleDate || null,
    assessedValue: null,
    notes: ai.notes || "",
    tags: [], color: "#1a4a6b",
    _sourceUrl: url, _source: source,
    _aiExtracted: ai._extractedFields  || [],
    _aiEstimated: ai._estimatedFields  || [],
    _aiMissing:   ai._missingFields    || [],
    _extractionNotes: ai.extractionNotes || "",
  };
}

// Confidence pill
const CPill = ({ label, type }) => {
  const styles = {
    extracted: { bg: "#d1fae5", color: "#065f46", prefix: "✓" },
    estimated:  { bg: "#fef3c7", color: "#92400e", prefix: "~" },
    missing:    { bg: "#fee2e2", color: "#991b1b", prefix: "⚠" },
  };
  const s = styles[type] || styles.missing;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700,
      padding: "2px 9px", borderRadius: 99, whiteSpace: "nowrap" }}>
      {s.prefix} {label}
    </span>
  );
};

// Loading step indicator
const LoadStep = ({ steps, current }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "24px 0" }}>
    {steps.map((s, i) => {
      const done    = i < current;
      const active  = i === current;
      return (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
            background: done ? "#10b981" : active ? "#3b82f6" : "#e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: done || active ? "white" : "#9ca3af", fontWeight: 700,
          }}>
            {done ? "✓" : i + 1}
          </div>
          <div style={{ fontSize: 14, color: done ? "#16a34a" : active ? "#1d4ed8" : "#9ca3af", fontWeight: active ? 600 : 400 }}>
            {s}
            {active && <span style={{ marginLeft: 8, fontSize: 12, color: "#3b82f6" }}>working…</span>}
          </div>
        </div>
      );
    })}
  </div>
);

const LinkAnalyzerPage = ({ profile, onBack, onFullDetail, onLead }) => {
  const [phase, setPhase]         = useState("input");    // input | loading | result | error
  const [url, setUrl]             = useState("");
  const [loadStep, setLoadStep]   = useState(0);
  const [property, setProperty]   = useState(null);
  const [aiReport, setAiReport]   = useState("");
  const [scenario, setScenario]   = useState("base");
  const [errorMsg, setErrorMsg]   = useState("");
  const [editMode, setEditMode]   = useState(false);
  const [editFields, setEditFields] = useState({});

  const source = detectSource(url);

  const LOAD_STEPS = [
    "Reading the listing page",
    "Extracting property data with AI",
    "Running financial analysis",
    "Generating investment report",
  ];

  // Kick off the full pipeline
  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setPhase("loading");
    setLoadStep(0);
    setProperty(null);
    setAiReport(null);
    setErrorMsg("");

    try {
      // ── PASO 1: web_fetch real de la URL ──
      setLoadStep(0);
      const extractPrompt = `Eres un especialista en extracción de datos de listados inmobiliarios. El usuario te da esta URL de una propiedad en venta:

URL: ${url}

INSTRUCCIONES:
1. Usa la herramienta web_search para buscar esta propiedad y obtener sus datos reales del listado.
2. Busca por la dirección o identificadores visibles en la URL.
3. Extrae TODOS los datos reales que aparezcan en el listado.
4. Devuelve ÚNICAMENTE un objeto JSON válido (sin markdown, sin backticks, sin explicación).

JSON requerido:
{
  "address": "dirección completa",
  "neighborhood": "vecindario",
  "city": "ciudad",
  "zipCode": "código postal",
  "propertyType": "Single Family | Condo | Townhouse | Duplex | Multifamily | Mixed Use | Vacant Lot",
  "price": 0,
  "beds": 0,
  "baths": 0,
  "sqft": 0,
  "lotSize": 0,
  "yearBuilt": 0,
  "hoa": 0,
  "taxes": 0,
  "insurance": 0,
  "zoningCode": "",
  "folio": "",
  "currentUse": "Owner Occupied | Rental | Vacant | Unknown",
  "lastSalePrice": 0,
  "lastSaleDate": "",
  "estimatedRent": 0,
  "description": "descripción real del listado",
  "features": ["lista", "de", "características"],
  "daysOnMarket": 0,
  "pricePerSqft": 0,
  "listingAgent": "",
  "mlsId": "",
  "notes": "notas del listado",
  "_extractedFields": ["campos","realmente","encontrados","en","el","listado"],
  "_estimatedFields": ["campos","que","tuviste","que","estimar"],
  "_missingFields": ["campos","no","disponibles"],
  "extractionNotes": "nota breve sobre calidad de datos y qué no se pudo encontrar"
}

REGLAS CRÍTICAS:
- Usa SOLO datos reales del listado para _extractedFields.
- Para campos no encontrados, estima con conocimiento del mercado de Miami y márcalos en _estimatedFields.
- estimatedRent: si no aparece en el listado, estima basado en tipo, tamaño y precio usando comps de Miami.
- taxes: si no aparece, estima al 1.1% anual del precio (promedio Miami-Dade).
- insurance: si no aparece, estima al 0.5% anual (alto por riesgo de huracanes en Miami).
- zoningCode: si no aparece, infiere código probable según tipo y zona (T3/T4/T5/T6/RS-1/SD-2 etc).
- Devuelve SOLO el JSON crudo. Ningún otro texto.`;

      const extractRes = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: extractPrompt }],
        }),
      });
      const extractData = await extractRes.json();

      // Collect all text blocks (Claude may produce multiple after tool use)
      const allTextBlocks = (extractData.content || [])
        .filter(b => b.type === "text")
        .map(b => b.text)
        .join("\n")
        .trim();

      // Try to find JSON object anywhere in the response
      const jsonMatch = allTextBlocks.match(/\{[\s\S]*\}/);
      let aiData;
      if (jsonMatch) {
        try { aiData = JSON.parse(jsonMatch[0]); } catch {}
      }

      // Fallback: second call asking Claude to re-format what it found
      if (!aiData) {
        const fallbackRes = await fetch("/api/claude", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1200,
            messages: [{
              role: "user",
              content: `La página del listado puede estar restringida. Con base en esta URL: ${url}
              
Extrae todo lo posible del slug de la URL (dirección, precio si aparece, etc.) y completa el resto con estimaciones reales del mercado de Miami.
Devuelve SOLO el JSON crudo sin backticks ni explicaciones:
{"address":"","neighborhood":"","city":"Miami","zipCode":"","propertyType":"Single Family","price":0,"beds":0,"baths":0,"sqft":0,"lotSize":0,"yearBuilt":0,"hoa":0,"taxes":0,"insurance":0,"zoningCode":"RS-1","folio":null,"currentUse":"Unknown","lastSalePrice":null,"lastSaleDate":null,"estimatedRent":0,"description":"","features":[],"daysOnMarket":0,"pricePerSqft":0,"listingAgent":"","mlsId":"","notes":"","_extractedFields":[],"_estimatedFields":["price","beds","baths","sqft","taxes","insurance","estimatedRent"],"_missingFields":[],"extractionNotes":"Página inaccesible. Valores basados en URL y estimaciones del mercado de Miami."}`
            }]
          }),
        });
        const fbData = await fallbackRes.json();
        const fbText = (fbData.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
        const fbMatch = fbText.match(/\{[\s\S]*\}/);
        if (fbMatch) aiData = JSON.parse(fbMatch[0]);
      }

      if (!aiData) throw new Error("No se pudieron extraer datos de la propiedad.");

      const prop = buildPropertyFromAI(aiData, url, source);
      setProperty(prop);
      setLoadStep(2);
      await new Promise(r => setTimeout(r, 300));

      // ── PASO 2: Generar advisory estructurado en JSON para gráficas ──
      setLoadStep(3);
      const downPct = profile.downPayment || 20;
      const finBase = analyzeFinancials(prop, profile, "base");
      const finCons = analyzeFinancials(prop, profile, "conservative");
      const finAgr  = analyzeFinancials(prop, profile, "aggressive");
      const zoning  = analyzeZoning(prop);

      const advisoryPrompt = `Eres un asesor senior de bienes raíces en Miami. Analiza esta propiedad y devuelve un JSON estructurado para mostrar un dashboard de inversión en ESPAÑOL.

PROPIEDAD:
- Dirección: ${prop.address}, ${prop.neighborhood}, ${prop.city} ${prop.zipCode}
- Tipo: ${prop.propertyType} | Hab/Baños: ${prop.beds}/${prop.baths} | ${prop.livingArea} sqft | Terreno: ${prop.lotSize || "N/A"} sf
- Año construcción: ${prop.yearBuilt || "Desconocido"} | Zonificación: ${prop.zoningCode} | HOA: $${prop.hoa}/mes
- Precio: $${prop.price.toLocaleString()} | Precio/sqft: $${prop.price > 0 && prop.livingArea > 0 ? Math.round(prop.price/prop.livingArea) : "N/A"}
- Descripción del listado: ${aiData.description || "No disponible"}
- Características: ${(aiData.features || []).join(", ") || "No listadas"}
- Datos extraídos del listado: ${(prop._aiExtracted || []).join(", ") || "ninguno confirmado"}
- Datos estimados: ${(prop._aiEstimated || []).join(", ") || "ninguno"}

FINANCIEROS (escenario base, ${downPct}% enganche, tasa 7.25%, 30 años):
- Préstamo: $${finBase.loanAmount.toLocaleString()} | Hipoteca P&I: $${finBase.mortgagePI.toLocaleString()}/mes
- Impuestos: $${finBase.taxesMonthly.toLocaleString()}/mes | Seguro: $${finBase.insuranceMonthly.toLocaleString()}/mes | HOA: $${finBase.hoaMonthly}/mes
- Costo mensual total: $${finBase.totalMonthlyCost.toLocaleString()}
- Renta estimada: $${finBase.monthlyRent.toLocaleString()}/mes | Ingreso bruto anual: $${finBase.grossIncome.toLocaleString()}
- NOI: $${finBase.noi.toLocaleString()} | Flujo anual: $${finBase.annualCashFlow.toLocaleString()}
- Cap Rate: ${finBase.capRate}% | Cash-on-Cash: ${finBase.cashOnCash}% | Enganche: $${finBase.downPaymentAmt.toLocaleString()}

ESCENARIO CONSERVADOR: renta $${finCons.monthlyRent}/mes | NOI $${finCons.noi} | flujo $${finCons.annualCashFlow}
ESCENARIO AGRESIVO: renta $${finAgr.monthlyRent}/mes | NOI $${finAgr.noi} | flujo $${finAgr.annualCashFlow}

ZONIFICACIÓN: ${zoning.densityClue} | Unidades máx est: ${zoning.maxUnitsEstimated} | ADU: ${zoning.aduPotential} | Duplex: ${zoning.duplexPotential} | Multifamiliar: ${zoning.multifamilyPotential}

Devuelve SOLO este JSON (sin markdown, sin backticks):
{
  "scoreInversion": 0,
  "scoreDescripcion": "texto explicando el score",
  "veredicto": "COMPRAR | NEGOCIAR | EVITAR | ANALIZAR MÁS",
  "veredictoColor": "#16a34a | #d97706 | #dc2626 | #2563eb",
  "resumen": "2-3 oraciones describiendo la propiedad y su contexto en el mercado de Miami",
  "puntosPositivos": ["punto 1", "punto 2", "punto 3"],
  "puntosNegativos": ["riesgo 1", "riesgo 2", "riesgo 3"],
  "mejorUso": "Vivienda principal | Renta a largo plazo | Renta a corto plazo | House hacking | Desarrollo | Flip",
  "mejorUsoRazon": "explicación breve",
  "precioOferta": 0,
  "precioOfertaRazon": "por qué ese precio",
  "rentaRangoMin": 0,
  "rentaRangoMax": 0,
  "rentaRangoNota": "explicación del rango de renta",
  "breakEvenOcupacion": 0,
  "apreciacionAnual": 4.5,
  "riesgos": [
    {"titulo": "riesgo 1", "descripcion": "detalle", "nivel": "alto | medio | bajo"},
    {"titulo": "riesgo 2", "descripcion": "detalle", "nivel": "alto | medio | bajo"},
    {"titulo": "riesgo 3", "descripcion": "detalle", "nivel": "alto | medio | bajo"}
  ],
  "zonificacionNota": "análisis de zonificación y potencial de desarrollo",
  "proximosPasos": ["paso 1", "paso 2", "paso 3"],
  "comparativaMercado": {
    "precioMercado": 0,
    "precioListado": 0,
    "rentaMercado": 0,
    "rentaEstimada": 0,
    "capRateMercado": 0,
    "capRatePropiedad": 0
  },
  "proyeccionPatrimonio": [
    {"anio": 1, "valorPropiedad": 0, "balancePrestamo": 0, "patrimonio": 0},
    {"anio": 3, "valorPropiedad": 0, "balancePrestamo": 0, "patrimonio": 0},
    {"anio": 5, "valorPropiedad": 0, "balancePrestamo": 0, "patrimonio": 0},
    {"anio": 10, "valorPropiedad": 0, "balancePrestamo": 0, "patrimonio": 0}
  ]
}

Sé honesto y específico para el mercado de Miami. No exageres. Usa números reales.`;

      const advisoryRes = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: advisoryPrompt }],
        }),
      });
      const advisoryData = await advisoryRes.json();
      const advText = (advisoryData.content || []).filter(b => b.type === "text").map(b => b.text).join("").trim();
      const advMatch = advText.match(/\{[\s\S]*\}/);
      let advisory = null;
      if (advMatch) {
        try { advisory = JSON.parse(advMatch[0]); } catch {}
      }

      setAiReport(advisory);
      setPhase("result");

    } catch (err) {
      console.error(err);
      setErrorMsg("No se pudo analizar este link. Verificá la URL e intentá nuevamente.");
      setPhase("error");
    }
  };

  // Inline field editor
  const startEdit = () => {
    if (!property) return;
    setEditFields({
      price: property.price, beds: property.beds, baths: property.baths,
      sqft: property.livingArea, hoa: property.hoa, lotSize: property.lotSize,
      yearBuilt: property.yearBuilt, zoningCode: property.zoningCode,
      estimatedRent: property.estimatedRent,
    });
    setEditMode(true);
  };

  const applyEdits = () => {
    if (!property) return;
    const updated = {
      ...property,
      price: Number(editFields.price) || property.price,
      beds: Number(editFields.beds) || property.beds,
      baths: Number(editFields.baths) || property.baths,
      livingArea: Number(editFields.sqft) || property.livingArea,
      hoa: Number(editFields.hoa) || 0,
      lotSize: Number(editFields.lotSize) || property.lotSize,
      yearBuilt: Number(editFields.yearBuilt) || property.yearBuilt,
      zoningCode: editFields.zoningCode || property.zoningCode,
      estimatedRent: Number(editFields.estimatedRent) || property.estimatedRent,
      taxes: Math.round((Number(editFields.price) || property.price) * 0.011),
      insuranceEstimate: Math.round((Number(editFields.price) || property.price) * 0.005),
    };
    setProperty(updated);
    setEditMode(false);
  };

  // ── CHART HELPERS ──
  const BarChart = ({ data, height = 160, color = "#10b981", label }) => {
    const max = Math.max(...data.map(d => Math.abs(d.value)), 1);
    return (
      <div>
        {label && <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</div>}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height }}>
          {data.map((d, i) => {
            const pct = Math.abs(d.value) / max;
            const isNeg = d.value < 0;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: isNeg ? "#dc2626" : color }}>
                  {d.value >= 0 ? "+" : ""}${Math.abs(d.value).toLocaleString()}
                </div>
                <div style={{ width: "100%", height: Math.max(pct * (height - 40), 4), background: isNeg ? "#fee2e2" : color, borderRadius: "4px 4px 0 0", border: isNeg ? "1px solid #fca5a5" : "none" }} />
                <div style={{ fontSize: 11, color: "#6b7280", textAlign: "center", lineHeight: 1.2 }}>{d.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const DonutChart = ({ value, max = 100, size = 120, color = "#10b981", label, sub }) => {
    const pct = Math.min(value / max, 1);
    const r = 44;
    const circ = 2 * Math.PI * r;
    const dash = circ * pct;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ * 0.25}
            strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
          <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{value}</text>
          <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#6b7280">{sub || "/100"}</text>
        </svg>
        {label && <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", textAlign: "center" }}>{label}</div>}
      </div>
    );
  };

  const HorizBar = ({ label, value, max, color = "#10b981", fmt: fmtFn }) => {
    const pct = Math.min(Math.abs(value) / max, 1) * 100;
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
          <span style={{ color: "#374151" }}>{label}</span>
          <span style={{ fontWeight: 700, color: value < 0 ? "#dc2626" : "#111827" }}>{fmtFn ? fmtFn(value) : value}</span>
        </div>
        <div style={{ background: "#f3f4f6", borderRadius: 99, height: 8 }}>
          <div style={{ width: `${pct}%`, height: 8, background: value < 0 ? "#dc2626" : color, borderRadius: 99, transition: "width 0.8s ease" }} />
        </div>
      </div>
    );
  };

  const ScenarioToggle = ({ value, onChange }) => (
    <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 10, padding: 3, gap: 2 }}>
      {[["conservative","Conservador"],["base","Base"],["aggressive","Optimista"]].map(([k, label]) => (
        <button key={k} onClick={() => onChange(k)}
          style={{ background: value === k ? "white" : "transparent", color: value === k ? "#111827" : "#6b7280", border: "none", borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: value === k ? 700 : 400, cursor: "pointer", boxShadow: value === k ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
          {label}
        </button>
      ))}
    </div>
  );

  const RiskBadge = ({ nivel }) => {
    const m = { alto: { bg: "#fee2e2", color: "#991b1b", label: "Alto" }, medio: { bg: "#fef3c7", color: "#92400e", label: "Medio" }, bajo: { bg: "#d1fae5", color: "#065f46", label: "Bajo" } };
    const s = m[nivel] || m.medio;
    return <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>{s.label}</span>;
  };

  const renderDataBadges = (prop) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {(prop._aiExtracted || []).map(f => <CPill key={f} label={f} type="extracted" />)}
      {(prop._aiEstimated || []).map(f => <CPill key={f} label={f} type="estimated" />)}
      {(prop._aiMissing   || []).map(f => <CPill key={f} label={f} type="missing" />)}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      <div style={{ background: "#0f172a", padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "transparent", color: "#94a3b8", border: "none", cursor: "pointer", fontSize: 14 }}>← Volver</button>
        <div style={{ fontSize: 13, color: "#10b981", letterSpacing: "0.5px" }}>ANÁLISIS DE PROPIEDAD</div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px" }}>

        {/* ─── INPUT ─── */}
        {phase === "input" && (
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #e5e7eb", padding: "44px 40px" }}>
            <div style={{ fontSize: 13, color: "#10b981", marginBottom: 14, letterSpacing: "0.5px" }}>ANÁLISIS INTELIGENTE CON IA</div>
            <h2 style={{ fontSize: 30, fontWeight: 700, marginBottom: 12, fontFamily: "Georgia, serif", color: "#0f172a", lineHeight: 1.2 }}>
              Pegá el link.<br />Nosotros hacemos el análisis.
            </h2>
            <p style={{ color: "#6b7280", fontSize: 16, lineHeight: 1.7, marginBottom: 32, maxWidth: 540 }}>
              Cualquier link de Zillow, Redfin, Realtor.com, LoopNet u otro portal. La IA lee el listado real, extrae todos los datos, corre el modelo financiero y entrega un reporte completo en español. Sin formularios.
            </p>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <input value={url} onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && url.trim() && handleAnalyze()}
                placeholder="https://www.zillow.com/homedetails/..."
                style={{ flex: 1, background: "#f9fafb", border: "1.5px solid #d1d5db", borderRadius: 12, padding: "15px 18px", fontSize: 15, color: "#111827", fontFamily: "sans-serif" }} />
              <button onClick={handleAnalyze} disabled={!url.trim()}
                style={{ background: url.trim() ? "linear-gradient(135deg, #10b981, #059669)" : "#e5e7eb", color: url.trim() ? "white" : "#9ca3af", border: "none", borderRadius: 12, padding: "15px 28px", fontSize: 15, fontWeight: 700, cursor: url.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap" }}>
                Analizar →
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Zillow","Redfin","Realtor.com","LoopNet","Crexi","Cualquier URL"].map(s => (
                <span key={s} style={{ background: "#f3f4f6", color: "#6b7280", fontSize: 12, padding: "4px 10px", borderRadius: 99 }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* ─── LOADING ─── */}
        {phase === "loading" && (
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #e5e7eb", padding: "48px 40px" }}>
            <div style={{ fontSize: 13, color: "#10b981", marginBottom: 14 }}>PROCESANDO</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif", color: "#0f172a" }}>Analizando tu propiedad…</h2>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, wordBreak: "break-all" }}>🔗 {url}</div>
            <LoadStep steps={["Leyendo el listado real", "Extrayendo datos con IA", "Calculando financieros", "Generando reporte de inversión"]} current={loadStep} />
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 8 }}>Esto toma entre 20 y 40 segundos</div>
          </div>
        )}

        {/* ─── ERROR ─── */}
        {phase === "error" && (
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #fee2e2", padding: "40px 36px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#991b1b", marginBottom: 12 }}>No se pudo analizar el link</h3>
            <p style={{ color: "#6b7280", marginBottom: 24 }}>{errorMsg}</p>
            <button onClick={() => setPhase("input")} style={{ background: "#0f172a", color: "white", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              Intentar con otro link
            </button>
          </div>
        )}

        {/* ─── RESULTADO ─── */}
        {phase === "result" && property && (() => {
          const adv = aiReport || {};
          const fin = analyzeFinancials(property, profile, scenario);
          const finC = analyzeFinancials(property, profile, "conservative");
          const finA = analyzeFinancials(property, profile, "aggressive");
          const zoning = analyzeZoning(property);
          const proj = adv.proyeccionPatrimonio || [];

          return (
            <div>
              {/* URL + acciones */}
              <div style={{ background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontSize: 12, color: "#6b7280", wordBreak: "break-all", flex: 1 }}>🔗 {url}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={startEdit} style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Editar datos</button>
                  <button onClick={() => setPhase("input")} style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Nuevo link</button>
                </div>
              </div>

              {/* Confianza de datos */}
              <div style={{ background: "white", borderRadius: 14, border: "1px solid #e5e7eb", padding: "14px 20px", marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 8 }}>CONFIANZA DE DATOS</div>
                {renderDataBadges(property)}
                {property._extractionNotes && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8, fontStyle: "italic" }}>{property._extractionNotes}</div>}
              </div>

              {/* Editor inline */}
              {editMode && (
                <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, padding: "20px 24px", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 14 }}>Editar valores extraídos</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                    {[["price","Precio ($)"],["beds","Habitaciones"],["baths","Baños"],["sqft","Sup. (sqft)"],["hoa","HOA/mes ($)"],["lotSize","Terreno (sqft)"],["yearBuilt","Año construcción"],["zoningCode","Zonificación"],["estimatedRent","Renta mensual ($)"]].map(([k, lbl]) => (
                      <div key={k}>
                        <label style={{ fontSize: 11, color: "#6b7280", display: "block", marginBottom: 3 }}>{lbl}</label>
                        <input value={editFields[k] || ""} onChange={e => setEditFields(p => ({ ...p, [k]: e.target.value }))}
                          style={{ width: "100%", background: "white", border: "1px solid #fde68a", borderRadius: 6, padding: "8px 10px", fontSize: 13, boxSizing: "border-box", fontFamily: "sans-serif" }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={applyEdits} style={{ background: "#10b981", color: "white", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Aplicar cambios</button>
                    <button onClick={() => setEditMode(false)} style={{ background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* ── HERO + VEREDICTO ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 16, marginBottom: 16, alignItems: "stretch" }}>
                <div style={{ background: "linear-gradient(135deg, #1a4a6bdd, #1a4a6b55)", borderRadius: 18, padding: "24px 28px", color: "white" }}>
                  <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>{property.propertyType} · {property.zoningCode}</div>
                  <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, fontFamily: "Georgia, serif" }}>{property.address}</h2>
                  <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 20 }}>{property.neighborhood}{property.zipCode ? ` · ${property.zipCode}` : ""}</div>
                  <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                    {[
                      { v: `$${property.price.toLocaleString()}`, l: "Precio" },
                      property.beds > 0 && { v: `${property.beds}/${property.baths}`, l: "Hab/Baños" },
                      property.livingArea > 0 && { v: `${property.livingArea.toLocaleString()} sf`, l: "Superficie" },
                      property.yearBuilt > 0 && { v: property.yearBuilt, l: "Año" },
                      property.hoa > 0 && { v: `$${property.hoa}/mes`, l: "HOA" },
                    ].filter(Boolean).map(item => (
                      <div key={item.l}>
                        <div style={{ fontSize: 18, fontWeight: 800 }}>{item.v}</div>
                        <div style={{ fontSize: 10, opacity: 0.6 }}>{item.l}</div>
                      </div>
                    ))}
                  </div>
                  {adv.resumen && <div style={{ fontSize: 13, opacity: 0.85, marginTop: 16, lineHeight: 1.6, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14 }}>{adv.resumen}</div>}
                </div>

                {/* Score + Veredicto */}
                <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 18, padding: "20px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minWidth: 180, gap: 12 }}>
                  <DonutChart value={adv.scoreInversion || 0} size={110} color={adv.veredictoColor || "#10b981"} label="Score de inversión" sub="/100" />
                  {adv.veredicto && (
                    <div style={{ background: adv.veredictoColor || "#10b981", color: "white", fontSize: 13, fontWeight: 800, padding: "8px 16px", borderRadius: 10, textAlign: "center", letterSpacing: "0.5px" }}>
                      {adv.veredicto}
                    </div>
                  )}
                  {adv.mejorUso && (
                    <div style={{ fontSize: 12, color: "#6b7280", textAlign: "center", lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 600, color: "#374151" }}>Mejor uso:</span><br />{adv.mejorUso}
                    </div>
                  )}
                </div>
              </div>

              {/* ── PROS / CONTRAS ── */}
              {(adv.puntosPositivos || adv.puntosNegativos) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.4px" }}>✓ Puntos positivos</div>
                    {(adv.puntosPositivos || []).map((p, i) => (
                      <div key={i} style={{ fontSize: 13, color: "#166534", marginBottom: 8, display: "flex", gap: 8 }}>
                        <span style={{ flexShrink: 0 }}>▸</span><span>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#9a3412", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.4px" }}>⚠ Riesgos</div>
                    {(adv.riesgos || []).map((r, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#9a3412" }}>{r.titulo}</div>
                          <RiskBadge nivel={r.nivel} />
                        </div>
                        <div style={{ fontSize: 12, color: "#78350f", lineHeight: 1.5 }}>{r.descripcion}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── ANÁLISIS FINANCIERO — EDITABLE ── */}
              <FinancialEditor property={property} profile={profile} advRentaRango={adv.rentaRangoMin ? adv : null} />

              {/* ── PROYECCIÓN DE PATRIMONIO ── */}
              {proj.length > 0 && (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "22px 24px", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Proyección de Patrimonio</h3>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
                    {proj.map(p => {
                      const maxP = Math.max(...proj.map(x => x.patrimonio), 1);
                      const pct = p.patrimonio / maxP;
                      return (
                        <div key={p.anio} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#16a34a" }}>${Math.round(p.patrimonio / 1000)}K</div>
                          <div style={{ width: "100%", height: Math.max(pct * 140, 8), background: "linear-gradient(to top, #10b981, #34d399)", borderRadius: "4px 4px 0 0" }} />
                          <div style={{ fontSize: 11, color: "#6b7280" }}>Año {p.anio}</div>
                          <div style={{ fontSize: 10, color: "#9ca3af" }}>Val: ${Math.round((p.valorPropiedad || 0) / 1000)}K</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 12, fontStyle: "italic" }}>
                    * Asume apreciación anual de {adv.apreciacionAnual || 4.5}% (promedio histórico Miami). Patrimonio = valor propiedad − saldo hipoteca.
                  </div>
                </div>
              )}

              {/* ── COMPARATIVA DE MERCADO ── */}
              {adv.comparativaMercado && (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "22px 24px", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Comparativa con el Mercado</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {[
                      { label: "Precio", listing: adv.comparativaMercado.precioListado, market: adv.comparativaMercado.precioMercado, fmt: v => `$${(v||0).toLocaleString()}`, lowerIsBetter: true },
                      { label: "Renta est.", listing: adv.comparativaMercado.rentaEstimada, market: adv.comparativaMercado.rentaMercado, fmt: v => `$${(v||0).toLocaleString()}/mo`, lowerIsBetter: false },
                      { label: "Cap Rate", listing: adv.comparativaMercado.capRatePropiedad, market: adv.comparativaMercado.capRateMercado, fmt: v => `${(v||0).toFixed(1)}%`, lowerIsBetter: false },
                    ].map(c => {
                      const isGood = c.lowerIsBetter ? (c.listing <= c.market) : (c.listing >= c.market);
                      return (
                        <div key={c.label} style={{ background: "#f9fafb", borderRadius: 10, padding: "14px" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 10, textTransform: "uppercase" }}>{c.label}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <div><div style={{ fontSize: 10, color: "#9ca3af" }}>Esta prop.</div><div style={{ fontSize: 16, fontWeight: 700, color: isGood ? "#16a34a" : "#dc2626" }}>{c.fmt(c.listing)}</div></div>
                            <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: "#9ca3af" }}>Mercado</div><div style={{ fontSize: 16, fontWeight: 700, color: "#374151" }}>{c.fmt(c.market)}</div></div>
                          </div>
                          <div style={{ fontSize: 11, color: isGood ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                            {isGood ? "✓ Favorable" : "▲ Desfavorable"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── ZONIFICACIÓN ── */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "22px 24px", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Zonificación y Potencial de Desarrollo</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 14 }}>
                  {[
                    { l: "Código", v: zoning.zoningCode },
                    { l: "Unidades máx", v: zoning.maxUnitsEstimated, hi: zoning.maxUnitsEstimated > 1 },
                    { l: "ADU", v: zoning.aduPotential ? "Posible" : "Improbable", hi: zoning.aduPotential },
                    { l: "Duplex", v: zoning.duplexPotential ? "Posible" : "Improbable", hi: zoning.duplexPotential },
                    { l: "Multifam.", v: zoning.multifamilyPotential ? "Posible" : "Improbable", hi: zoning.multifamilyPotential },
                  ].map(k => (
                    <div key={k.l} style={{ background: k.hi ? "#f0fdf4" : "#f9fafb", border: k.hi ? "1px solid #bbf7d0" : "1px solid #e5e7eb", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3, textTransform: "uppercase" }}>{k.l}</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: k.hi ? "#15803d" : "#111827" }}>{k.v}</div>
                    </div>
                  ))}
                </div>
                {adv.zonificacionNota && <div style={{ fontSize: 13, color: "#4b5563", background: "#f8fafc", borderRadius: 10, padding: "12px 14px", lineHeight: 1.7 }}>{adv.zonificacionNota}</div>}
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Verificar con City of Miami, Miami-Dade Property Search y Gridics Zoning Map.</div>
              </div>

              {/* ── PRECIO SUGERIDO + PRÓXIMOS PASOS ── */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                {adv.precioOferta > 0 && (
                  <div style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe", borderRadius: 16, padding: "20px 22px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", marginBottom: 8, textTransform: "uppercase" }}>Precio de oferta sugerido</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#1d4ed8", marginBottom: 8 }}>${(adv.precioOferta || 0).toLocaleString()}</div>
                    {adv.precioOfertaRazon && <div style={{ fontSize: 13, color: "#2563eb", lineHeight: 1.6 }}>{adv.precioOfertaRazon}</div>}
                  </div>
                )}
                {adv.proximosPasos && (
                  <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 16, padding: "20px 22px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 12, textTransform: "uppercase" }}>Próximos pasos</div>
                    {adv.proximosPasos.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#0f172a", color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</div>
                        <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>{p}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── SIMULADOR DE CASH FLOW ── */}
              <SimuladorCashFlow property={property} profile={profile} zoningInfo={zoning} />

              {/* ── CTA ── */}
              <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 20, padding: "32px 28px", textAlign: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: "#10b981", marginBottom: 10 }}>¿QUERÉS AVANZAR?</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 10, fontFamily: "Georgia, serif" }}>Hablá con un asesor de Miami</h3>
                <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>Nuestro equipo puede verificar zonificación, correr comps reales, estructurar el financiamiento y negociar en tu nombre.</p>
                <button onClick={onLead} style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Conectar con un asesor →
                </button>
              </div>

              {/* Disclaimer */}
              <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "12px 16px", fontSize: 11, color: "#78350f", lineHeight: 1.7 }}>
                <strong>Aviso:</strong> Los datos fueron extraídos por IA del listado público disponible y pueden ser incompletos. Las proyecciones financieras son estimaciones con supuestos estándar del mercado de Miami-Dade. Este análisis no constituye asesoramiento financiero, legal ni inmobiliario. Siempre verificá los datos con el agente y consultá un profesional licenciado antes de hacer una oferta.
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
// ============================================================
// PRE-APPROVAL SIMULATOR — Lender Intelligence Engine
// ============================================================
// ── Pre-Approval sub-components (top-level to avoid Rules of Hooks) ──
const PASlider = ({ label, value, min, max, step: st = 100, onChange, fmt = v => `$${v.toLocaleString()}`, color = "#f59e0b", sub }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
      <span style={{ fontSize: 12, color: "#6b7280" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 800, color }}>{fmt(value)}</span>
    </div>
    {sub && <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 3 }}>{sub}</div>}
    <input type="range" min={min} max={max} step={st} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ width: "100%", accentColor: color, height: 4 }} />
  </div>
);

const QualGauge = ({ score }) => {
  const r = 54, circ = Math.PI * r;
  const pct = score / 100;
  const dash = circ * pct;
  const color = score >= 80 ? "#16a34a" : score >= 65 ? "#f59e0b" : score >= 45 ? "#3b82f6" : "#ef4444";
  return (
    <svg width="160" height="90" viewBox="0 0 160 90">
      <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#f3f4f6" strokeWidth="14" strokeLinecap="round" />
      <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} style={{ transition: "stroke-dasharray 0.8s ease" }} />
      <text x="80" y="72" textAnchor="middle" fontSize="28" fontWeight="900" fill={color}>{score}</text>
      <text x="80" y="84" textAnchor="middle" fontSize="9" fill="#9ca3af">/100 capacidad</text>
    </svg>
  );
};

const DTIBar = ({ label, value, limit, color }) => {
  const pct = Math.min((value / 60) * 100, 100);
  const limPct = Math.min((limit / 60) * 100, 100);
  const overLimit = parseFloat(value) > limit;
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
        <span style={{ color: "#6b7280" }}>{label}</span>
        <span style={{ fontWeight: 700, color: overLimit ? "#dc2626" : "#16a34a" }}>{value}% {overLimit ? "⚠ alto" : "✓ ok"}</span>
      </div>
      <div style={{ position: "relative", background: "#f3f4f6", borderRadius: 99, height: 10 }}>
        <div style={{ width: `${pct}%`, height: 10, background: overLimit ? "#ef4444" : color, borderRadius: 99, transition: "width 0.5s" }} />
        <div style={{ position: "absolute", left: `${limPct}%`, top: -2, bottom: -2, width: 2, background: "#374151", borderRadius: 99 }} />
        <span style={{ position: "absolute", left: `${limPct}%`, top: -18, fontSize: 9, color: "#374151", transform: "translateX(-50%)" }}>límite {limit}%</span>
      </div>
    </div>
  );
};

const ScenCard = ({ title, price, loan, mpi, taxes, pmi, rate, yrs, highlight }) => (
  <div style={{ background: highlight ? "linear-gradient(135deg, #0f172a, #1e293b)" : "#f9fafb", border: `2px solid ${highlight ? "#f59e0b" : "#e5e7eb"}`, borderRadius: 14, padding: "16px 18px" }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: highlight ? "#fbbf24" : "#6b7280", marginBottom: 8, textTransform: "uppercase" }}>{title}</div>
    <div style={{ fontSize: 22, fontWeight: 900, color: highlight ? "#f8fafc" : "#111827", marginBottom: 2 }}>${Math.round(price / 1000)}K</div>
    <div style={{ fontSize: 11, color: highlight ? "#94a3b8" : "#9ca3af", marginBottom: 10 }}>precio máximo estimado</div>
    {[
      ["Préstamo", `$${Math.round(loan / 1000)}K`],
      ["Hipoteca P&I", `$${mpi.toLocaleString()}/mes`],
      ["Impuestos+Seg.", `$${taxes.toLocaleString()}/mes`],
      pmi > 0 ? ["PMI", `$${pmi}/mes`] : null,
      ["Tasa", `${rate}% · ${yrs}a`],
    ].filter(Boolean).map(([l, v]) => (
      <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: highlight ? "#94a3b8" : "#6b7280" }}>{l}</span>
        <span style={{ fontWeight: 700, color: highlight ? "#f8fafc" : "#111827" }}>{v}</span>
      </div>
    ))}
  </div>
);

const PreApprovalPage = ({ onBack, onViewProperties }) => {
  const [step, setStep] = useState("income"); // income | expenses | result
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // ── Ingresos ──
  const [tipoEmpleo, setTipoEmpleo] = useState("empleado"); // empleado | independiente | mixto | jubilado | inversor
  const [ingresoBase, setIngresoBase] = useState(8000);
  const [ingresoExtra, setIngresoExtra] = useState(0);
  const [ingresoRenta, setIngresoRenta] = useState(0);
  const [ingresosDesc, setIngresosDesc] = useState("");
  const [anosEmpleo, setAnosEmpleo] = useState(3);
  const [creditScore, setCreditScore] = useState(720);
  const [downPayment, setDownPayment] = useState(60000);
  const [downSource, setDownSource] = useState("ahorros"); // ahorros | regalo | venta | retiro | mixto

  // ── Deudas y gastos ──
  const [deudaAuto, setDeudaAuto] = useState(0);
  const [deudaEstudiantil, setDeudaEstudiantil] = useState(0);
  const [tarjetas, setTarjetas] = useState(0);
  const [otrasDeudas, setOtrasDeudas] = useState(0);
  const [gastosMensuales, setGastosMensuales] = useState(2500);

  // ── Parámetros del mercado ──
  const [tasaBase, setTasaBase] = useState(7.25);
  const [plazo, setPlazo] = useState(30);

  // ─── CÁLCULOS CENTRALIZADOS ───
  const ingresoTotal = ingresoBase + ingresoExtra + ingresoRenta;
  const dti_deudas  = deudaAuto + deudaEstudiantil + tarjetas + otrasDeudas;

  // DTI back-end máximos reales (Fannie/Freddie 2024-2025)
  // Convencional: hasta 45% back-end con score ≥ 720, 43% con ≥ 680, 41% resto
  // FHA: hasta 47% con score ≥ 680, 43% resto
  const maxBackEnd_CONV = Math.round(ingresoTotal * (creditScore >= 720 ? 0.45 : creditScore >= 680 ? 0.43 : 0.41));
  const maxBackEnd_FHA  = Math.round(ingresoTotal * (creditScore >= 680 ? 0.47 : 0.43));

  // PITI máximo = maxBackEnd - deudas existentes
  const maxPITI_CONV = Math.max(maxBackEnd_CONV - dti_deudas, 0);
  const maxPITI_FHA  = Math.max(maxBackEnd_FHA  - dti_deudas, 0);

  // Tasas anuales Miami-Dade
  const TAX_INS_RATE = 0.016; // 1.1% impuestos + 0.5% seguro
  const PMI_RATE     = 0.0085; // PMI si down < 20%

  // Factor hipotecario mensual por $1 de préstamo
  const factorHip = (rate, years) => {
    if (!rate || !years) return 0;
    const r = rate / 100 / 12, n = years * 12;
    return (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  // Solución analítica directa — sin doble resta
  // Resuelve: PITI = mpi(loan) + taxes(price) + pmi(loan) = maxPITI
  // donde price = loan + down, taxes = price * TAX_INS_RATE/12, pmi = loan * PMI_RATE/12
  // Ramas: con PMI (down < 20%) y sin PMI (down >= 20%)
  const solveScenario = (maxPITI, down, rate, years) => {
    if (maxPITI <= 0 || ingresoTotal <= 0) return { price: 0, loan: 0, mpi: 0, taxes: 0, pmi: 0 };
    const f   = factorHip(rate, years);
    const tin = TAX_INS_RATE / 12;
    const pm  = PMI_RATE / 12;

    // Intentar sin PMI primero: P = (maxPITI + down*f) / (f + tin)
    let price = (maxPITI + down * f) / (f + tin);
    let withPMI = false;
    if (price <= 0 || down / price < 0.20) {
      // Con PMI: P = (maxPITI + down*(f+pm)) / (f + pm + tin)
      price = (maxPITI + down * (f + pm)) / (f + pm + tin);
      withPMI = true;
    }
    price = Math.max(Math.round(price), 0);
    const loan  = Math.max(price - down, 0);
    const mpi   = Math.round(calcMPI(loan, rate, years));
    const taxes = Math.round(price * TAX_INS_RATE / 12);
    const pmi   = withPMI ? Math.round(loan * PMI_RATE / 12) : 0;
    return { price, loan, mpi, taxes, pmi };
  };

  const scConv = solveScenario(maxPITI_CONV, downPayment, tasaBase, plazo);
  const scFHA  = solveScenario(maxPITI_FHA,  downPayment, Math.max(tasaBase - 0.25, 3), plazo);
  const sc15yr = solveScenario(maxPITI_CONV, downPayment, Math.max(tasaBase - 0.625, 3), 15);

  // DTI actuales con el precio calculado
  const totalPITI_conv = scConv.mpi + scConv.taxes + scConv.pmi;
  const dtiFront = ingresoTotal > 0 ? ((totalPITI_conv / ingresoTotal) * 100).toFixed(1) : "0.0";
  const dtiBack  = ingresoTotal > 0 ? (((totalPITI_conv + dti_deudas) / ingresoTotal) * 100).toFixed(1) : "0.0";

  // Score de calificación 0-100 (basado en parámetros reales de underwriting)
  const calcQualScore = () => {
    let score = 0;
    // Credit score (30 pts)
    if (creditScore >= 760) score += 30;
    else if (creditScore >= 720) score += 25;
    else if (creditScore >= 680) score += 18;
    else if (creditScore >= 640) score += 10;
    else if (creditScore >= 620) score += 5;
    else score += 0;
    // Historial laboral (20 pts)
    if (anosEmpleo >= 2) score += 20;
    else if (anosEmpleo >= 1) score += 12;
    else score += 4;
    // DTI back-end (25 pts)
    const dtib = parseFloat(dtiBack);
    if (dtib <= 36)      score += 25;
    else if (dtib <= 43) score += 20;
    else if (dtib <= 47) score += 13;
    else if (dtib <= 50) score += 6;
    else                 score += 0;
    // Down payment (15 pts)
    const downPct = scConv.price > 0 ? downPayment / scConv.price : 0;
    if (downPct >= 0.20)     score += 15;
    else if (downPct >= 0.10) score += 10;
    else if (downPct >= 0.035) score += 5;
    else                       score += 0;
    // Capacidad de ingreso (10 pts)
    if (ingresoTotal >= 12000)     score += 10;
    else if (ingresoTotal >= 8000)  score += 8;
    else if (ingresoTotal >= 5000)  score += 5;
    else if (ingresoTotal >= 3000)  score += 2;
    return Math.min(score, 100);
  };

  const qualScore = calcQualScore();
  const qualLevel = qualScore >= 80
    ? { label: "Excelente candidato", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" }
    : qualScore >= 65
    ? { label: "Buen candidato", color: "#d97706", bg: "#fffbeb", border: "#fde68a" }
    : qualScore >= 45
    ? { label: "Candidato potencial", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" }
    : { label: "Necesita mejorar perfil", color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" };

  // ── AI Lender Analysis ──
  const runAIAnalysis = async () => {
    setAiLoading(true);
    setAiAnalysis(null);
    try {
      const prompt = `Eres un lender experto en Miami, Florida. Analiza este perfil financiero y da un veredicto honesto de pre-aprobación.

PERFIL:
- Tipo de empleo: ${tipoEmpleo}${ingresosDesc ? ` (${ingresosDesc})` : ""}
- Años de empleo: ${anosEmpleo}
- Ingreso base mensual: $${ingresoBase.toLocaleString()}
- Ingreso extra/freelance: $${ingresoExtra.toLocaleString()}
- Ingreso por rentas: $${ingresoRenta.toLocaleString()}
- Ingreso total bruto mensual: $${ingresoTotal.toLocaleString()} ($${(ingresoTotal*12).toLocaleString()}/año)
- Credit score: ${creditScore}
- Down payment disponible: $${downPayment.toLocaleString()} (fuente: ${downSource})
- Cuota de auto: $${deudaAuto}/mes
- Préstamo estudiantil: $${deudaEstudiantil}/mes
- Tarjetas de crédito min.: $${tarjetas}/mes
- Otras deudas: $${otrasDeudas}/mes
- Gastos de vida estimados: $${gastosMensuales}/mes

ANÁLISIS CALCULADO:
- Precio máximo (conv. 30a): $${scConv.price.toLocaleString()}
- Préstamo máximo: $${scConv.loan.toLocaleString()}
- Pago hipotecario estimado: $${scConv.mpi.toLocaleString()}/mes
- DTI front-end: ${dtiFront}% (límite sano: 28%)
- DTI back-end: ${dtiBack}% (límite: 43% conv, 50% FHA)
- PMI requerido: ${scConv.pmi > 0 ? "Sí, $"+scConv.pmi+"/mes" : "No (≥20% down)"}
- Score de calificación interno: ${qualScore}/100

Responde en español en este JSON exacto (sin markdown, sin backticks):
{
  "veredicto": "APROBADO|APROBADO CON CONDICIONES|EN PROCESO|NECESITA TRABAJO",
  "veredictoColor": "#16a34a|#d97706|#2563eb|#dc2626",
  "resumenEjecutivo": "2 oraciones directas sobre el perfil",
  "fortalezas": ["fortaleza 1", "fortaleza 2", "fortaleza 3"],
  "debilidades": ["debilidad 1", "debilidad 2"],
  "pasosSiguientes": ["paso 1", "paso 2", "paso 3"],
  "tipoPrestamoRecomendado": "Convencional 30a|FHA|VA|USDA|Convencional 15a",
  "razonTipoPrestamo": "explicación breve",
  "tasaEstimada": ${tasaBase},
  "advertencias": ["advertencia si la hay"],
  "mensajeMotivacional": "1 oración alentadora y honesta"
}`;

      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const d = await res.json();
      const txt = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
      const m = txt.match(/\{[\s\S]*\}/);
      if (m) setAiAnalysis(JSON.parse(m[0]));
    } catch(e) { setAiAnalysis({ error: true }); }
    setAiLoading(false);
    setStep("result");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #78350f, #92400e, #b45309)", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", fontSize: 14 }}>← Volver</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#fde68a", letterSpacing: "0.5px" }}>SIMULADOR DE PRE-APROBACIÓN</div>
          <div style={{ fontSize: 14, color: "white", fontWeight: 700, fontFamily: "Georgia, serif" }}>¿Cuánto puedo pedir prestado?</div>
        </div>
        <div style={{ width: 80 }} />
      </div>

      {/* Tabs de paso */}
      <div style={{ display: "flex", background: "white", borderBottom: "1px solid #e5e7eb" }}>
        {[["income","1. Ingresos"],["expenses","2. Deudas y gastos"],["result","3. Resultado"]].map(([k,l]) => (
          <div key={k} onClick={() => step !== "income" || k === "income" ? setStep(k) : null}
            style={{ flex: 1, padding: "14px", textAlign: "center", fontSize: 13, fontWeight: step===k ? 700 : 400,
              color: step===k ? "#92400e" : k==="result" && step!=="result" ? "#d1d5db" : "#6b7280",
              borderBottom: step===k ? "3px solid #f59e0b" : "3px solid transparent", cursor: "pointer" }}>
            {l}
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 20px" }}>

        {/* ─── PASO 1: INGRESOS ─── */}
        {step === "income" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 22px", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 14 }}>💼 Tipo de empleo</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 14 }}>
                  {[["empleado","🏢 Empleado W-2"],["independiente","💻 Independiente/1099"],["mixto","🔀 Mixto"],["jubilado","🌴 Jubilado"],["inversor","📈 Inversor"]].map(([v,l]) => (
                    <button key={v} onClick={() => setTipoEmpleo(v)}
                      style={{ background: tipoEmpleo===v ? "#fef3c7" : "#f9fafb", border: `1.5px solid ${tipoEmpleo===v ? "#f59e0b" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 10px", fontSize: 12, fontWeight: tipoEmpleo===v ? 700 : 400, color: tipoEmpleo===v ? "#92400e" : "#6b7280", cursor: "pointer", textAlign: "left" }}>
                      {l}
                    </button>
                  ))}
                </div>
                {(tipoEmpleo === "independiente" || tipoEmpleo === "mixto") && (
                  <div style={{ background: "#fffbeb", borderRadius: 10, padding: "10px 12px", marginBottom: 10, fontSize: 12, color: "#92400e" }}>
                    ⚠ Para trabajadores independientes los lenders generalmente requieren 2 años de tax returns (Schedule C). Tu ingreso calificante será el promedio de ambos años.
                    <div style={{ marginTop: 6 }}><input placeholder="Describe tu actividad independiente..." value={ingresosDesc} onChange={e=>setIngresosDesc(e.target.value)}
                      style={{ width: "100%", border: "1px solid #fde68a", borderRadius: 8, padding: "7px 10px", fontSize: 12, boxSizing: "border-box" }} /></div>
                  </div>
                )}
                <PASlider label="Ingreso base mensual bruto" value={ingresoBase} min={1000} max={50000} step={200} onChange={setIngresoBase} color="#f59e0b" />
                <PASlider label="Ingresos extra / freelance / bonus" value={ingresoExtra} min={0} max={20000} step={200} onChange={setIngresoExtra} color="#f59e0b" />
                <PASlider label="Ingresos por rentas existentes" value={ingresoRenta} min={0} max={20000} step={200} onChange={setIngresoRenta} color="#f59e0b" />
                <div style={{ background: "#fef3c7", borderRadius: 10, padding: "10px 12px", marginTop: 4 }}>
                  <div style={{ fontSize: 10, color: "#92400e" }}>Ingreso total calificante</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#78350f" }}>${ingresoTotal.toLocaleString()}/mes <span style={{ fontSize: 12, fontWeight: 400 }}>· ${(ingresoTotal*12).toLocaleString()}/año</span></div>
                </div>
              </div>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 14 }}>🏦 Historial crediticio</div>
                <PASlider label="Credit Score" value={creditScore} min={500} max={850} step={10} onChange={setCreditScore} fmt={v=>v.toString()} color={creditScore>=720?"#16a34a":creditScore>=680?"#f59e0b":"#ef4444"} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5, marginBottom: 4 }}>
                  {[[500,"Pobre"],[620,"Regular"],[680,"Bueno"],[720,"Muy bueno"],[760,"Excelente"]].map(([s,l])=>(
                    <button key={s} onClick={()=>setCreditScore(s)}
                      style={{ background: creditScore>=s && creditScore<(s+80) ? "#fef3c7":"#f9fafb", border: `1px solid ${creditScore>=s&&creditScore<(s+80)?"#f59e0b":"#e5e7eb"}`, borderRadius:8, padding:"5px 3px", fontSize:9, fontWeight:600, cursor:"pointer", color:"#6b7280" }}>
                      {s}<br /><span style={{fontSize:8}}>{l}</span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: 12 }}>
                  <PASlider label="Años en empleo actual" value={anosEmpleo} min={0} max={20} step={1} onChange={setAnosEmpleo} fmt={v=>`${v} ${v===1?"año":"años"}`} color="#f59e0b" />
                </div>
              </div>
            </div>

            <div>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 22px", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 14 }}>💰 Enganche disponible</div>
                <PASlider label="Down payment disponible" value={downPayment} min={0} max={500000} step={2500} onChange={setDownPayment} color="#f59e0b" />
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase" }}>Fuente del enganche</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                  {[["ahorros","💰 Ahorros"],["regalo","🎁 Regalo familiar"],["venta","🏠 Venta propiedad"],["retiro","📊 Retiro/401k"],["mixto","🔀 Mixto"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setDownSource(v)}
                      style={{ background: downSource===v?"#fef3c7":"#f9fafb", border:`1px solid ${downSource===v?"#f59e0b":"#e5e7eb"}`, borderRadius:8, padding:"6px 10px", fontSize:11, fontWeight:downSource===v?700:400, cursor:"pointer", color:downSource===v?"#92400e":"#6b7280" }}>
                      {l}
                    </button>
                  ))}
                </div>
                {downSource === "retiro" && <div style={{ fontSize: 11, color: "#92400e", background: "#fffbeb", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>⚠ Retiros de 401k pueden incurrir penalidades. Consultá con tu asesor financiero antes de usar fondos de retiro.</div>}
                {downSource === "regalo" && <div style={{ fontSize: 11, color: "#0369a1", background: "#eff6ff", borderRadius: 8, padding: "8px 10px", marginBottom: 8 }}>ℹ Los lenders requieren una "gift letter" de quien dona. FHA acepta 100% de regalo; convencional puede requerir una porción propia.</div>}
              </div>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 14 }}>🎛️ Parámetros del préstamo</div>
                <PASlider label="Tasa de interés estimada (%)" value={tasaBase} min={4} max={12} step={0.125} onChange={setTasaBase} fmt={v=>`${v}%`} color="#f59e0b" />
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  {[[30,"30 años"],[20,"20 años"],[15,"15 años"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setPlazo(v)}
                      style={{ flex:1, background:plazo===v?"#fef3c7":"#f9fafb", border:`1px solid ${plazo===v?"#f59e0b":"#e5e7eb"}`, borderRadius:8, padding:"8px 4px", fontSize:12, fontWeight:plazo===v?700:400, cursor:"pointer", color:plazo===v?"#92400e":"#6b7280" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep("expenses")}
                style={{ width: "100%", marginTop: 14, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 12, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Continuar → Deudas y gastos
              </button>
            </div>
          </div>
        )}

        {/* ─── PASO 2: DEUDAS ─── */}
        {step === "expenses" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 22px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 14 }}>💳 Deudas mensuales existentes</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 14, lineHeight: 1.5 }}>
                Incluyé solo los pagos mínimos mensuales. Estas deudas se computan en tu Debt-to-Income (DTI) ratio.
              </div>
              <PASlider label="Cuota de auto" value={deudaAuto} min={0} max={2000} step={25} onChange={setDeudaAuto} color="#ef4444" />
              <PASlider label="Préstamo estudiantil" value={deudaEstudiantil} min={0} max={2000} step={25} onChange={setDeudaEstudiantil} color="#ef4444" />
              <PASlider label="Tarjetas de crédito (mínimo)" value={tarjetas} min={0} max={2000} step={25} onChange={setTarjetas} color="#ef4444" />
              <PASlider label="Otras deudas" value={otrasDeudas} min={0} max={3000} step={25} onChange={setOtrasDeudas} color="#ef4444" />
              <div style={{ background: "#fef2f2", borderRadius: 10, padding: "10px 12px", marginTop: 4 }}>
                <div style={{ fontSize: 10, color: "#dc2626" }}>Total deudas mensuales</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#991b1b" }}>${dti_deudas.toLocaleString()}/mes</div>
              </div>
              <div style={{ marginTop: 14 }}>
                <PASlider label="Gastos de vida estimados (no cuentan en DTI)" value={gastosMensuales} min={500} max={15000} step={100} onChange={setGastosMensuales} color="#6b7280" />
                <div style={{ fontSize: 11, color: "#6b7280" }}>Comida, servicios, suscripciones, etc. No afecta la calificación del lender, pero sí tu flujo personal.</div>
              </div>
            </div>

            <div>
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 22px", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400e", marginBottom: 14 }}>📊 DTI en tiempo real</div>
                <div style={{ marginTop: 24 }}>
                  <DTIBar label="DTI Front-end (solo hipoteca / ingreso)" value={parseFloat(dtiFront)} limit={36} color="#f59e0b" />
                  <DTIBar label="DTI Back-end (hipoteca + deudas / ingreso)" value={parseFloat(dtiBack)} limit={45} color="#ef4444" />
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 10, lineHeight: 1.5 }}>
                  <strong>Front-end:</strong> Solo el pago PITI de la nueva hipoteca vs. ingreso. Límite típico: 36%.<br />
                  <strong>Back-end:</strong> PITI + todas las deudas vs. ingreso. Convencional acepta hasta 45–50% con buen score; FHA hasta 47–50%.
                </div>
              </div>

              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 22px", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Flujo mensual estimado después de compra</div>
                {[
                  ["Ingreso total", ingresoTotal, "#16a34a"],
                  ["Hipoteca (PITI)", -(scConv.mpi + scConv.taxes + scConv.pmi), "#ef4444"],
                  ["Deudas existentes", -dti_deudas, "#ef4444"],
                  ["Gastos de vida", -gastosMensuales, "#6b7280"],
                ].map(([l,v,c]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "6px 0", borderBottom: "1px solid #f9fafb" }}>
                    <span style={{ color: "#6b7280" }}>{l}</span>
                    <span style={{ fontWeight: 700, color: c }}>{v >= 0 ? "+" : ""} ${Math.abs(v).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 900, padding: "10px 0 0", marginTop: 4 }}>
                  <span>Sobrante mensual</span>
                  <span style={{ color: ingresoTotal - (scConv.mpi+scConv.taxes+scConv.pmi) - dti_deudas - gastosMensuales >= 0 ? "#16a34a" : "#dc2626" }}>
                    ${(ingresoTotal - (scConv.mpi+scConv.taxes+scConv.pmi) - dti_deudas - gastosMensuales).toLocaleString()}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setStep("income")} style={{ flex: 1, background: "#f3f4f6", color: "#374151", border: "none", borderRadius: 12, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  ← Volver
                </button>
                <button onClick={runAIAnalysis}
                  style={{ flex: 2, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  {aiLoading ? "Analizando…" : "Ver mi pre-aprobación →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── PASO 3: RESULTADO ─── */}
        {step === "result" && (
          <div>
            {aiLoading && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Analizando tu perfil financiero…</div>
                <div style={{ fontSize: 13 }}>Comparando con parámetros de lenders en Miami</div>
              </div>
            )}

            {!aiLoading && aiAnalysis && !aiAnalysis.error && (
              <div>
                {/* Veredicto principal */}
                <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 20, padding: "28px 32px", marginBottom: 20, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <QualGauge score={qualScore} />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 8 }}>VEREDICTO DEL LENDER IA</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: aiAnalysis.veredictoColor || "#f59e0b", marginBottom: 8, fontFamily: "Georgia, serif" }}>
                      {aiAnalysis.veredicto}
                    </div>
                    <div style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{aiAnalysis.resumenEjecutivo}</div>
                    {aiAnalysis.mensajeMotivacional && (
                      <div style={{ marginTop: 10, fontSize: 13, color: "#34d399", fontStyle: "italic" }}>"{aiAnalysis.mensajeMotivacional}"</div>
                    )}
                  </div>
                  <div style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: "16px 20px", minWidth: 170 }}>
                    <div style={{ fontSize: 10, color: "#fbbf24", marginBottom: 4 }}>PODER DE COMPRA</div>
                    <div style={{ fontSize: 30, fontWeight: 900, color: "white" }}>${Math.round(scConv.price/1000)}K</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>precio máximo estimado</div>
                    <div style={{ marginTop: 8, fontSize: 12, color: "#fbbf24" }}>{aiAnalysis.tipoPrestamoRecomendado}</div>
                  </div>
                </div>

                {/* Escenarios */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                  <ScenCard title="Convencional 30 años" price={scConv.price} loan={scConv.loan} mpi={scConv.mpi} taxes={scConv.taxes} pmi={scConv.pmi} rate={tasaBase} yrs={30} highlight />
                  <ScenCard title="FHA (menor entrada)" price={scFHA.price} loan={scFHA.loan} mpi={scFHA.mpi} taxes={scFHA.taxes} pmi={scFHA.pmi} rate={tasaBase - 0.1} yrs={30} />
                  <ScenCard title="Convencional 15 años" price={sc15yr.price} loan={sc15yr.loan} mpi={sc15yr.mpi} taxes={sc15yr.taxes} pmi={sc15yr.pmi} rate={tasaBase - 0.5} yrs={15} />
                </div>

                {/* DTI summary */}
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "18px 22px", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>Análisis de DTI</div>
                  <DTIBar label="DTI Front-end" value={parseFloat(dtiFront)} limit={36} color="#f59e0b" />
                  <DTIBar label="DTI Back-end" value={parseFloat(dtiBack)} limit={45} color="#ef4444" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 14 }}>
                    {[
                      ["Credit Score", creditScore, creditScore >= 720 ? "#16a34a" : "#d97706"],
                      ["Enganche", `$${Math.round(downPayment/1000)}K (${Math.round(downPayment/scConv.price*100)}%)`, downPayment/scConv.price >= 0.20 ? "#16a34a" : "#d97706"],
                      ["Años empleo", `${anosEmpleo} ${anosEmpleo>=2?"✓":"⚠"}`, anosEmpleo >= 2 ? "#16a34a" : "#dc2626"],
                    ].map(([l,v,c]) => (
                      <div key={l} style={{ background: "#f9fafb", borderRadius: 10, padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 3, textTransform: "uppercase" }}>{l}</div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: c }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros / Contras / Pasos */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "16px 18px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 10 }}>✓ Fortalezas</div>
                    {(aiAnalysis.fortalezas||[]).map((f,i) => (
                      <div key={i} style={{ fontSize: 12, color: "#166534", marginBottom: 6, display: "flex", gap: 6 }}><span>▸</span><span>{f}</span></div>
                    ))}
                  </div>
                  <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 14, padding: "16px 18px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#9a3412", marginBottom: 10 }}>⚠ A mejorar</div>
                    {(aiAnalysis.debilidades||[]).map((d,i) => (
                      <div key={i} style={{ fontSize: 12, color: "#9a3412", marginBottom: 6, display: "flex", gap: 6 }}><span>▸</span><span>{d}</span></div>
                    ))}
                    {(aiAnalysis.advertencias||[]).map((a,i) => (
                      <div key={i} style={{ fontSize: 11, color: "#92400e", background: "#fef3c7", borderRadius: 8, padding: "6px 10px", marginTop: 6 }}>⚠ {a}</div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "white", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px 18px", marginBottom: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>🗺️ Próximos pasos reales</div>
                  {(aiAnalysis.pasosSiguientes||[]).map((p,i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f59e0b", color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</div>
                      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{p}</div>
                    </div>
                  ))}
                </div>

                {/* CTA ver propiedades */}
                <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 20, padding: "28px 32px", textAlign: "center" }}>
                  <div style={{ fontSize: 13, color: "#fbbf24", marginBottom: 10 }}>SIGUIENTE PASO</div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 10, fontFamily: "Georgia, serif" }}>
                    Mirá propiedades dentro de tu alcance
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>
                    Con un presupuesto de hasta <strong style={{ color: "#fbbf24" }}>${Math.round(scConv.price/1000)}K</strong>, tenemos propiedades en Miami que se ajustan a tu perfil financiero y objetivos.
                  </p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={() => onViewProperties(scConv.price)}
                      style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                      Ver propiedades hasta ${Math.round(scConv.price/1000)}K →
                    </button>
                    <button onClick={onBack}
                      style={{ background: "rgba(255,255,255,0.1)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12, padding: "14px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                      Conectar con asesor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {aiAnalysis?.error && (
              <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                <div>Error al analizar. <button onClick={runAIAnalysis} style={{ color: "#f59e0b", background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}>Reintentar</button></div>
              </div>
            )}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: 20, fontSize: 10, color: "#9ca3af", lineHeight: 1.6, textAlign: "center" }}>
          * Este simulador es una herramienta educativa. No constituye una pre-aprobación formal ni oferta de préstamo. Los resultados son estimaciones basadas en los datos ingresados. Para una pre-aprobación real, contactá a un lender licenciado en Florida.
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STRATEGY FINANCING PANEL — live cash vs financed recalculation
// ============================================================
const viabilidadBadge = (v) => {
  const m = { alta: { bg: "#d1fae5", c: "#065f46", t: "✓ Alta" }, media: { bg: "#fef3c7", c: "#92400e", t: "~ Media" }, baja: { bg: "#fee2e2", c: "#991b1b", t: "✗ Baja" } };
  const s = m[v] || m.media;
  return <span style={{ background: s.bg, color: s.c, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99 }}>{s.t}</span>;
};

const StrategyFinancingPanel = ({ selData, selMeta, sel, prop, hover, setHover }) => {
  const price = prop?.price || 0;

  // ── Financing params ──
  const [isCash,   setIsCash]   = useState(false);
  const [downPct,  setDownPct]  = useState(20);
  const [tasa,     setTasa]     = useState(7.25);
  const [plazo,    setPlazo]    = useState(30);
  const [rehab,    setRehab]    = useState(selData?.costoRehab || selData?.costoMejoras || Math.round(price * 0.08));
  const [renta,    setRenta]    = useState(Math.round(price * 0.005));
  const [rehabTasa, setRehabTasa] = useState(9);
  const [rehabPlazo, setRehabPlazo] = useState(18);
  const [vacPct,   setVacPct]   = useState(8);
  const [adminPct, setAdminPct] = useState(10);
  const [airbnbOcup, setAirbnbOcup] = useState(selData?.ocupacionEstimada || 68);
  const [airbnbRate, setAirbnbRate] = useState(selData?.tarifaNoche || 180);
  const [arvEdit,  setArvEdit]  = useState(selData?.arv || selData?.valorDespues || Math.round(price * 1.2));
  const [showEdit, setShowEdit] = useState(false);

  // ── Helper: NOI calc (must be before calc block) ──
  const calcNOIval = (r, t, h, m, vp, ap) => Math.round(r * 12 - (t + h + m + Math.round(r * vp / 100) + Math.round(r * ap / 100)) * 12);

  // ── Core mortgage calc ──
  const loan       = isCash ? 0 : price * (1 - downPct / 100);
  const downAmt    = isCash ? price : Math.round(price * downPct / 100);
  const mpi        = isCash ? 0 : calcMPI(loan, tasa, plazo);
  const taxIns     = Math.round(price * 0.016 / 12);
  const hoaMes     = prop?.hoa || 0;
  const maintMes   = Math.round(price * 0.01 / 12);
  const totalMes   = mpi + taxIns + hoaMes + maintMes;
  const inversionBase = downAmt + (["flip","brrrr","valueadd"].includes(sel) ? rehab : 0);

  // ── Rehab financing ──
  const rehabLoan  = ["flip","brrrr","valueadd"].includes(sel) && !isCash ? rehab : 0;
  const cuotaRehab = rehabLoan > 0 ? calcMPI(rehabLoan, rehabTasa, rehabPlazo / 12) : 0;

  // ── Per-strategy recalculations ──
  const calc = (() => {
    const vacMes  = Math.round(renta * vacPct / 100);
    const admMes  = Math.round(renta * adminPct / 100);
    const noi     = Math.round(renta * 12 - (taxIns + hoaMes + maintMes + vacMes + admMes) * 12);
    const flujoAn = noi - mpi * 12;
    const capRate = price > 0 && noi > 0 ? ((noi / price) * 100).toFixed(2) : "N/A";
    const coc     = inversionBase > 0 ? ((flujoAn / inversionBase) * 100).toFixed(1) : "N/A";

    if (sel === "buyhold") {
      const proj = Array.from({length:4}, (_,i) => {
        const yr = [1,3,5,10][i];
        const rentaYr = Math.round(renta * Math.pow(1.03, yr));
        const vacYr   = Math.round(rentaYr * vacPct/100);
        const admYr   = Math.round(rentaYr * adminPct/100);
        const noiYr   = rentaYr*12 - (taxIns+hoaMes+maintMes+vacYr+admYr)*12;
        const valYr   = Math.round(price * Math.pow(1.04, yr));
        let bal = loan; const r2 = tasa/100/12;
        for (let m=0; m<12*yr; m++) { const i2=bal*r2; bal=Math.max(bal-(mpi-i2),0); }
        return { yr, flujo: Math.round(noiYr - mpi*12), valor: valYr, equity: Math.round(valYr-bal), roi: inversionBase>0?Math.round((Math.round(valYr-bal)-inversionBase)/inversionBase*100):0 };
      });
      return { noi, flujoAn, capRate, coc, proj, tipo: "buyhold" };
    }

    if (sel === "flip") {
      const compra  = price;
      const costos  = cuotaRehab * rehabPlazo + Math.round(price * 0.03); // carry + closing
      const ganancia = arvEdit - compra - rehab - costos;
      const roiFlip  = inversionBase > 0 ? ((ganancia / inversionBase) * 100).toFixed(1) : "N/A";
      const meses   = selData?.plazoMeses || 9;
      return { ganancia, roiFlip, compra, costos, arvEdit, inversionBase, meses, tipo: "flip" };
    }

    if (sel === "brrrr") {
      const postRehab = arvEdit;
      const refiAl   = Math.round(postRehab * 0.75);
      const newLoan  = refiAl;
      const mpiRefi  = calcMPI(newLoan, tasa, plazo);
      const capRecup = isCash ? refiAl : Math.max(refiAl - (price+rehab), 0);
      const capRestante = Math.max((price + rehab) - refiAl, 0);
      const flujoPost = noi - mpiRefi * 12;
      return { postRehab, refiAl, capRecup, capRestante, flujoPost, noi, tipo: "brrrr" };
    }

    if (sel === "househack") {
      const rentaUnidades = Math.round(renta * 0.6); // renting part of the property
      const costoNeto     = totalMes - rentaUnidades;
      const ahorro        = Math.max(Math.round(totalMes * 0.85) - costoNeto, 0); // vs renting
      const proj = [1,2,3,5].map(yr => ({
        yr,
        hipoteca: totalMes,
        renta: Math.round(rentaUnidades * Math.pow(1.03, yr-1)),
        costo_neto: totalMes - Math.round(rentaUnidades * Math.pow(1.03, yr-1)),
      }));
      return { rentaUnidades, costoNeto, ahorro, proj, tipo: "househack" };
    }

    if (sel === "valueadd") {
      const valorPost   = arvEdit;
      const uplift      = arvEdit - price;
      const rentaPost   = Math.round(renta * 1.3);
      const roiMejora   = rehab > 0 ? ((uplift / rehab) * 100).toFixed(1) : "N/A";
      const noiPost     = calcNOIval(rentaPost, taxIns, hoaMes, maintMes, vacPct, adminPct);
      const flujoPost   = noiPost - mpi*12;
      const capPost     = valorPost > 0 && noiPost > 0 ? ((noiPost/valorPost)*100).toFixed(2) : "N/A";
      const phases = [
        { fase: "Estado actual",      valor: price,    renta },
        { fase: "Post-mejora básica", valor: Math.round(price*1.08), renta: Math.round(renta*1.1) },
        { fase: "Post-mejora completa",valor: valorPost, renta: rentaPost },
        { fase: "Estabilizado",       valor: Math.round(valorPost*1.04), renta: Math.round(rentaPost*1.03) },
      ];
      return { uplift, valorPost, rentaPost, roiMejora, noiPost, flujoPost, capPost, phases, tipo: "valueadd" };
    }

    if (sel === "airbnb") {
      const ingresoBruto = Math.round(airbnbRate * (airbnbOcup/100) * 30);
      const gastos       = Math.round(ingresoBruto * 0.35) + totalMes;
      const flujoSTR     = ingresoBruto - gastos;
      const vsLTR        = flujoSTR - (noi/12);
      const meses = [
        {mes:"Ene",ocup:55}, {mes:"Feb",ocup:75}, {mes:"Mar",ocup:85}, {mes:"Abr",ocup:80},
        {mes:"May",ocup:78}, {mes:"Jun",ocup:70}, {mes:"Jul",ocup:65}, {mes:"Ago",ocup:60},
        {mes:"Sep",ocup:58}, {mes:"Oct",ocup:72}, {mes:"Nov",ocup:80}, {mes:"Dic",ocup:88},
      ].map(m => ({ ...m, ingreso: Math.round(airbnbRate * (m.ocup/100) * 30) }));
      return { ingresoBruto, gastos, flujoSTR, vsLTR, meses, tipo: "airbnb" };
    }
    return { tipo: "unknown" };
  })();

  // ── Small number input ──
  const FI = ({ label, value, onChange, pref="$", step=1, min=0, suf="" }) => (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 7, overflow: "hidden" }}>
        <span style={{ padding: "5px 7px", fontSize: 10, color: "#9ca3af", background: "#f3f4f6", borderRight: "1px solid #e5e7eb" }}>{pref}</span>
        <input type="number" value={value} min={min} step={step}
          onChange={e => onChange(Math.max(Number(e.target.value), min))}
          style={{ flex: 1, border: "none", background: "transparent", padding: "5px 7px", fontSize: 12, fontWeight: 700, color: "#111827", width: "100%" }} />
        {suf && <span style={{ padding: "5px 7px", fontSize: 10, color: "#9ca3af", background: "#f3f4f6", borderLeft: "1px solid #e5e7eb" }}>{suf}</span>}
      </div>
    </div>
  );

  // ── KPI chip ──
  const KPI = ({ label, value, hi, color }) => (
    <div style={{ background: hi ? (color||selMeta.color)+"18" : "#f9fafb", border: `1px solid ${hi ? (color||selMeta.color)+"44" : "#e5e7eb"}`, borderRadius: 10, padding: "9px 11px" }}>
      <div style={{ fontSize: 9, color: "#6b7280", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: hi ? (color||selMeta.color) : "#111827" }}>{value}</div>
    </div>
  );

  // ── Bar chart vertical ──
  const maxFlAbs = calc.proj ? Math.max(...calc.proj.map(p => Math.abs(p.flujo||0)), 1) : 1;

  return (
    <div style={{ padding: "0 0 0 0" }}>
      {/* Financing toggle bar */}
      <div style={{ background: "#f8fafc", borderTop: `1px solid ${selMeta.border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ display: "flex", background: "#e5e7eb", borderRadius: 8, padding: 2 }}>
            {[["Financiado", false], ["Efectivo", true]].map(([l, v]) => (
              <button key={l} onClick={() => setIsCash(v)}
                style={{ background: isCash === v ? "white" : "transparent", border: "none", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontWeight: isCash === v ? 700 : 400, color: isCash === v ? "#111827" : "#6b7280", cursor: "pointer", boxShadow: isCash === v ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                {l}
              </button>
            ))}
          </div>
          {!isCash && (
            <div style={{ display: "flex", gap: 6, fontSize: 12, color: "#374151", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>{downPct}% down</span>
              <span style={{ color: "#9ca3af" }}>·</span>
              <span style={{ fontWeight: 700 }}>{tasa}%</span>
              <span style={{ color: "#9ca3af" }}>·</span>
              <span style={{ fontWeight: 700 }}>{plazo}a</span>
            </div>
          )}
        </div>
        <button onClick={() => setShowEdit(p => !p)}
          style={{ background: showEdit ? "#111827" : "#f3f4f6", color: showEdit ? "white" : "#374151", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
          ✏️ {showEdit ? "Cerrar" : "Editar parámetros"}
        </button>
      </div>

      {/* Edit panel */}
      {showEdit && (
        <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "14px 20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 10 }}>Parámetros editables — recalcula en tiempo real</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 8 }}>
            {!isCash && <>
              <FI label="Tasa hipoteca %" value={tasa} onChange={setTasa} pref="%" step={0.125} min={2} />
              <FI label="Enganche %" value={downPct} onChange={setDownPct} pref="%" step={1} min={3} suf={`$${Math.round(price*downPct/100/1000)}K`} />
              <FI label="Plazo años" value={plazo} onChange={setPlazo} pref="yr" step={5} min={5} />
            </>}
            {["buyhold","househack","airbnb"].includes(sel) && (
              <FI label="Renta mensual" value={renta} onChange={setRenta} step={50} />
            )}
            {["buyhold","househack","airbnb"].includes(sel) && (
              <FI label="Vacancia %" value={vacPct} onChange={setVacPct} pref="%" step={1} />
            )}
            {["buyhold","househack","airbnb"].includes(sel) && (
              <FI label="Administración %" value={adminPct} onChange={setAdminPct} pref="%" step={1} />
            )}
            {sel === "airbnb" && <>
              <FI label="Tarifa/noche" value={airbnbRate} onChange={setAirbnbRate} step={10} />
              <FI label="Ocupación %" value={airbnbOcup} onChange={setAirbnbOcup} pref="%" step={1} max={100} />
            </>}
            {["flip","brrrr","valueadd"].includes(sel) && <>
              <FI label="Costo de rehab" value={rehab} onChange={setRehab} step={2500} />
              <FI label="ARV / Valor post" value={arvEdit} onChange={setArvEdit} step={5000} />
              {!isCash && <>
                <FI label="Tasa rehab %" value={rehabTasa} onChange={setRehabTasa} pref="%" step={0.5} />
                <FI label="Plazo rehab (m)" value={rehabPlazo} onChange={setRehabPlazo} pref="m" step={3} min={6} />
              </>}
            </>}
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ padding: "20px 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>

          {/* LEFT: KPIs + pros/contras */}
          <div>
            {/* Live KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {calc.tipo === "buyhold" && <>
                <KPI label="Hipoteca P&I" value={isCash ? "$0/mes" : `$${mpi.toLocaleString()}/mes`} hi={isCash} />
                <KPI label="Total mensual" value={`$${totalMes.toLocaleString()}/mes`} />
                <KPI label="NOI anual" value={`$${calc.noi.toLocaleString()}`} hi={calc.noi > 0} />
                <KPI label="Flujo neto/año" value={`${calc.flujoAn>=0?"+":""}$${calc.flujoAn.toLocaleString()}`} hi={calc.flujoAn >= 0} />
                <KPI label="Cap Rate" value={calc.capRate !== "N/A" ? `${calc.capRate}%` : "N/A"} hi={parseFloat(calc.capRate) > 4} />
                <KPI label="Cash-on-Cash" value={calc.coc !== "N/A" ? `${calc.coc}%` : "N/A"} hi={parseFloat(calc.coc) > 5} />
              </>}
              {calc.tipo === "flip" && <>
                <KPI label="Precio compra" value={`$${calc.compra.toLocaleString()}`} />
                <KPI label={isCash ? "Rehab (efectivo)" : "Rehab + financiado"} value={`$${rehab.toLocaleString()}`} />
                <KPI label="ARV estimado" value={`$${calc.arvEdit.toLocaleString()}`} hi />
                <KPI label="Ganancia est." value={`$${Math.max(calc.ganancia,0).toLocaleString()}`} hi={calc.ganancia > 0} />
                <KPI label="ROI del flip" value={`${calc.roiFlip}%`} hi={parseFloat(calc.roiFlip) > 20} />
                <KPI label="Inversión total" value={`$${calc.inversionBase.toLocaleString()}`} />
              </>}
              {calc.tipo === "brrrr" && <>
                <KPI label="Compra + rehab" value={`$${(price+rehab).toLocaleString()}`} />
                <KPI label="Valor post-rehab" value={`$${calc.postRehab.toLocaleString()}`} hi />
                <KPI label="Refinanciar al 75%" value={`$${calc.refiAl.toLocaleString()}`} />
                <KPI label="Capital recuperado" value={`$${calc.capRecup.toLocaleString()}`} hi={calc.capRecup > 0} />
                <KPI label="Capital restante" value={`$${calc.capRestante.toLocaleString()}`} />
                <KPI label="Flujo post-refi" value={`${calc.flujoPost>=0?"+":""}$${calc.flujoPost.toLocaleString()}/año`} hi={calc.flujoPost >= 0} />
              </>}
              {calc.tipo === "househack" && <>
                <KPI label="Hipoteca mensual" value={`$${totalMes.toLocaleString()}/mes`} />
                <KPI label="Renta recibida" value={`$${calc.rentaUnidades.toLocaleString()}/mes`} hi />
                <KPI label="Costo neto" value={`$${Math.max(calc.costoNeto,0).toLocaleString()}/mes`} hi={calc.costoNeto <= 0} />
                <KPI label="Ahorro vs alquilar" value={`$${calc.ahorro.toLocaleString()}/mes`} hi={calc.ahorro > 0} />
                <KPI label="Enganche" value={`$${downAmt.toLocaleString()}`} />
                <KPI label="ROI estimado" value={calc.coc !== "N/A" ? `${calc.coc}%` : "N/A"} />
              </>}
              {calc.tipo === "valueadd" && <>
                <KPI label="Valor actual" value={`$${price.toLocaleString()}`} />
                <KPI label="Costo mejoras" value={`$${rehab.toLocaleString()}`} />
                <KPI label="Valor post-mejora" value={`$${calc.valorPost.toLocaleString()}`} hi />
                <KPI label="Uplift" value={`$${calc.uplift.toLocaleString()}`} hi={calc.uplift > 0} />
                <KPI label="ROI mejora" value={`${calc.roiMejora}%`} hi={parseFloat(calc.roiMejora) > 50} />
                <KPI label="Flujo post" value={`${calc.flujoPost>=0?"+":""}$${calc.flujoPost.toLocaleString()}/año`} hi={calc.flujoPost>=0} />
              </>}
              {calc.tipo === "airbnb" && <>
                <KPI label={`Tarifa $${airbnbRate}/noche`} value={`${airbnbOcup}% ocupación`} />
                <KPI label="Ingreso bruto/mes" value={`$${calc.ingresoBruto.toLocaleString()}`} hi />
                <KPI label="Gastos totales/mes" value={`$${calc.gastos.toLocaleString()}`} />
                <KPI label="Flujo neto/mes" value={`${calc.flujoSTR>=0?"+":""}$${calc.flujoSTR.toLocaleString()}`} hi={calc.flujoSTR>=0} />
                <KPI label="vs Renta larga" value={`${calc.vsLTR>=0?"+":""}$${Math.round(calc.vsLTR).toLocaleString()}/mes`} hi={calc.vsLTR>0} />
                <KPI label="Hipoteca/mes" value={isCash ? "$0" : `$${mpi.toLocaleString()}`} hi={isCash} />
              </>}
            </div>

            {/* Financing summary */}
            <div style={{ background: isCash ? "#f0fdf4" : "#eff6ff", border: `1px solid ${isCash ? "#bbf7d0" : "#bfdbfe"}`, borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: isCash ? "#166534" : "#1e40af", marginBottom: 4, textTransform: "uppercase" }}>
                {isCash ? "Compra en efectivo" : `Financiamiento — ${downPct}% down · ${tasa}% · ${plazo}a`}
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {!isCash && <div><div style={{ fontSize: 8, color: "#6b7280" }}>Préstamo</div><div style={{ fontSize: 13, fontWeight: 800, color: "#1d4ed8" }}>${Math.round(loan).toLocaleString()}</div></div>}
                <div><div style={{ fontSize: 8, color: "#6b7280" }}>{isCash ? "Inversión total" : "Enganche"}</div><div style={{ fontSize: 13, fontWeight: 800 }}>${downAmt.toLocaleString()}</div></div>
                {!isCash && <div><div style={{ fontSize: 8, color: "#6b7280" }}>P&I mensual</div><div style={{ fontSize: 13, fontWeight: 800 }}>${mpi.toLocaleString()}/mes</div></div>}
                {cuotaRehab > 0 && <div><div style={{ fontSize: 8, color: "#6b7280" }}>Cuota rehab</div><div style={{ fontSize: 13, fontWeight: 800, color: "#7c3aed" }}>+${cuotaRehab.toLocaleString()}/mes</div></div>}
              </div>
            </div>

            {/* Pros / Contras del AI */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#166534", marginBottom: 6 }}>✓ Ventajas</div>
                {(selData?.pros||[]).map((p,i) => <div key={i} style={{ fontSize: 11, color: "#166534", marginBottom: 4, display:"flex", gap:5 }}><span>▸</span><span>{p}</span></div>)}
              </div>
              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#9a3412", marginBottom: 6 }}>⚠ Riesgos</div>
                {(selData?.contras||[]).map((c,i) => <div key={i} style={{ fontSize: 11, color: "#9a3412", marginBottom: 4, display:"flex", gap:5 }}><span>▸</span><span>{c}</span></div>)}
              </div>
            </div>

            {/* Consejo IA */}
            <div style={{ background: selMeta.bg, border: `1px solid ${selMeta.border}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: selMeta.color, marginBottom: 4 }}>💡 Consejo del asesor IA</div>
              <div style={{ fontSize: 11, color: "#374151", lineHeight: 1.6 }}>{selData?.consejo}</div>
            </div>

            {(selData?.alertas||[]).length > 0 && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "8px 12px", marginTop: 8 }}>
                {selData.alertas.map((a,i) => <div key={i} style={{ fontSize: 10, color: "#991b1b" }}>⚡ {a}</div>)}
              </div>
            )}
          </div>

          {/* RIGHT: live projection chart */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.3px" }}>
              Proyección — {isCash ? "Efectivo" : "Financiado"} · {selMeta.name}
            </div>

            {/* BUY & HOLD */}
            {calc.tipo === "buyhold" && calc.proj && (
              <div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130, marginBottom: 8 }}>
                  {calc.proj.map(p => {
                    const maxV = Math.max(...calc.proj.map(x=>x.equity||0), 1);
                    const maxF = Math.max(...calc.proj.map(x=>Math.abs(x.flujo||0)), 1);
                    const isHov = hover === p.yr;
                    return (
                      <div key={p.yr} onMouseEnter={()=>setHover(p.yr)} onMouseLeave={()=>setHover(null)}
                        style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer" }}>
                        {isHov && (
                          <div style={{ background:"#0f172a", borderRadius:8, padding:"5px 8px", marginBottom:4, fontSize:9, color:"white", textAlign:"center", whiteSpace:"nowrap" }}>
                            Equity: ${Math.round(p.equity/1000)}K<br/>Flujo: ${p.flujo?.toLocaleString()}/año<br/>Valor: ${Math.round(p.valor/1000)}K
                          </div>
                        )}
                        <div style={{ fontSize:9, fontWeight:700, color:selMeta.color, marginBottom:2 }}>${Math.round((p.equity||0)/1000)}K</div>
                        <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end" }}>
                          <div style={{ flex:1, height:Math.max((p.equity||0)/maxV*100,4), background:selMeta.color, borderRadius:"3px 3px 0 0", opacity:0.8 }} />
                          <div style={{ flex:1, height:Math.max(Math.abs(p.flujo||0)/maxF*100,4), background:(p.flujo||0)>=0?"#10b981":"#fca5a5", borderRadius:"3px 3px 0 0", opacity:0.75 }} />
                        </div>
                        <div style={{ fontSize:8, color:"#9ca3af", marginTop:2 }}>Año {p.yr}</div>
                        <div style={{ fontSize:8, color:(p.flujo||0)>=0?"#16a34a":"#dc2626", fontWeight:700 }}>{(p.flujo||0)>=0?"+":""}${Math.round((p.flujo||0)/1000)}K/año</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:12, fontSize:9, color:"#6b7280", marginBottom:10 }}>
                  <span><span style={{display:"inline-block",width:8,height:6,background:selMeta.color,borderRadius:2,marginRight:3}}/>Equity</span>
                  <span><span style={{display:"inline-block",width:8,height:6,background:"#10b981",borderRadius:2,marginRight:3}}/>Flujo anual</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6 }}>
                  {calc.proj.map(p => (
                    <div key={p.yr} style={{ background: selMeta.bg, border:`1px solid ${selMeta.border}`, borderRadius:8, padding:"8px 8px", textAlign:"center" }}>
                      <div style={{ fontSize:9, color:"#6b7280" }}>Año {p.yr}</div>
                      <div style={{ fontSize:12, fontWeight:800, color:selMeta.color }}>${Math.round((p.valor||0)/1000)}K</div>
                      <div style={{ fontSize:10, color:(p.flujo||0)>=0?"#16a34a":"#dc2626" }}>{(p.flujo||0)>=0?"+":""}${Math.round(Math.abs(p.flujo||0)/1000)}K</div>
                      <div style={{ fontSize:9, color:"#9ca3af" }}>ROI {p.roi||0}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FLIP */}
            {calc.tipo === "flip" && (
              <div>
                {[
                  { label: "Precio de compra", value: calc.compra, color: "#6b7280" },
                  { label: isCash ? "Rehab (efectivo)" : `Rehab (${rehabTasa}% · ${rehabPlazo}m)`, value: rehab, color: "#f59e0b" },
                  { label: "Costos carry + cierre", value: calc.costos, color: "#ef4444" },
                  { label: "ARV (precio de venta)", value: calc.arvEdit, color: selMeta.color },
                ].map(b => {
                  const maxV = calc.arvEdit || 1;
                  return (
                    <div key={b.label} style={{ marginBottom: 10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
                        <span style={{ color:"#374151" }}>{b.label}</span>
                        <span style={{ fontWeight:700, color:b.color }}>${(b.value||0).toLocaleString()}</span>
                      </div>
                      <div style={{ background:"#f3f4f6", borderRadius:99, height:7 }}>
                        <div style={{ width:`${Math.min((b.value||0)/maxV*100,100)}%`, height:7, background:b.color, borderRadius:99, transition:"width 0.4s" }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ background: calc.ganancia > 0 ? "#f0fdf4":"#fef2f2", border:`2px solid ${calc.ganancia>0?"#bbf7d0":"#fca5a5"}`, borderRadius:12, padding:"14px", textAlign:"center", marginTop:12 }}>
                  <div style={{ fontSize:10, color:"#6b7280", marginBottom:4 }}>Ganancia estimada</div>
                  <div style={{ fontSize:28, fontWeight:900, color:calc.ganancia>0?"#16a34a":"#dc2626" }}>${Math.max(calc.ganancia,0).toLocaleString()}</div>
                  <div style={{ fontSize:11, color:"#6b7280", marginTop:4 }}>ROI {calc.roiFlip}% en ~{selData?.plazoMeses||9} meses</div>
                  {!isCash && cuotaRehab > 0 && <div style={{ fontSize:10, color:"#7c3aed", marginTop:4 }}>Cuota rehab: ${cuotaRehab.toLocaleString()}/mes durante {rehabPlazo} meses</div>}
                </div>
              </div>
            )}

            {/* BRRRR */}
            {calc.tipo === "brrrr" && (
              <div>
                {[
                  { step:"1. Comprar", desc:`$${price.toLocaleString()} ${isCash?"efectivo":`+ $${downAmt.toLocaleString()} down`}`, icon:"🏠" },
                  { step:"2. Rehabilitar", desc:`$${rehab.toLocaleString()} en remodelación`, icon:"🔨" },
                  { step:"3. Rentar", desc:`Renta estimada $${renta.toLocaleString()}/mes`, icon:"📋" },
                  { step:"4. Refinanciar", desc:`75% del ARV = $${calc.refiAl.toLocaleString()}`, icon:"🏦" },
                  { step:"5. Repetir", desc:`Capital libre: $${calc.capRestante.toLocaleString()}`, icon:"🔄" },
                ].map((s,i) => (
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"center" }}>
                    <div style={{ width:28, height:28, borderRadius:"50%", background:selMeta.color, color:"white", fontSize:12, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{s.icon}</div>
                    <div style={{ flex:1, background:selMeta.bg, border:`1px solid ${selMeta.border}`, borderRadius:9, padding:"8px 11px" }}>
                      <div style={{ fontSize:10, fontWeight:700, color:selMeta.color }}>{s.step}</div>
                      <div style={{ fontSize:11, color:"#374151" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
                <div style={{ background:"#eff6ff", border:"2px solid #2563eb", borderRadius:12, padding:"12px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#1e40af" }}>Capital recuperado en refinanciación</div>
                  <div style={{ fontSize:22, fontWeight:900, color:"#1d4ed8" }}>${calc.capRecup.toLocaleString()}</div>
                  <div style={{ fontSize:11, color:"#6b7280" }}>Flujo post-refi: {calc.flujoPost>=0?"+":""}${calc.flujoPost.toLocaleString()}/año</div>
                </div>
              </div>
            )}

            {/* HOUSE HACK */}
            {calc.tipo === "househack" && calc.proj && (
              <div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120, marginBottom:8 }}>
                  {calc.proj.map(p => {
                    const maxH = Math.max(...calc.proj.map(x=>x.hipoteca||0),1);
                    return (
                      <div key={p.yr} onMouseEnter={()=>setHover(p.yr)} onMouseLeave={()=>setHover(null)}
                        style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer" }}>
                        {hover===p.yr && (
                          <div style={{ background:"#0f172a", borderRadius:8, padding:"5px 8px", marginBottom:3, fontSize:9, color:"white", textAlign:"center" }}>
                            Hipoteca: ${p.hipoteca.toLocaleString()}<br/>Renta: ${p.renta.toLocaleString()}
                          </div>
                        )}
                        <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end" }}>
                          <div style={{ flex:1, height:Math.max((p.hipoteca||0)/maxH*100,4), background:"#fca5a5", borderRadius:"3px 3px 0 0" }} />
                          <div style={{ flex:1, height:Math.max((p.renta||0)/maxH*100,4), background:"#10b981", borderRadius:"3px 3px 0 0" }} />
                        </div>
                        <div style={{ fontSize:8, color:"#9ca3af", marginTop:2 }}>Año {p.yr}</div>
                        <div style={{ fontSize:8, fontWeight:700, color:(p.costo_neto||0)<=0?"#16a34a":"#d97706" }}>
                          {(p.costo_neto||0)<=0?"✓ Libre":"$"+(p.costo_neto||0).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", gap:10, fontSize:9, color:"#6b7280", marginBottom:10 }}>
                  <span><span style={{display:"inline-block",width:8,height:6,background:"#fca5a5",borderRadius:2,marginRight:3}}/>Hipoteca</span>
                  <span><span style={{display:"inline-block",width:8,height:6,background:"#10b981",borderRadius:2,marginRight:3}}/>Renta recibida</span>
                </div>
                <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px", textAlign:"center" }}>
                  <div style={{ fontSize:10, color:"#92400e" }}>Costo neto mensual</div>
                  <div style={{ fontSize:24, fontWeight:900, color:calc.costoNeto<=0?"#16a34a":"#d97706" }}>${Math.max(calc.costoNeto,0).toLocaleString()}/mes</div>
                  <div style={{ fontSize:11, color:"#6b7280", marginTop:3 }}>Ahorro vs alquilar: ${calc.ahorro.toLocaleString()}/mes</div>
                </div>
              </div>
            )}

            {/* VALUE ADD */}
            {calc.tipo === "valueadd" && calc.phases && (
              <div>
                {calc.phases.map((p, i) => {
                  const maxVal = Math.max(...calc.phases.map(x=>x.valor||0),1);
                  const w = Math.round((p.valor||0)/maxVal*100);
                  return (
                    <div key={i} style={{ marginBottom:10 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:3 }}>
                        <span style={{ color:"#374151", fontWeight:600 }}>{p.fase}</span>
                        <span style={{ fontWeight:800, color:selMeta.color }}>${(p.valor||0).toLocaleString()} · Renta ${(p.renta||0).toLocaleString()}/mes</span>
                      </div>
                      <div style={{ background:"#f3f4f6", borderRadius:99, height:9 }}>
                        <div style={{ width:`${w}%`, height:9, background:`linear-gradient(90deg,${selMeta.color}77,${selMeta.color})`, borderRadius:99, transition:"width 0.5s" }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, marginTop:12 }}>
                  <div style={{ background:selMeta.bg, border:`1px solid ${selMeta.border}`, borderRadius:10, padding:"10px", textAlign:"center" }}>
                    <div style={{ fontSize:9, color:selMeta.color }}>Uplift de valor</div>
                    <div style={{ fontSize:20, fontWeight:900, color:selMeta.color }}>${calc.uplift.toLocaleString()}</div>
                  </div>
                  <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:10, padding:"10px", textAlign:"center" }}>
                    <div style={{ fontSize:9, color:"#16a34a" }}>ROI de mejoras</div>
                    <div style={{ fontSize:20, fontWeight:900, color:"#15803d" }}>{calc.roiMejora}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* AIRBNB */}
            {calc.tipo === "airbnb" && calc.meses && (
              <div>
                <div style={{ fontSize:10, color:"#6b7280", marginBottom:6 }}>Estacionalidad mensual — Miami</div>
                <div style={{ display:"flex", alignItems:"flex-end", gap:3, height:100, marginBottom:8 }}>
                  {calc.meses.map(m => {
                    const maxI = Math.max(...calc.meses.map(x=>x.ingreso||0),1);
                    const h = Math.max((m.ingreso||0)/maxI*82,4);
                    const isHov = hover===m.mes;
                    return (
                      <div key={m.mes} onMouseEnter={()=>setHover(m.mes)} onMouseLeave={()=>setHover(null)}
                        style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", cursor:"pointer" }}>
                        {isHov && <div style={{ background:"#0f172a", borderRadius:6, padding:"3px 6px", marginBottom:2, fontSize:8, color:"white", whiteSpace:"nowrap" }}>${(m.ingreso||0).toLocaleString()}<br/>{m.ocup}%</div>}
                        <div style={{ width:"100%", height:h, background:(m.ingreso||0)>=maxI*0.8?selMeta.color:"#fecdd3", borderRadius:"3px 3px 0 0", transition:"height 0.3s" }} />
                        <div style={{ fontSize:7, color:"#9ca3af", marginTop:2 }}>{m.mes}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
                  <div style={{ background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:9, padding:"9px", textAlign:"center" }}>
                    <div style={{ fontSize:8, color:selMeta.color }}>Ingreso bruto/mes</div>
                    <div style={{ fontSize:16, fontWeight:900, color:selMeta.color }}>${calc.ingresoBruto.toLocaleString()}</div>
                  </div>
                  <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:9, padding:"9px", textAlign:"center" }}>
                    <div style={{ fontSize:8, color:"#16a34a" }}>Flujo neto/mes</div>
                    <div style={{ fontSize:16, fontWeight:900, color:calc.flujoSTR>=0?"#15803d":"#dc2626" }}>{calc.flujoSTR>=0?"+":""}${Math.round(calc.flujoSTR).toLocaleString()}</div>
                  </div>
                  <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:9, padding:"9px", textAlign:"center" }}>
                    <div style={{ fontSize:8, color:"#1e40af" }}>vs Renta larga</div>
                    <div style={{ fontSize:16, fontWeight:900, color:calc.vsLTR>=0?"#1d4ed8":"#dc2626" }}>{calc.vsLTR>=0?"+":""}${Math.round(calc.vsLTR).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ fontSize: 9, color: "#d1d5db", marginTop: 14, borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>
          * Proyecciones calculadas con los parámetros editados. {isCash ? "Compra en efectivo — sin deuda hipotecaria." : `Hipoteca: ${tasa}% · ${plazo} años · ${downPct}% enganche.`} Vacancia {vacPct}% · Admin {adminPct}%. Apreciación estimada 4%/año. No constituye asesoramiento financiero.
        </div>
      </div>
    </div>
  );
};

// ============================================================
// STRATEGY ANALYZER — 6 Investment Strategy Scenarios
// ============================================================
const STRATEGIES = [
  {
    id: "buyhold",
    icon: "📈",
    name: "Buy & Hold",
    color: "#0f766e",
    bg: "#f0fdfa",
    border: "#99f6e4",
    tagline: "Construí patrimonio a largo plazo",
    descripcion: "Comprás, mantenés y rentás indefinidamente. El tiempo y la apreciación trabajan para vos. Estrategia ideal para inversores pacientes que buscan ingresos pasivos y crecimiento de capital.",
    horizonte: "10–30 años",
    riesgo: "Bajo",
    liquidez: "Baja",
    efuerzo: "Bajo",
  },
  {
    id: "flip",
    icon: "🔨",
    name: "Fix & Flip",
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fca5a5",
    tagline: "Comprá bajo, renovás, vendés alto",
    descripcion: "Comprás una propiedad con descuento, la renovás y la vendés en 3–9 meses con ganancia. Requiere conocimiento del mercado, gestión de obra y capital para remodelación.",
    horizonte: "3–9 meses",
    riesgo: "Alto",
    liquidez: "Alta",
    efuerzo: "Alto",
  },
  {
    id: "brrrr",
    icon: "🔄",
    name: "BRRRR",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "#bfdbfe",
    tagline: "Buy, Rehab, Rent, Refinance, Repeat",
    descripcion: "Comprás con efectivo o hard money, renovás, rentás, refinanciás para recuperar el capital y repetís el ciclo. Permite escalar sin necesidad de nuevo capital propio.",
    horizonte: "6–18 meses por ciclo",
    riesgo: "Medio-Alto",
    liquidez: "Media",
    efuerzo: "Alto",
  },
  {
    id: "househack",
    icon: "🏘️",
    name: "House Hacking",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    tagline: "Vivís gratis mientras tus inquilinos pagan la hipoteca",
    descripcion: "Comprás un multifamiliar o casa con unidades, vivís en una parte y rentás las demás. El ingreso de renta cubre o reduce tu hipoteca. Ideal para primer compra.",
    horizonte: "2–5 años",
    riesgo: "Bajo",
    liquidez: "Baja",
    efuerzo: "Medio",
  },
  {
    id: "valueadd",
    icon: "⚡",
    name: "Value Add",
    color: "#7c3aed",
    bg: "#faf5ff",
    border: "#e9d5ff",
    tagline: "Crear valor donde otros no ven potencial",
    descripcion: "Comprás una propiedad subvaluada con potencial de mejora: renovación, cambio de uso, subdivisión, ADU, o subir rentas de mercado. Combina análisis profundo con ejecución.",
    horizonte: "1–5 años",
    riesgo: "Medio",
    liquidez: "Media",
    efuerzo: "Alto",
  },
  {
    id: "airbnb",
    icon: "✈️",
    name: "Short-Term Rental",
    color: "#e11d48",
    bg: "#fff1f2",
    border: "#fecdd3",
    tagline: "Máxima rentabilidad por noche — Airbnb / VRBO",
    descripcion: "Rentás por noches o semanas en plataformas como Airbnb o VRBO. En Miami, propiedades bien ubicadas pueden generar 2–3x más que la renta larga. Requiere gestión activa o property manager.",
    horizonte: "Inmediato",
    riesgo: "Medio",
    liquidez: "Alta",
    efuerzo: "Alto",
  },
];

const StrategyPage = ({ onBack, onLead }) => {
  const [phase,   setPhase]   = useState("input");   // input | loading | result
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [prop,    setProp]    = useState(null);       // extracted property data
  const [scores,  setScores]  = useState(null);       // AI strategy scores
  const [sel,     setSel]     = useState("buyhold");  // selected strategy tab
  const [hover,   setHover]   = useState(null);
  const [editP,   setEditP]   = useState({});         // editable params per strategy

  // ── Helper: find the largest JSON object in a text string ──
  const extractJSON = (txt) => {
    // Try to find the outermost { ... } by tracking brace depth
    let start = -1, depth = 0, inStr = false, escape = false;
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (escape) { escape = false; continue; }
      if (c === '\\' && inStr) { escape = true; continue; }
      if (c === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (c === '{') { if (depth === 0) start = i; depth++; }
      if (c === '}') { depth--; if (depth === 0 && start !== -1) {
        try { return JSON.parse(txt.slice(start, i + 1)); } catch { start = -1; }
      }}
    }
    return null;
  };

  const callClaude = async (prompt, maxTokens = 4000, useSearch = false) => {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    };
    if (useSearch) body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    return (d.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  };

  // ── Fetch property data + score all 6 strategies ──
  const analyze = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setProp(null);
    setScores(null);
    setPhase("loading");

    try {
      // ── PASO 1: extraer datos de la propiedad ──
      const extTxt = await callClaude(
        `Eres un especialista en datos inmobiliarios de Miami. El usuario quiere analizar la propiedad en: "${address}"

Usa web_search para buscar precio, características y datos del mercado local.

Devuelve SOLO el siguiente JSON, sin texto adicional, sin markdown, sin backticks:
{"address":"","neighborhood":"","zipCode":"","propertyType":"Single Family","price":0,"beds":0,"baths":0,"sqft":0,"lotSize":0,"yearBuilt":0,"hoa":0,"zoningCode":"RS-1","condition":"buena","estimatedRent":0,"estimatedAirbnb":0,"rehabEstimate":0,"arv":0,"capRateZone":4.5,"daysOnMarket":45,"priceReduction":false,"distressedSale":false,"multiFamily":false,"aduPotential":false,"strAllowed":true,"appreciation12m":5,"marketTrend":"neutro","notes":""}`,
        2000, true
      );
      const propData = extractJSON(extTxt);
      if (!propData || !propData.price) throw new Error("Sin datos de propiedad");
      setProp(propData);

      // ── PASO 2a: analizar estrategias de renta (Buy&Hold, HouseHack, Airbnb) ──
      const precio = propData.price || 0;
      const renta  = propData.estimatedRent || Math.round(precio * 0.005);
      const airbnb = propData.estimatedAirbnb || Math.round(renta * 1.8);
      const rehab  = propData.rehabEstimate || Math.round(precio * 0.12);
      const arv    = propData.arv || Math.round(precio * 1.2);

      const rentaTxt = await callClaude(
        `Experto en inversión inmobiliaria Miami. Analiza estas 3 estrategias para la propiedad: ${propData.address || address}, ${propData.neighborhood || "Miami"}, tipo ${propData.propertyType || "SF"}, precio $${precio.toLocaleString()}, ${propData.beds}hab/${propData.baths}ba, ${propData.sqft}sqft, condición ${propData.condition}, HOA $${propData.hoa}/mes, renta LTR estimada $${renta}/mes, renta STR $${airbnb}/mes, STR permitido: ${propData.strAllowed}, multi-familiar: ${propData.multiFamily}, ADU potential: ${propData.aduPotential}, apreciación 12m: ${propData.appreciation12m}%.

Calcula con números reales del mercado Miami 2024-2025. Enganche 20%, tasa 7.25%, 30 años.

Devuelve SOLO este JSON sin texto extra ni markdown:
{
  "buyhold":{"score":0,"viabilidad":"alta","cashflowMensual":0,"capRate":0,"roi5y":0,"roi10y":0,"engancheNecesario":0,"inversionTotal":0,"pros":["p1","p2"],"contras":["c1"],"consejo":"consejo","alertas":["a1"],"proyeccion":[{"year":1,"valor":0,"flujo":0,"equity":0,"roi":0},{"year":3,"valor":0,"flujo":0,"equity":0,"roi":0},{"year":5,"valor":0,"flujo":0,"equity":0,"roi":0},{"year":10,"valor":0,"flujo":0,"equity":0,"roi":0}]},
  "househack":{"score":0,"viabilidad":"media","hipotecaMensual":0,"rentaUnidades":0,"costoNeto":0,"ahorrVsAlquiler":0,"unidadesDisponibles":1,"pros":["p1","p2"],"contras":["c1"],"consejo":"consejo","alertas":["a1"],"proyeccion":[{"year":1,"hipoteca":0,"renta":0,"costo_neto":0},{"year":2,"hipoteca":0,"renta":0,"costo_neto":0},{"year":3,"hipoteca":0,"renta":0,"costo_neto":0},{"year":5,"hipoteca":0,"renta":0,"costo_neto":0}]},
  "airbnb":{"score":0,"viabilidad":"media","ingresoBrutoMes":0,"ocupacionEstimada":65,"tarifaNoche":0,"gastosMensuales":0,"flujomMensual":0,"vsLTR":0,"setupCost":0,"pros":["p1","p2"],"contras":["c1"],"consejo":"consejo","alertas":["a1"],"proyeccion":[{"mes":"Ene","ingreso":0,"ocupacion":0},{"mes":"Feb","ingreso":0,"ocupacion":0},{"mes":"Mar","ingreso":0,"ocupacion":0},{"mes":"Abr","ingreso":0,"ocupacion":0},{"mes":"May","ingreso":0,"ocupacion":0},{"mes":"Jun","ingreso":0,"ocupacion":0},{"mes":"Jul","ingreso":0,"ocupacion":0},{"mes":"Ago","ingreso":0,"ocupacion":0},{"mes":"Sep","ingreso":0,"ocupacion":0},{"mes":"Oct","ingreso":0,"ocupacion":0},{"mes":"Nov","ingreso":0,"ocupacion":0},{"mes":"Dic","ingreso":0,"ocupacion":0}]}
}`,
        4000
      );
      const rentaScores = extractJSON(rentaTxt) || { buyhold: { score: 50, viabilidad: "media", pros: [], contras: [], consejo: "", alertas: [], proyeccion: [] }, househack: { score: 40, viabilidad: "media", pros: [], contras: [], consejo: "", alertas: [], proyeccion: [] }, airbnb: { score: 45, viabilidad: "media", pros: [], contras: [], consejo: "", alertas: [], proyeccion: [] } };

      // ── PASO 2b: analizar estrategias de capital (Flip, BRRRR, ValueAdd) ──
      const capitalTxt = await callClaude(
        `Experto en inversión inmobiliaria Miami. Analiza estas 3 estrategias para: ${propData.address || address}, ${propData.neighborhood || "Miami"}, precio $${precio.toLocaleString()}, condición ${propData.condition}, rehab estimado $${rehab.toLocaleString()}, ARV estimado $${arv.toLocaleString()}, zonificación ${propData.zoningCode}, ADU potential: ${propData.aduPotential}, mercado: ${propData.marketTrend}.

Usa números reales. Calcula flujos con datos del mercado Miami 2024-2025.

Devuelve SOLO este JSON sin texto ni markdown:
{
  "flip":{"score":0,"viabilidad":"media","precioCompra":0,"costoRehab":0,"arv":0,"gananciaEstimada":0,"roi":0,"plazoMeses":6,"inversionTotal":0,"pros":["p1","p2"],"contras":["c1"],"consejo":"consejo","alertas":["a1"],"proyeccion":[{"month":3,"progreso":"Compra e inicio de obra","valor":0},{"month":6,"progreso":"Obra terminada, lista para vender","valor":0},{"month":9,"progreso":"Venta estimada","valor":0}]},
  "brrrr":{"score":0,"viabilidad":"media","compraEfectivo":0,"costoRehab":0,"valorPostRehab":0,"refinanciaAl":75,"capitalRecuperado":0,"capitalRestante":0,"cashflowPost":0,"pros":["p1","p2"],"contras":["c1"],"consejo":"consejo","alertas":["a1"],"proyeccion":[{"step":"Compra","costo":0,"descripcion":"Compra con efectivo o hard money"},{"step":"Rehab","costo":0,"descripcion":"Renovación para aumentar valor"},{"step":"Renta","ingreso":0,"descripcion":"Arrendamiento para calificar refinanciación"},{"step":"Refinanciar","recuperado":0,"descripcion":"Refinanciar al 75% del ARV"},{"step":"Repetir","capital":0,"descripcion":"Capital disponible para siguiente propiedad"}]},
  "valueadd":{"score":0,"viabilidad":"media","mejoras":["mejora1","mejora2","mejora3"],"costoMejoras":0,"valorAntes":0,"valorDespues":0,"uplift":0,"rentaAntes":0,"rentaDespues":0,"roiMejora":0,"pros":["p1","p2"],"contras":["c1"],"consejo":"consejo","alertas":["a1"],"proyeccion":[{"fase":"Estado actual","valor":0,"renta":0},{"fase":"Post-mejora básica","valor":0,"renta":0},{"fase":"Post-mejora completa","valor":0,"renta":0},{"fase":"Estabilizado","valor":0,"renta":0}]}
}`,
        4000
      );
      const capitalScores = extractJSON(capitalTxt) || { flip: { score: 40, viabilidad: "media", pros: [], contras: [], consejo: "", alertas: [], proyeccion: [] }, brrrr: { score: 35, viabilidad: "media", pros: [], contras: [], consejo: "", alertas: [], proyeccion: [] }, valueadd: { score: 45, viabilidad: "media", pros: [], contras: [], consejo: "", alertas: [], proyeccion: [] } };

      // ── Merge y determinar ganador ──
      const allScores = {
        ...rentaScores,
        ...capitalScores,
      };

      // Determinar ganador por score más alto
      const ganador = Object.entries(allScores)
        .filter(([k]) => ["buyhold","flip","brrrr","househack","valueadd","airbnb"].includes(k))
        .sort((a, b) => (b[1].score || 0) - (a[1].score || 0))[0]?.[0] || "buyhold";

      const ganadorMeta = STRATEGIES.find(s => s.id === ganador);
      const ganadorData = allScores[ganador];
      const ganadorRazon = ganadorData?.consejo || `${ganadorMeta?.name} es la estrategia más viable para esta propiedad basado en sus características y el mercado actual de Miami.`;

      setScores({ ...allScores, ganador, ganadorRazon });
      setSel(ganador);
      setPhase("result");

    } catch (e) {
      console.error("Strategy analyze error:", e);
      setScores({ error: true });
      setPhase("result");
    }
    setLoading(false);
  };

  // ── Shared chart helpers ──
  const VBar = ({ value, max, color, label, sub, highlight }) => {
    const h = Math.max(Math.abs(value) / Math.max(max,1) * 110, 4);
    const pos = value >= 0;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: highlight ? color : (pos ? "#16a34a" : "#dc2626"), marginBottom: 3, textAlign: "center" }}>
          {typeof value === "number" ? (pos ? "+" : "") + (Math.abs(value) >= 1000 ? `$${Math.round(Math.abs(value)/1000)}K` : `$${Math.abs(value).toLocaleString()}`) : value}
        </div>
        <div style={{ width: "100%", height: h, background: pos ? (highlight ? color : "#10b981") : "#fca5a5", borderRadius: "4px 4px 0 0", transition: "height 0.4s" }} />
        <div style={{ fontSize: 9, color: "#9ca3af", marginTop: 3, textAlign: "center" }}>{label}</div>
        {sub && <div style={{ fontSize: 8, color: "#d1d5db", textAlign: "center" }}>{sub}</div>}
      </div>
    );
  };

  const ScoreMeter = ({ score, color }) => {
    const r = 30, circ = 2 * Math.PI * r;
    const dash = circ * Math.min(score/100, 1);
    return (
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ*0.25}
          strokeLinecap="round" style={{ transition: "stroke-dasharray 0.6s ease" }} />
        <text x="40" y="44" textAnchor="middle" fontSize="18" fontWeight="900" fill={color}>{score}</text>
      </svg>
    );
  };

  const selData = scores ? scores[sel] : null;
  const selMeta = STRATEGIES.find(s => s.id === sel);

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdfa", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #134e4a, #0f766e, #0d9488)", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", fontSize: 14 }}>← Volver</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#5eead4", letterSpacing: "0.5px" }}>STRATEGY ANALYZER IA</div>
          <div style={{ fontSize: 14, color: "white", fontWeight: 700, fontFamily: "Georgia, serif" }}>6 Estrategias de Inversión para cualquier propiedad</div>
        </div>
        <div style={{ width: 80 }} />
      </div>

      {/* ─── INPUT ─── */}
      {phase === "input" && (
        <div style={{ maxWidth: 700, margin: "60px auto", padding: "0 20px" }}>
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #99f6e4", padding: "44px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🎯</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 10, fontFamily: "Georgia, serif" }}>
              Ingresá la dirección de la propiedad
            </h2>
            <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              La IA analiza la propiedad y calcula qué tan viable es cada estrategia: Buy & Hold, Flip, BRRRR, House Hack, Value Add y Airbnb — con proyecciones, pros/contras y consejos específicos.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <input value={address} onChange={e => setAddress(e.target.value)}
                onKeyDown={e => e.key === "Enter" && address.trim() && analyze()}
                placeholder="Ej: 850 NW 2nd Ave, Miami FL 33128"
                style={{ flex: 1, background: "#f9fafb", border: "1.5px solid #99f6e4", borderRadius: 12, padding: "14px 16px", fontSize: 15, color: "#111827", fontFamily: "sans-serif" }} />
              <button onClick={analyze} disabled={!address.trim()}
                style={{ background: address.trim() ? "linear-gradient(135deg, #0f766e, #0d9488)" : "#e5e7eb", color: address.trim() ? "white" : "#9ca3af", border: "none", borderRadius: 12, padding: "14px 22px", fontSize: 14, fontWeight: 700, cursor: address.trim() ? "pointer" : "not-allowed", whiteSpace: "nowrap", boxShadow: address.trim() ? "0 4px 16px rgba(13,148,136,0.35)" : "none" }}>
                Analizar →
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {STRATEGIES.map(s => (
                <div key={s.id} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: "12px 10px", textAlign: "left" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>{s.horizonte}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── LOADING ─── */}
      {phase === "loading" && (
        <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 20px" }}>
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #99f6e4", padding: "48px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8, fontFamily: "Georgia, serif" }}>Analizando la propiedad…</h2>
            <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>{address}</div>
            {[
              "Extrayendo datos reales de la propiedad",
              "Analizando estrategias de renta (Buy&Hold, HouseHack, Airbnb)",
              "Analizando estrategias de capital (Flip, BRRRR, Value Add)",
              "Determinando la estrategia ganadora",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, textAlign: "left" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0d9488", color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                <div style={{ fontSize: 13, color: "#374151" }}>{step}</div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 16 }}>30–45 segundos</div>
          </div>
        </div>
      )}

      {/* ─── RESULTADO ─── */}
      {phase === "result" && scores && !scores.error && prop && (
        <div style={{ maxWidth: 1060, margin: "0 auto", padding: "20px" }}>

          {/* Property banner */}
          <div style={{ background: "linear-gradient(135deg, #134e4a, #0f766e)", borderRadius: 16, padding: "18px 24px", marginBottom: 16, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, color: "#5eead4", marginBottom: 4 }}>PROPIEDAD ANALIZADA</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{prop.address}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{prop.propertyType} · {prop.beds}hab/{prop.baths}ba · {(prop.sqft||0).toLocaleString()}sqft · {prop.condition}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 28, fontWeight: 900 }}>${(prop.price||0).toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Precio de mercado</div>
            </div>
          </div>

          {/* Ganador del análisis */}
          {scores.ganador && (
            <div style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)", border: "2px solid #f59e0b", borderRadius: 16, padding: "18px 24px", marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ fontSize: 36 }}>{STRATEGIES.find(s=>s.id===scores.ganador)?.icon}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#92400e", marginBottom: 4, textTransform: "uppercase" }}>🏆 Mejor estrategia para esta propiedad</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#78350f" }}>{STRATEGIES.find(s=>s.id===scores.ganador)?.name}</div>
                <div style={{ fontSize: 13, color: "#92400e", marginTop: 4 }}>{scores.ganadorRazon}</div>
              </div>
            </div>
          )}

          {/* Score overview — 6 cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8, marginBottom: 16 }}>
            {STRATEGIES.map(s => {
              const sd = scores[s.id];
              const isSelected = sel === s.id;
              const isWinner = scores.ganador === s.id;
              return (
                <div key={s.id} onClick={() => setSel(s.id)}
                  style={{ background: isSelected ? s.bg : "white", border: `${isSelected ? 2 : 1}px solid ${isSelected ? s.color : "#e5e7eb"}`, borderRadius: 14, padding: "12px 8px", textAlign: "center", cursor: "pointer", position: "relative", transition: "all 0.15s" }}>
                  {isWinner && <div style={{ position: "absolute", top: -8, right: -4, background: "#f59e0b", color: "white", fontSize: 9, fontWeight: 800, borderRadius: 99, padding: "2px 6px" }}>⭐ TOP</div>}
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                  <ScoreMeter score={sd?.score || 0} color={s.color} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: isSelected ? s.color : "#374151", marginTop: 4 }}>{s.name}</div>
                  <div style={{ fontSize: 9, color: "#9ca3af" }}>Riesgo {s.riesgo}</div>
                </div>
              );
            })}
          </div>

          {/* Detail panel for selected strategy */}
          {selData && selMeta && (
            <div style={{ background: "white", borderRadius: 18, border: `2px solid ${selMeta.border}`, overflow: "hidden", marginBottom: 16 }}>
              {/* Strategy header */}
              <div style={{ background: `linear-gradient(135deg, ${selMeta.color}22, ${selMeta.color}11)`, borderBottom: `2px solid ${selMeta.border}`, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 36 }}>{selMeta.icon}</div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: selMeta.color }}>{selMeta.name}</div>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>{selMeta.tagline}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {viabilidadBadge(selData.viabilidad)}
                  <div style={{ background: selMeta.color + "22", borderRadius: 10, padding: "6px 14px", textAlign: "center" }}>
                    <div style={{ fontSize: 9, color: selMeta.color, textTransform: "uppercase", fontWeight: 700 }}>Score</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: selMeta.color }}>{selData.score}/100</div>
                  </div>
                </div>
              </div>

              {/* ── FINANCING CONTROLS (inside detail panel) ── */}
              <StrategyFinancingPanel
                selData={selData}
                selMeta={selMeta}
                sel={sel}
                prop={prop}
                hover={hover}
                setHover={setHover}
              />
            </div>
          )}

          {/* Comparativa de scores — radar-style table */}
          <div style={{ background:"white", borderRadius:16, border:"1px solid #e5e7eb", padding:"20px 24px", marginBottom:16 }}>
            <h3 style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Comparativa de las 6 estrategias</h3>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead>
                  <tr style={{ background:"#f0fdfa" }}>
                    {["Estrategia","Score","Viabilidad","Horizonte","Riesgo","Liquidez","Esfuerzo"].map(h => (
                      <th key={h} style={{ padding:"8px 10px", textAlign:"left", fontWeight:700, color:"#0f766e", fontSize:10, textTransform:"uppercase", borderBottom:"2px solid #99f6e4" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STRATEGIES.map(s => {
                    const sd = scores[s.id];
                    const isW = scores.ganador === s.id;
                    return (
                      <tr key={s.id} onClick={()=>setSel(s.id)} style={{ borderBottom:"1px solid #f3f4f6", cursor:"pointer", background:isW?"#f0fdfa":sel===s.id?s.bg:"white" }}>
                        <td style={{ padding:"10px", display:"flex", gap:8, alignItems:"center" }}>
                          <span>{s.icon}</span>
                          <span style={{ fontWeight:700, color:s.color }}>{s.name}</span>
                          {isW && <span style={{ background:"#f59e0b", color:"white", fontSize:9, fontWeight:800, padding:"1px 6px", borderRadius:99 }}>TOP</span>}
                        </td>
                        <td style={{ padding:"10px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ background:"#f3f4f6", borderRadius:99, height:6, width:60 }}>
                              <div style={{ width:`${sd?.score||0}%`, height:6, background:s.color, borderRadius:99 }} />
                            </div>
                            <span style={{ fontWeight:800, color:s.color }}>{sd?.score||0}</span>
                          </div>
                        </td>
                        <td style={{ padding:"10px" }}>{viabilidadBadge(sd?.viabilidad||"baja")}</td>
                        <td style={{ padding:"10px", color:"#6b7280" }}>{s.horizonte}</td>
                        <td style={{ padding:"10px", color:"#6b7280" }}>{s.riesgo}</td>
                        <td style={{ padding:"10px", color:"#6b7280" }}>{s.liquidez}</td>
                        <td style={{ padding:"10px", color:"#6b7280" }}>{s.efuerzo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA */}
          <div style={{ background:"linear-gradient(135deg, #0f172a, #1e293b)", borderRadius:20, padding:"28px 32px", textAlign:"center" }}>
            <div style={{ fontSize:12, color:"#5eead4", marginBottom:10 }}>SIGUIENTE PASO</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"white", marginBottom:10, fontFamily:"Georgia, serif" }}>Implementá la estrategia correcta</h3>
            <p style={{ color:"#94a3b8", fontSize:13, marginBottom:20, maxWidth:440, margin:"0 auto 20px" }}>
              Nuestro equipo puede ayudarte a ejecutar la estrategia ganadora: due diligence, financiamiento, estructuración, y seguimiento de la inversión.
            </p>
            <button onClick={onLead} style={{ background:"linear-gradient(135deg, #0d9488, #0f766e)", color:"white", border:"none", borderRadius:12, padding:"14px 32px", fontSize:15, fontWeight:700, cursor:"pointer", boxShadow:"0 4px 16px rgba(13,148,136,0.4)" }}>
              Hablar con un asesor →
            </button>
          </div>
        </div>
      )}

      {phase === "result" && scores?.error && (
        <div style={{ maxWidth:600, margin:"40px auto", padding:"0 20px", textAlign:"center" }}>
          <div style={{ background:"white", borderRadius:16, padding:"32px", border:"1px solid #fee2e2" }}>
            <div style={{ fontSize:28, marginBottom:12 }}>⚠️</div>
            <div style={{ fontSize:15, color:"#991b1b", marginBottom:16 }}>No se pudo analizar esta propiedad.</div>
            <button onClick={()=>setPhase("input")} style={{ background:"#0d9488", color:"white", border:"none", borderRadius:10, padding:"10px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
              Intentar con otra dirección
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SELLER INTELLIGENCE CENTER
// ============================================================
const SellerPage = ({ onBack, onLead }) => {
  const [phase,    setPhase]    = useState("address"); // address | analysis | netsheet | strategy
  const [address,  setAddress]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [data,     setData]     = useState(null);   // AI-extracted valuation data
  const [hoverYr,  setHoverYr]  = useState(null);

  // Editable net sheet fields
  const [salePrice,     setSalePrice]     = useState(0);
  const [loanBalance,   setLoanBalance]   = useState(0);
  const [commRate,      setCommRate]      = useState(6);     // %
  const [closingCosts,  setClosingCosts]  = useState(0);     // seller closing costs $
  const [titleFee,      setTitleFee]      = useState(0);
  const [docStamps,     setDocStamps]     = useState(0);     // FL doc stamps auto-calc
  const [otherCosts,    setOtherCosts]    = useState(0);
  const [capGainsTax,   setCapGainsTax]   = useState(0);     // federal capital gains
  const [stateTax,      setStateTax]      = useState(0);     // FL = 0 income tax
  const [activeTab,     setActiveTab]     = useState("netsheet"); // netsheet | strategy | reinvert

  // Reinvestment params
  const [reinvTipo,     setReinvTipo]     = useState("comprar"); // comprar | invertir | mixto
  const [reinvPrecio,   setReinvPrecio]   = useState(0);
  const [reinvDown,     setReinvDown]     = useState(20);
  const [reinvTasa,     setReinvTasa]     = useState(7.25);
  const [reinvRenta,    setReinvRenta]    = useState(0);

  // ── Fetch valuation from AI with web_search ──
  const fetchValuation = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setData(null);
    try {
      const prompt = `Eres un experto en valuación inmobiliaria en Miami, Florida. El usuario quiere saber cuánto vale su propiedad.

Dirección: "${address}"

TAREA: Usa web_search para buscar:
1. Valuación estimada de esta propiedad (Zestimate, redfin estimate, o similar)
2. Ventas recientes comparables en la misma zona (últimos 6 meses, misma tipología)
3. Tendencia del mercado en ese vecindario (apreciación, días en mercado, etc.)

Devuelve SOLO este JSON (sin markdown, sin backticks):
{
  "address": "dirección completa confirmada",
  "neighborhood": "vecindario",
  "zipCode": "código postal",
  "propertyType": "Single Family | Condo | Townhouse | etc",
  "beds": 0,
  "baths": 0,
  "sqft": 0,
  "yearBuilt": 0,
  "lotSize": 0,
  "estimatedValue": 0,
  "valueRangeMin": 0,
  "valueRangeMax": 0,
  "valuePsqft": 0,
  "lastSalePrice": 0,
  "lastSaleDate": "",
  "appreciation12m": 0,
  "appreciation5y": 0,
  "daysOnMarket": 0,
  "comps": [
    {"address":"","soldPrice":0,"sqft":0,"psqft":0,"beds":0,"baths":0,"daysAgo":0,"similarity":"alta|media|baja"}
  ],
  "marketTrend": "caliente | neutro | enfriando",
  "marketNote": "análisis breve del mercado local",
  "bestTimeToSell": "primavera 2025 | ahora | esperar 6 meses | etc",
  "projections": [
    {"year":2025,"estimatedValue":0},
    {"year":2026,"estimatedValue":0},
    {"year":2027,"estimatedValue":0},
    {"year":2028,"estimatedValue":0},
    {"year":2030,"estimatedValue":0}
  ],
  "extractionNotes": "qué se encontró y qué se estimó"
}`;

      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
          messages: [{ role: "user", content: prompt }]
        })
      });
      const d = await res.json();
      const txt = (d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("");
      const m = txt.match(/\{[\s\S]*\}/);
      if (m) {
        const parsed = JSON.parse(m[0]);
        setData(parsed);
        setSalePrice(parsed.estimatedValue || 0);
        setDocStamps(Math.round((parsed.estimatedValue||0) * 0.007)); // FL doc stamps 0.7%
        setTitleFee(Math.round((parsed.estimatedValue||0) * 0.004)); // ~0.4%
        setClosingCosts(Math.round((parsed.estimatedValue||0) * 0.005));
        setReinvPrecio(Math.round((parsed.estimatedValue||0) * 1.2));
        setReinvRenta(Math.round((parsed.estimatedValue||0) * 1.2 * 0.005));
        setPhase("analysis");
      } else {
        setData({ error: true });
        setPhase("analysis");
      }
    } catch(e) { setData({ error: true }); setPhase("analysis"); }
    setLoading(false);
  };

  // ── Net Sheet calculations ──
  const commission   = Math.round(salePrice * commRate / 100);
  const totalCosts   = commission + closingCosts + titleFee + docStamps + otherCosts + capGainsTax + stateTax;
  const netBeforeLoan = salePrice - totalCosts;
  const netProceeds  = netBeforeLoan - loanBalance;
  const equity       = salePrice - loanBalance;
  const netPct       = salePrice > 0 ? ((netProceeds / salePrice) * 100).toFixed(1) : "0.0";

  // ── Reinvestment calc ──
  const reinvLoan    = reinvPrecio * (1 - reinvDown/100);
  const reinvMPI     = calcMPI(reinvLoan, reinvTasa, 30);
  const reinvTaxIns  = Math.round(reinvPrecio * 0.016 / 12);
  const reinvTotal   = reinvMPI + reinvTaxIns;
  const reinvVac     = Math.round(reinvRenta * 0.08);
  const reinvAdm     = Math.round(reinvRenta * 0.10);
  const reinvNOI     = Math.round(reinvRenta*12 - (reinvTaxIns + Math.round(reinvPrecio*0.01/12) + reinvVac + reinvAdm)*12);
  const reinvFlujo   = reinvNOI - reinvMPI*12;
  const reinvCapRate = reinvPrecio > 0 && reinvNOI > 0 ? ((reinvNOI/reinvPrecio)*100).toFixed(2) : "N/A";

  // ── Value projection chart ──
  const projs = data?.projections || [];
  const maxProj = Math.max(...projs.map(p=>p.estimatedValue), salePrice, 1);

  // ── Editable input ──
  const SEd = ({ label, value, onChange, prefix="$", step=1000, min=0, suffix="" }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.3px" }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", background: "#f9fafb", border: "1px solid #d1d5db", borderRadius: 8, overflow: "hidden" }}>
        <span style={{ padding: "6px 8px", fontSize: 11, color: "#9ca3af", background: "#f3f4f6", borderRight: "1px solid #e5e7eb" }}>{prefix}</span>
        <input type="number" value={value} min={min} step={step}
          onChange={e => onChange(Math.max(Number(e.target.value), min))}
          style={{ flex: 1, border: "none", background: "transparent", padding: "6px 8px", fontSize: 13, fontWeight: 700, color: "#111827", width: "100%" }} />
        {suffix && <span style={{ padding: "6px 8px", fontSize: 11, color: "#9ca3af", background: "#f3f4f6", borderLeft: "1px solid #e5e7eb" }}>{suffix}</span>}
      </div>
    </div>
  );

  const NetRow = ({ label, value, sub, accent, bold, indent }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f9fafb" }}>
      <div style={{ paddingLeft: indent ? 12 : 0 }}>
        <div style={{ fontSize: indent ? 12 : 13, fontWeight: bold ? 700 : 400, color: indent ? "#6b7280" : "#374151" }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: "#9ca3af" }}>{sub}</div>}
      </div>
      <div style={{ fontSize: bold ? 16 : 13, fontWeight: bold ? 800 : 600, color: accent || "#111827" }}>
        {value}
      </div>
    </div>
  );

  const TREND_COLOR = { caliente: "#dc2626", neutro: "#d97706", enfriando: "#2563eb" };
  const TREND_LABEL = { caliente: "🔥 Mercado caliente", neutro: "⚖️ Mercado neutro", enfriando: "❄️ Mercado enfriando" };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #4c1d95, #5b21b6, #6d28d9)", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onBack} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", border: "none", cursor: "pointer", fontSize: 14 }}>← Volver</button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#c4b5fd", letterSpacing: "0.5px" }}>SELLER INTELLIGENCE CENTER</div>
          <div style={{ fontSize: 14, color: "white", fontWeight: 700, fontFamily: "Georgia, serif" }}>¿Cuánto vale tu casa y qué hacer con el dinero?</div>
        </div>
        <div style={{ width: 80 }} />
      </div>

      {/* ─── STEP 1: Address input ─── */}
      {phase === "address" && (
        <div style={{ maxWidth: 640, margin: "60px auto", padding: "0 20px" }}>
          <div style={{ background: "white", borderRadius: 20, border: "1px solid #e5e7eb", padding: "44px 40px", textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>🏠</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 10, fontFamily: "Georgia, serif" }}>
              Ingresá la dirección de tu propiedad
            </h2>
            <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.7, marginBottom: 32 }}>
              Nuestra IA busca valuaciones actuales, ventas comparables recientes en tu zona, tendencias del mercado de Miami, y proyecciones de valor — todo en segundos.
            </p>
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <input value={address} onChange={e => setAddress(e.target.value)}
                onKeyDown={e => e.key === "Enter" && address.trim() && fetchValuation()}
                placeholder="Ej: 1234 SW 5th Ave, Miami FL 33130"
                style={{ flex: 1, background: "#f9fafb", border: "1.5px solid #d1d5db", borderRadius: 12, padding: "14px 16px", fontSize: 15, color: "#111827", fontFamily: "sans-serif" }} />
              <button onClick={fetchValuation} disabled={!address.trim() || loading}
                style={{ background: address.trim() && !loading ? "linear-gradient(135deg, #7c3aed, #6d28d9)" : "#e5e7eb", color: address.trim() && !loading ? "white" : "#9ca3af", border: "none", borderRadius: 12, padding: "14px 22px", fontSize: 14, fontWeight: 700, cursor: address.trim() && !loading ? "pointer" : "not-allowed", whiteSpace: "nowrap", boxShadow: address.trim() ? "0 4px 16px rgba(124,58,237,0.35)" : "none" }}>
                {loading ? "Analizando…" : "Valuar →"}
              </button>
            </div>
            {loading && (
              <div style={{ fontSize: 13, color: "#7c3aed", marginTop: 12 }}>
                Buscando valuaciones, comparables y tendencias de mercado…
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 28 }}>
              {[["🔍","Valuación IA","Estimate actual basado en ventas recientes"],["📊","Comparables","Propiedades similares vendidas cerca tuyo"],["💵","Net Sheet","Cuánto te queda libre después de vender"]].map(([ic,t,d]) => (
                <div key={t} style={{ padding: "14px 10px", background: "#faf5ff", borderRadius: 12, border: "1px solid #e9d5ff" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{ic}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#5b21b6", marginBottom: 4 }}>{t}</div>
                  <div style={{ fontSize: 11, color: "#7c3aed", lineHeight: 1.4 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 2+: Analysis ─── */}
      {phase === "analysis" && (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 20px" }}>

          {data?.error ? (
            <div style={{ background: "white", borderRadius: 16, border: "1px solid #fee2e2", padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
              <div style={{ fontSize: 15, color: "#991b1b", marginBottom: 16 }}>No se pudo obtener la valuación para esta dirección.</div>
              <button onClick={() => setPhase("address")} style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Intentar con otra dirección
              </button>
            </div>
          ) : data && (
            <div>
              {/* Hero de valuación */}
              <div style={{ background: "linear-gradient(135deg, #4c1d95, #5b21b6)", borderRadius: 20, padding: "28px 32px", marginBottom: 16, color: "white" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#c4b5fd", marginBottom: 6, letterSpacing: "0.5px" }}>VALUACIÓN ESTIMADA — {data.neighborhood}</div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4, fontFamily: "Georgia, serif" }}>{data.address}</h2>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{data.propertyType} · {data.beds}hab/{data.baths}ba · {(data.sqft||0).toLocaleString()} sqft · Año {data.yearBuilt}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#a78bfa" }}>${(data.estimatedValue||0).toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Rango: ${(data.valueRangeMin||0).toLocaleString()} – ${(data.valueRangeMax||0).toLocaleString()}</div>
                    {data.valuePsqft > 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>${data.valuePsqft.toLocaleString()}/sqft</div>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
                  {[
                    data.appreciation12m && { l: "Apreciación 12m", v: `+${data.appreciation12m}%`, c: "#34d399" },
                    data.appreciation5y  && { l: "Apreciación 5 años", v: `+${data.appreciation5y}%`, c: "#34d399" },
                    data.daysOnMarket    && { l: "Días en mercado (zona)", v: `${data.daysOnMarket} días` },
                    data.lastSalePrice   && { l: "Última venta", v: `$${(data.lastSalePrice||0).toLocaleString()}` },
                  ].filter(Boolean).map(x => (
                    <div key={x.l}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{x.l}</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: x.c || "white" }}>{x.v}</div>
                    </div>
                  ))}
                  {data.marketTrend && (
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, color: "#c4b5fd" }}>
                      {TREND_LABEL[data.marketTrend] || data.marketTrend}
                    </div>
                  )}
                </div>
                {data.extractionNotes && <div style={{ marginTop: 14, fontSize: 11, color: "rgba(255,255,255,0.45)", fontStyle: "italic" }}>{data.extractionNotes}</div>}
              </div>

              {/* Proyección de valor */}
              {projs.length > 0 && (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 24px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Proyección del valor de tu propiedad</h3>
                    {data.bestTimeToSell && <span style={{ fontSize: 12, background: "#ede9fe", color: "#5b21b6", padding: "4px 10px", borderRadius: 99, fontWeight: 600 }}>Mejor momento: {data.bestTimeToSell}</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 120 }}>
                    {/* Valor actual */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>${Math.round((data.estimatedValue||0)/1000)}K</div>
                      <div style={{ width: 36, height: Math.max((data.estimatedValue||0)/maxProj*100, 8), background: "#7c3aed", borderRadius: "4px 4px 0 0" }} />
                      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>Hoy</div>
                    </div>
                    {projs.map(p => {
                      const h = Math.max(p.estimatedValue/maxProj*100, 8);
                      const isHov = hoverYr === p.year;
                      return (
                        <div key={p.year} onMouseEnter={() => setHoverYr(p.year)} onMouseLeave={() => setHoverYr(null)}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: isHov ? "#5b21b6" : "#7c3aed", marginBottom: 4 }}>
                            ${Math.round(p.estimatedValue/1000)}K
                          </div>
                          <div style={{ width: 36, height: h, background: isHov ? "#5b21b6" : "#a78bfa", borderRadius: "4px 4px 0 0", transition: "all 0.15s", border: isHov ? "2px solid #4c1d95" : "none" }} />
                          <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>{p.year}</div>
                        </div>
                      );
                    })}
                  </div>
                  {data.marketNote && <div style={{ marginTop: 12, fontSize: 12, color: "#6b7280", background: "#faf5ff", borderRadius: 8, padding: "10px 14px", lineHeight: 1.6 }}>{data.marketNote}</div>}
                </div>
              )}

              {/* Comparables */}
              {(data.comps||[]).length > 0 && (
                <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", padding: "20px 24px", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Ventas comparables recientes en tu zona</h3>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: "#faf5ff" }}>
                          {["Dirección","Precio venta","$/sqft","Hab/Baños","Sqft","Vendida","Similitud"].map(h => (
                            <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#5b21b6", fontSize: 10, textTransform: "uppercase", borderBottom: "2px solid #e9d5ff" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ background: "#faf5ff", borderBottom: "2px solid #c4b5fd" }}>
                          <td style={{ padding: "8px 10px", fontWeight: 700, color: "#5b21b6" }}>Tu propiedad</td>
                          <td style={{ padding: "8px 10px", fontWeight: 800, color: "#7c3aed" }}>${(data.estimatedValue||0).toLocaleString()}</td>
                          <td style={{ padding: "8px 10px" }}>{data.valuePsqft ? `$${data.valuePsqft}` : "—"}</td>
                          <td style={{ padding: "8px 10px" }}>{data.beds}/{data.baths}</td>
                          <td style={{ padding: "8px 10px" }}>{(data.sqft||0).toLocaleString()}</td>
                          <td style={{ padding: "8px 10px" }}>—</td>
                          <td style={{ padding: "8px 10px" }}>—</td>
                        </tr>
                        {data.comps.map((c, i) => {
                          const diff = c.soldPrice - (data.estimatedValue||0);
                          return (
                            <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                              <td style={{ padding: "8px 10px", color: "#374151" }}>{c.address || "—"}</td>
                              <td style={{ padding: "8px 10px", fontWeight: 700, color: diff > 0 ? "#16a34a" : "#dc2626" }}>
                                {diff > 0 ? "▲ " : "▼ "}${(c.soldPrice||0).toLocaleString()}
                              </td>
                              <td style={{ padding: "8px 10px" }}>{c.psqft ? `$${c.psqft}` : "—"}</td>
                              <td style={{ padding: "8px 10px" }}>{c.beds}/{c.baths}</td>
                              <td style={{ padding: "8px 10px" }}>{(c.sqft||0).toLocaleString()}</td>
                              <td style={{ padding: "8px 10px", color: "#9ca3af" }}>{c.daysAgo > 0 ? `hace ${c.daysAgo}d` : "reciente"}</td>
                              <td style={{ padding: "8px 10px" }}>
                                <span style={{ background: c.similarity==="alta" ? "#d1fae5" : c.similarity==="media" ? "#fef3c7" : "#f3f4f6", color: c.similarity==="alta" ? "#065f46" : c.similarity==="media" ? "#92400e" : "#6b7280", fontSize: 10, padding: "2px 7px", borderRadius: 99, fontWeight: 600 }}>
                                  {c.similarity === "alta" ? "Alta" : c.similarity === "media" ? "Media" : "Baja"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tabs: Net Sheet / Estrategia / Reinversión */}
              <div style={{ background: "white", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 16 }}>
                <div style={{ display: "flex", borderBottom: "2px solid #e9d5ff", background: "#faf5ff" }}>
                  {[["netsheet","💵 Net Sheet"],["strategy","🗺️ Estrategia de venta"],["reinvert","🔄 ¿Qué hacer con el dinero?"]].map(([k,l]) => (
                    <button key={k} onClick={() => setActiveTab(k)}
                      style={{ flex: 1, padding: "13px", background: activeTab===k ? "white" : "transparent", border: "none", borderBottom: `3px solid ${activeTab===k ? "#7c3aed" : "transparent"}`, fontSize: 12, fontWeight: activeTab===k ? 700 : 400, color: activeTab===k ? "#5b21b6" : "#6b7280", cursor: "pointer", marginBottom: -2 }}>
                      {l}
                    </button>
                  ))}
                </div>

                <div style={{ padding: "22px 24px" }}>

                  {/* ── NET SHEET ── */}
                  {activeTab === "netsheet" && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
                      {/* Editor izquierdo */}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6", marginBottom: 12 }}>Editar parámetros</div>
                        <SEd label="Precio de venta estimado ($)" value={salePrice} onChange={setSalePrice} step={5000} />
                        <SEd label="Saldo hipoteca (lo que debés) ($)" value={loanBalance} onChange={setLoanBalance} step={5000} />
                        <SEd label="Comisión de agentes (%)" value={commRate} onChange={setCommRate} prefix="%" step={0.5} suffix="del precio" />
                        <SEd label="Gastos de cierre vendedor ($)" value={closingCosts} onChange={setClosingCosts} step={500} />
                        <SEd label="Honorarios de título ($)" value={titleFee} onChange={setTitleFee} step={500} />
                        <SEd label="Doc Stamps FL (0.7%) ($)" value={docStamps} onChange={setDocStamps} step={100} />
                        <SEd label="Otros costos ($)" value={otherCosts} onChange={setOtherCosts} step={500} />
                        <SEd label="Impuesto plusvalía federal ($)" value={capGainsTax} onChange={setCapGainsTax} step={1000} />
                        <div style={{ fontSize: 11, color: "#6b7280", background: "#f0fdf4", borderRadius: 8, padding: "8px 10px", marginTop: 6 }}>
                          ℹ️ Florida no tiene impuesto estatal sobre ingresos. Si esta es tu residencia principal por ≥2 años, podés excluir hasta $250K ($500K en pareja) de ganancias de capital federales.
                        </div>
                      </div>

                      {/* Net Sheet derecho */}
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6", marginBottom: 12 }}>Net Sheet</div>
                        <NetRow label="Precio de venta" value={`$${salePrice.toLocaleString()}`} bold />
                        <NetRow label="Comisión de agentes" value={`- $${commission.toLocaleString()}`} indent sub={`${commRate}% = $${commission.toLocaleString()}`} />
                        <NetRow label="Gastos de cierre" value={`- $${closingCosts.toLocaleString()}`} indent />
                        <NetRow label="Honorarios de título" value={`- $${titleFee.toLocaleString()}`} indent />
                        <NetRow label="Doc Stamps FL" value={`- $${docStamps.toLocaleString()}`} indent />
                        {otherCosts > 0 && <NetRow label="Otros costos" value={`- $${otherCosts.toLocaleString()}`} indent />}
                        {capGainsTax > 0 && <NetRow label="Impuesto plusvalía" value={`- $${capGainsTax.toLocaleString()}`} indent />}
                        <div style={{ borderTop: "2px solid #e9d5ff", marginTop: 8, paddingTop: 8 }}>
                          <NetRow label="Total costos de venta" value={`- $${totalCosts.toLocaleString()}`} bold />
                        </div>
                        {loanBalance > 0 && (
                          <div>
                            <NetRow label="Neto antes de hipoteca" value={`$${netBeforeLoan.toLocaleString()}`} />
                            <NetRow label="Pago de hipoteca pendiente" value={`- $${loanBalance.toLocaleString()}`} indent />
                          </div>
                        )}
                        <div style={{ background: netProceeds > 0 ? "#f0fdf4" : "#fef2f2", border: `2px solid ${netProceeds > 0 ? "#bbf7d0" : "#fca5a5"}`, borderRadius: 12, padding: "16px", marginTop: 12 }}>
                          <div style={{ fontSize: 12, color: netProceeds > 0 ? "#166534" : "#991b1b", marginBottom: 4 }}>Proceeds netos de la venta</div>
                          <div style={{ fontSize: 32, fontWeight: 900, color: netProceeds > 0 ? "#16a34a" : "#dc2626" }}>
                            ${Math.abs(netProceeds).toLocaleString()}
                          </div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                            {netPct}% del precio de venta · Equity: ${equity.toLocaleString()}
                          </div>
                        </div>
                        <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 10, lineHeight: 1.5, fontStyle: "italic" }}>
                          * Estimación orientativa. Los costos reales varían. Consultá con un abogado inmobiliario y contador antes de cerrar. Doc Stamps FL = 0.70% del precio.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── ESTRATEGIA ── */}
                  {activeTab === "strategy" && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6", marginBottom: 16 }}>Estrategias para maximizar tu venta</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
                        {[
                          { icon: "📅", title: "Timing de mercado", desc: `${data.bestTimeToSell ? `Mejor momento estimado: ${data.bestTimeToSell}.` : ""} En Miami, primavera (Feb–May) históricamente tiene mayor demanda compradora y mejores precios.`, tip: "Publicar en primavera puede generar hasta 8-12% más vs. invierno." },
                          { icon: "🎨", title: "Home staging y presentación", desc: "Propiedades bien presentadas venden 18 días más rápido y 5-10% por encima del asking price. Inversión mínima: pintura fresca, paisajismo, fotografía profesional.", tip: "ROI del staging en Miami: 5-15x lo invertido." },
                          { icon: "💲", title: "Estrategia de precio", desc: "Fijar el precio 2-4% por encima del valor de mercado para tener margen de negociación. Precios redondos exactos atraen menos ofertas que precios como $849K vs $850K.", tip: "El 75% de las propiedades en Miami se venden con negociación de 2-5%." },
                          { icon: "🏦", title: "Buyer incentives", desc: "Ofrecer créditos de cierre al comprador (2-3%) en lugar de bajar el precio preserva tu valor de venta y hace la propiedad más accesible para compradores con poco enganche.", tip: "Un crédito de $15K puede atraer 3x más ofertas que bajar $15K el precio." },
                          { icon: "📸", title: "Marketing premium", desc: "Video tour 3D, drone footage, y listado en múltiples portales (MLS, Zillow, Realtor, redes sociales) típicamente reduce el tiempo de venta en 30%.", tip: "Propiedades con video 3D reciben 48% más vistas en Zillow." },
                          { icon: "⚖️", title: "Negociación inteligente", desc: "Tener múltiples ofertas es clave. Pedir best & final después de 7-10 días en mercado si hay interés. Evaluar contingencias de inspección, financiamiento y tasación.", tip: "El 68% de ventas en Miami en 2024 cerraron en o por encima del asking price." },
                        ].map(s => (
                          <div key={s.title} style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 12, padding: "16px" }}>
                            <div style={{ fontSize: 18, marginBottom: 8 }}>{s.icon}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#4c1d95", marginBottom: 6 }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, marginBottom: 8 }}>{s.desc}</div>
                            <div style={{ fontSize: 11, color: "#7c3aed", fontWeight: 600, background: "white", borderRadius: 8, padding: "6px 10px", border: "1px solid #c4b5fd" }}>💡 {s.tip}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "linear-gradient(135deg, #4c1d95, #5b21b6)", borderRadius: 14, padding: "20px 24px", color: "white" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🤝 Trabajar con nosotros</div>
                        <div style={{ fontSize: 13, color: "#c4b5fd", lineHeight: 1.6, marginBottom: 16 }}>
                          Nuestro equipo licenciado en Miami diseña una estrategia de venta personalizada: precio justo de mercado, marketing premium, negociación experta, y coordinación total del cierre. Sin stress, máximo resultado.
                        </div>
                        <button onClick={onLead} style={{ background: "#a78bfa", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                          Hablar con un asesor →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── REINVERSIÓN ── */}
                  {activeTab === "reinvert" && (
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#5b21b6", marginBottom: 16 }}>
                        ¿Qué hacer con ${Math.max(netProceeds, 0).toLocaleString()} en proceeds?
                      </div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                        {[["comprar","🏠 Comprar otra casa"],["invertir","📈 Invertir en renta"],["mixto","🔀 Estrategia mixta"]].map(([v,l]) => (
                          <button key={v} onClick={() => setReinvTipo(v)}
                            style={{ flex: 1, background: reinvTipo===v ? "#7c3aed" : "#faf5ff", color: reinvTipo===v ? "white" : "#5b21b6", border: `1.5px solid ${reinvTipo===v ? "#7c3aed" : "#e9d5ff"}`, borderRadius: 10, padding: "10px 8px", fontSize: 12, fontWeight: reinvTipo===v ? 700 : 400, cursor: "pointer" }}>
                            {l}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Parámetros de la próxima compra</div>
                          <SEd label="Precio de la nueva propiedad ($)" value={reinvPrecio} onChange={setReinvPrecio} step={10000} />
                          <SEd label="Enganche (%)" value={reinvDown} onChange={setReinvDown} prefix="%" step={1} suffix={`= $${Math.round(reinvPrecio*reinvDown/100).toLocaleString()}`} />
                          <SEd label="Tasa hipotecaria (%)" value={reinvTasa} onChange={setReinvTasa} prefix="%" step={0.125} />
                          {(reinvTipo === "invertir" || reinvTipo === "mixto") && (
                            <SEd label="Renta mensual estimada ($)" value={reinvRenta} onChange={setReinvRenta} step={100} />
                          )}
                          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px", marginTop: 8 }}>
                            <div style={{ fontSize: 11, color: "#16a34a", marginBottom: 4 }}>Proceeds disponibles para usar</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: "#15803d" }}>${Math.max(netProceeds,0).toLocaleString()}</div>
                            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                              {netProceeds >= reinvPrecio * reinvDown/100
                                ? `✓ Cubrís el enganche del ${reinvDown}% ($${Math.round(reinvPrecio*reinvDown/100).toLocaleString()})`
                                : `⚠ Te faltan $${Math.round(reinvPrecio*reinvDown/100 - netProceeds).toLocaleString()} para el enganche`}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10 }}>Análisis de la reinversión</div>
                          {[
                            ["Préstamo nuevo", `$${Math.round(reinvLoan).toLocaleString()}`],
                            ["Hipoteca P&I", `$${reinvMPI.toLocaleString()}/mes`],
                            ["Impuestos + Seguro", `$${reinvTaxIns.toLocaleString()}/mes`],
                            ["Costo total mensual", `$${reinvTotal.toLocaleString()}/mes`],
                          ].map(([l,v]) => (
                            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #f3f4f6", fontSize: 12 }}>
                              <span style={{ color: "#6b7280" }}>{l}</span>
                              <span style={{ fontWeight: 700 }}>{v}</span>
                            </div>
                          ))}
                          {(reinvTipo === "invertir" || reinvTipo === "mixto") && reinvRenta > 0 && (
                            <div style={{ marginTop: 12, background: reinvFlujo >= 0 ? "#f0fdf4" : "#fef2f2", border: `1px solid ${reinvFlujo >= 0 ? "#bbf7d0" : "#fca5a5"}`, borderRadius: 10, padding: "12px" }}>
                              <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6 }}>Proyección como propiedad de renta</div>
                              {[
                                ["NOI anual", `$${reinvNOI.toLocaleString()}`],
                                ["Flujo neto", `${reinvFlujo>=0?"+":""}$${reinvFlujo.toLocaleString()}/año`],
                                ["Cap Rate", `${reinvCapRate}%`],
                              ].map(([l,v]) => (
                                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                                  <span style={{ color: "#6b7280" }}>{l}</span>
                                  <span style={{ fontWeight: 800, color: l==="Flujo neto" ? (reinvFlujo>=0?"#16a34a":"#dc2626") : "#111827" }}>{v}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {reinvTipo === "mixto" && (
                            <div style={{ marginTop: 10, background: "#eff6ff", borderRadius: 10, padding: "12px", fontSize: 12, color: "#1e40af" }}>
                              <div style={{ fontWeight: 700, marginBottom: 6 }}>💡 Estrategia mixta sugerida</div>
                              Usar {reinvDown}% de los proceeds para enganchar la nueva compra y mantener el resto ($
                              {Math.max(netProceeds - Math.round(reinvPrecio*reinvDown/100), 0).toLocaleString()}) como reserva de liquidez o para mejoras / ADU.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: 20, padding: "28px 32px", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#c4b5fd", marginBottom: 10 }}>LISTO PARA DAR EL PRÓXIMO PASO</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "white", marginBottom: 10, fontFamily: "Georgia, serif" }}>Hablá con nuestro equipo</h3>
                <p style={{ color: "#94a3b8", fontSize: 13, marginBottom: 20, maxWidth: 440, margin: "0 auto 20px" }}>
                  Valuación oficial, estrategia de precio, marketing premium, y maximización del neto. Todo sin costo hasta el cierre.
                </p>
                <button onClick={onLead} style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "white", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(124,58,237,0.4)" }}>
                  Conectar con un asesor →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [page, setPage]                         = useState("landing");
  const [profile, setProfile]                   = useState({});
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [compareProperties, setCompareProperties] = useState([]);
  const [preApprovalBudget, setPreApprovalBudget] = useState(null);

  const handlePreApprovalToResults = (maxPrice) => {
    setPreApprovalBudget(maxPrice);
    setProfile(p => ({ ...p, budget: maxPrice }));
    setPage("results");
  };

  return (
    <div>
      {page === "landing" && (
        <LandingPage
          onStart={() => setPage("intake")}
          onAnalyze={() => setPage("linkanalyzer")}
          onZoning={() => setPage("intake")}
          onPreApproval={() => setPage("preapproval")}
          onSeller={() => setPage("seller")}
          onStrategy={() => setPage("strategy")}
        />
      )}
      {page === "intake" && (
        <IntakePage onComplete={(p) => { setProfile(p); setPage("results"); }} />
      )}
      {page === "strategy" && (
        <StrategyPage
          onBack={() => setPage("landing")}
          onLead={() => setPage("lead")}
        />
      )}
      {page === "seller" && (
        <SellerPage
          onBack={() => setPage("landing")}
          onLead={() => setPage("lead")}
        />
      )}
      {page === "preapproval" && (
        <PreApprovalPage
          onBack={() => setPage("landing")}
          onViewProperties={handlePreApprovalToResults}
        />
      )}
      {page === "linkanalyzer" && (
        <LinkAnalyzerPage
          profile={profile}
          onBack={() => setPage("landing")}
          onFullDetail={(p) => { setSelectedProperty(p); setPage("detail"); }}
          onLead={() => setPage("lead")}
        />
      )}
      {page === "results" && (
        <ResultsPage
          profile={profile}
          onSelect={(p) => { setSelectedProperty(p); setPage("detail"); }}
          onCompare={(props) => { setCompareProperties(props); setPage("compare"); }}
        />
      )}
      {page === "detail" && selectedProperty && (
        <DetailPage
          property={selectedProperty}
          profile={profile}
          onBack={() => setPage("results")}
          onLead={() => setPage("lead")}
        />
      )}
      {page === "compare" && (
        <ComparePage
          properties={compareProperties}
          profile={profile}
          onBack={() => setPage("results")}
        />
      )}
      {page === "lead" && (
        <LeadPage
          property={selectedProperty}
          profile={profile}
          onBack={() => setPage(selectedProperty ? "detail" : "results")}
        />
      )}
    </div>
  );
}
