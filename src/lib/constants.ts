export const QUANT_TOPICS = [
  "Numbers", "LCM & HCF", "Ratio & Proportion", "Average", "Problem on Age",
  "Percentages", "Profit and Loss", "Mixture and Alligations", "Simple Interest",
  "Compound Interest", "Time, Speed & Distance", "Trains, Boats & Streams",
  "Race", "Work and Wages", "Pipes and Cistern", "Algebra", "Mensuration 2D",
  "Mensuration 3D", "Geometry", "Trigonometry & Distances", "Progressions",
  "Logarithms", "Permutation & Combination", "Probability", "Clocks", "Calendars",
  "Simplification & Approx", "Data Interpretation"
];

export const LOGICAL_TOPICS = [
  "Number Series", "Letter & Symbol Series", "Verbal Classification", "Analogies",
  "Logical Problems", "Course of Action", "Statement & Conclusion", "Theme Detection",
  "Blood Relations", "Directions", "Statement & Argument", "Logical Deduction",
  "Coding Decoding", "Statement & Assumptions", "Logical Venn Diagram"
];

export const MOA_CONFIGS = [
  // EASY
  { id: "1", title: "Basic Aptitude & Logic Assessment", diff: "EASY" as const, tags: ["Quant", "Logic", "Verbal", "Tech Suites"] },
  { id: "2", title: "Foundational Coding Test", diff: "EASY" as const, tags: ["Logic", "Verbal", "Code", "Debug"] },
  { id: "3", title: "Introductory Technical Screening", diff: "EASY" as const, tags: ["Logic", "Code", "Debug", "Tech Suites"] },
  
  // MEDIUM
  { id: "4", title: "Intermediate Problem Solving", diff: "MEDIUM" as const, tags: ["Quant", "Logic", "Code", "Debug", "Tech Suites"] },
  { id: "5", title: "Core Algorithms & Systems", diff: "MEDIUM" as const, tags: ["Quant", "Logic", "Code", "Debug"] },
  { id: "6", title: "Standard Developer Assessment", diff: "MEDIUM" as const, tags: ["Tech Suites", "Design", "Code", "Verbal"] },
  { id: "7", title: "Comprehensive Logic & Code Test", diff: "MEDIUM" as const, tags: ["Quant", "Logic", "Verbal", "Tech Suites", "Code"] },
  { id: "8", title: "Applied Technical Evaluation", diff: "MEDIUM" as const, tags: ["Tech Suites", "Code", "Debug", "Prompting", "Logic"] },
  { id: "12", title: "General Prompt & AI Screening", diff: "MEDIUM" as const, tags: ["Prompting", "Verbal", "Logic", "Quant", "Design"] },
  
  // HARD
  { id: "9", title: "Advanced Architecture Assessment", diff: "HARD" as const, tags: ["Design", "Code", "Tech Suites", "Quant", "GenAI"] },
  { id: "10", title: "Expert Systems Engineering Test", diff: "HARD" as const, tags: ["Tech Suites", "Design", "Code", "Debug", "Prompting"] },
  { id: "11", title: "Complex Algorithmic Evaluation", diff: "HARD" as const, tags: ["GenAI", "Prompting", "Code", "Quant", "Logic"] },
  { id: "13", title: "Specialized AI & Development Test", diff: "HARD" as const, tags: ["GenAI", "Design", "Code", "Debug", "Tech Suites"] },
  { id: "14", title: "Master Level Coding Gauntlet", diff: "HARD" as const, tags: ["Design", "Tech Suites", "Debug", "Code", "Quant"] },
  { id: "15", title: "Comprehensive Technical Capstone", diff: "HARD" as const, tags: ["Quant", "Logic", "Verbal", "Code", "Design"] },
];
