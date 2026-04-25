export interface ExperimentPlan {
  literatureQC: {
    noveltyStatus: "novel" | "similar work exists" | "well-established";
    summary?: string;
    /** Plain-text reference strings from the backend. */
    references: string[];
  };
  /** Plain-text protocol step strings, in order. */
  protocol: string[];
  materials: {
    itemName: string;
    catalogNumber: string;
    supplier: string;
  }[];
  budget: {
    /** Pre-formatted estimate string, e.g. "$10,000". */
    totalEstimate: string;
  };
  /** Mapping of phase label → activity description, e.g. { "Week 1": "Day 1-7: ..." } */
  timeline: Record<string, string>;
}

export const dummyExperimentPlan: ExperimentPlan = {
  literatureQC: {
    noveltyStatus: "similar work exists",
    references: [
      "Evaluating trehalose and sucrose as cryoprotectants - PubMed",
      "Trehalose in cryopreservation - PMC",
      "Optimization of cryopreservation conditions for HeLa cells - Cryobiology",
    ],
  },
  protocol: [
    "Day 1: Thaw HeLa cells and seed into T-75 flask with DMEM + 10% FBS.",
    "Day 2: Prepare freezing medium (90% FBS + 10% DMSO), pre-chilled.",
    "Day 3: Harvest cells at 70–80% confluency, count and assess viability.",
    "Day 4: Aliquot into cryovials and freeze in Mr. Frosty at −80°C.",
    "Day 5: Transfer cryovials to liquid nitrogen for long-term storage.",
  ],
  materials: [
    { itemName: "HeLa cells", catalogNumber: "CCL-2", supplier: "ATCC" },
    { itemName: "DMSO, Hybri-Max, sterile-filtered", catalogNumber: "D2650-100ML", supplier: "Sigma-Aldrich" },
    { itemName: "Cryovials, 1.8 mL", catalogNumber: "377267", supplier: "Nunc / Thermo Fisher" },
  ],
  budget: {
    totalEstimate: "$10,000",
  },
  timeline: {
    "Week 1": "Day 1-7: Thaw HeLa cells, expand culture, and prepare reagents.",
    "Week 2": "Day 8-14: Prepare freezing medium, freeze aliquots, and store in LN₂.",
  },
};
