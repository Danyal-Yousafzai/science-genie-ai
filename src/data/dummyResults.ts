export interface ExperimentPlan {
  literatureQC: {
    noveltyStatus: "novel" | "similar work exists" | "well-established";
    summary: string;
    references: {
      title: string;
      authors: string;
      journal: string;
      year: number;
      doi: string;
    }[];
  };
  protocol: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
  materials: {
    itemName: string;
    catalogNumber: string;
    supplier: string;
  }[];
  budget: {
    totalEstimate: number;
    currency: string;
    breakdown: { category: string; amount: number }[];
  };
  timeline: {
    totalDuration: string;
    phases: { week: string; activity: string; days: number }[];
  };
}

export const dummyExperimentPlan: ExperimentPlan = {
  literatureQC: {
    noveltyStatus: "similar work exists",
    summary:
      "Cryopreservation of HeLa cells using DMSO-based protocols is a well-characterized procedure with extensive prior art. Several studies have explored optimization of cooling rates and cryoprotectant concentrations. Your hypothesis aligns with established methodology but may yield incremental insights with controlled variables.",
    references: [
      {
        title: "Optimization of cryopreservation conditions for HeLa cells using DMSO and trehalose",
        authors: "Chen, L., Park, S., et al.",
        journal: "Cryobiology",
        year: 2022,
        doi: "10.1016/j.cryobiol.2022.04.003",
      },
      {
        title: "A comparative analysis of slow-freezing vs. vitrification in human cell lines",
        authors: "Yamamoto, K., Singh, R.",
        journal: "Cell Preservation Technology",
        year: 2021,
        doi: "10.1089/cpt.2021.0045",
      },
      {
        title: "Post-thaw viability of HeLa cells: impact of serum concentration",
        authors: "Müller, A., Rossi, G., et al.",
        journal: "In Vitro Cellular & Developmental Biology",
        year: 2020,
        doi: "10.1007/s11626-020-00478-x",
      },
      {
        title: "DMSO-free cryopreservation strategies for adherent mammalian cells",
        authors: "Okafor, N., Brennan, P.",
        journal: "Biopreservation and Biobanking",
        year: 2023,
        doi: "10.1089/bio.2023.0012",
      },
    ],
  },
  protocol: [
    {
      step: 1,
      title: "Cell Culture Preparation",
      description:
        "Grow HeLa cells in DMEM supplemented with 10% FBS and 1% Pen/Strep at 37°C, 5% CO₂. Ensure cells are in log-phase growth (70–80% confluency) before harvesting.",
      duration: "48–72 hours",
    },
    {
      step: 2,
      title: "Cell Harvesting",
      description:
        "Aspirate medium, wash cells once with sterile DPBS, then detach with 0.25% Trypsin-EDTA for 3–5 min at 37°C. Neutralize trypsin with equal volume of complete medium.",
      duration: "15 min",
    },
    {
      step: 3,
      title: "Cell Counting & Viability",
      description:
        "Centrifuge at 300 × g for 5 min. Resuspend pellet in 1 mL medium and count using a hemocytometer with Trypan Blue. Confirm ≥95% viability before proceeding.",
      duration: "20 min",
    },
    {
      step: 4,
      title: "Freezing Medium Preparation",
      description:
        "Prepare freezing medium: 90% FBS + 10% DMSO (filter-sterilized, pre-chilled to 4°C). Resuspend cells at 1–2 × 10⁶ cells/mL in freezing medium.",
      duration: "10 min",
    },
    {
      step: 5,
      title: "Aliquoting into Cryovials",
      description:
        "Transfer 1 mL of cell suspension into pre-labeled 1.8 mL cryovials. Keep on ice throughout. Label with cell line, passage number, date, and operator initials.",
      duration: "15 min",
    },
    {
      step: 6,
      title: "Controlled-Rate Freezing",
      description:
        "Place cryovials in a Mr. Frosty container (or CRF) at −80°C overnight to achieve a cooling rate of approximately −1°C/min.",
      duration: "12–24 hours",
    },
    {
      step: 7,
      title: "Long-Term Storage",
      description:
        "Transfer cryovials to liquid nitrogen vapor phase (≤ −150°C) for long-term storage. Record location in the inventory management system.",
      duration: "Ongoing",
    },
    {
      step: 8,
      title: "Post-Thaw Viability Assay",
      description:
        "After 7 days, thaw one vial rapidly in a 37°C water bath. Dilute in pre-warmed medium, plate, and assess viability and recovery at 24 h and 72 h.",
      duration: "72 hours",
    },
  ],
  materials: [
    { itemName: "DMEM, high glucose, GlutaMAX", catalogNumber: "10566-016", supplier: "Gibco / Thermo Fisher" },
    { itemName: "Fetal Bovine Serum, qualified", catalogNumber: "10270-106", supplier: "Gibco / Thermo Fisher" },
    { itemName: "Penicillin-Streptomycin (10,000 U/mL)", catalogNumber: "15140-122", supplier: "Gibco / Thermo Fisher" },
    { itemName: "0.25% Trypsin-EDTA, phenol red", catalogNumber: "25200-056", supplier: "Gibco / Thermo Fisher" },
    { itemName: "DPBS, no calcium, no magnesium", catalogNumber: "14190-144", supplier: "Gibco / Thermo Fisher" },
    { itemName: "DMSO, Hybri-Max, sterile-filtered", catalogNumber: "D2650-100ML", supplier: "Sigma-Aldrich" },
    { itemName: "Cryovials, 1.8 mL, internal thread", catalogNumber: "377267", supplier: "Nunc / Thermo Fisher" },
    { itemName: "Mr. Frosty Freezing Container", catalogNumber: "5100-0001", supplier: "Nalgene / Thermo Fisher" },
    { itemName: "Trypan Blue Solution, 0.4%", catalogNumber: "15250-061", supplier: "Gibco / Thermo Fisher" },
    { itemName: "T-75 Tissue Culture Flasks", catalogNumber: "156499", supplier: "Nunc / Thermo Fisher" },
  ],
  budget: {
    totalEstimate: 1845,
    currency: "USD",
    breakdown: [
      { category: "Reagents & Media", amount: 720 },
      { category: "Consumables (vials, flasks)", amount: 285 },
      { category: "Equipment Time (CRF, LN₂)", amount: 340 },
      { category: "Personnel (12h @ $35/hr)", amount: 420 },
      { category: "Quality Control Assays", amount: 80 },
    ],
  },
  timeline: {
    totalDuration: "2 weeks",
    phases: [
      { week: "Week 1 — Days 1–3", activity: "Cell culture expansion & QC", days: 3 },
      { week: "Week 1 — Day 4", activity: "Harvest, count, aliquot & freeze", days: 1 },
      { week: "Week 1 — Day 5", activity: "Transfer to LN₂ storage", days: 1 },
      { week: "Week 2 — Day 12", activity: "Thaw & 24h viability check", days: 1 },
      { week: "Week 2 — Day 14", activity: "72h recovery assessment & report", days: 1 },
    ],
  },
};
