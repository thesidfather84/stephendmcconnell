export type PointType =
  | "Published Research"
  | "Stephen's Interpretation"
  | "Observation"
  | "Educational Recommendation"
  | "Emerging Hypothesis";

export type ApproachSection = {
  slug: string;
  title: string;
  points: { type: PointType; text: string }[];
};

export const approachSections: ApproachSection[] = [
  {
    slug: "chronic-kidney-disease",
    title: "Chronic kidney disease",
    points: [
      {
        type: "Published Research",
        text: "Chronic kidney disease (CKD) is a well-documented, progressive loss of kidney function with established diagnostic markers such as eGFR and creatinine trends.",
      },
      {
        type: "Educational Recommendation",
        text: "Understanding your own lab trends over time, not just a single reading, is a useful starting point for kidney-health education.",
      },
    ],
  },
  {
    slug: "kidney-function-and-metabolic-health",
    title: "Kidney function and metabolic health",
    points: [
      {
        type: "Stephen's Interpretation",
        text: "Stephen views kidney function as closely tied to broader metabolic health, rather than an isolated organ system.",
      },
      {
        type: "Educational Recommendation",
        text: "Metabolic markers (blood sugar, lipids, blood pressure) are worth tracking alongside kidney-specific labs.",
      },
    ],
  },
  {
    slug: "niacin-research",
    title: "Niacin research",
    points: [
      {
        type: "Emerging Hypothesis",
        text: "Stephen's work explores whether niacin, used thoughtfully and under medical supervision, may support metabolic and kidney-related markers.",
      },
      {
        type: "Educational Recommendation",
        text: "See the dedicated niacin section below for flushing management and safety guidance.",
      },
    ],
  },
  {
    slug: "sodium-bicarbonate-research",
    title: "Sodium bicarbonate research",
    points: [
      {
        type: "Published Research",
        text: "Sodium bicarbonate's role in managing metabolic acidosis in CKD has been studied in the published nephrology literature.",
      },
      {
        type: "Emerging Hypothesis",
        text: "Stephen's ongoing work explores how sodium bicarbonate may complement other kidney-health strategies, alongside niacin, as an area for continued study.",
      },
    ],
  },
  {
    slug: "lipid-metabolism",
    title: "Lipid metabolism",
    points: [
      {
        type: "Published Research",
        text: "As a lipid specialist, Stephen's core training is in lipid metabolism and its downstream effects on cardiovascular and renal health.",
      },
      {
        type: "Stephen's Interpretation",
        text: "He views lipid management as a foundational piece of a broader kidney-health strategy, not a standalone fix.",
      },
    ],
  },
  {
    slug: "blood-pressure-and-vascular-health",
    title: "Blood pressure and vascular health",
    points: [
      {
        type: "Published Research",
        text: "Blood pressure control is a well-established factor in slowing CKD progression.",
      },
      {
        type: "Educational Recommendation",
        text: "Regular blood pressure monitoring, in coordination with a physician, is encouraged as part of any kidney-health strategy.",
      },
    ],
  },
  {
    slug: "nutrition-and-lifestyle",
    title: "Nutrition and lifestyle",
    points: [
      {
        type: "Educational Recommendation",
        text: "Diet, hydration, and lifestyle habits are discussed as supportive factors alongside, not instead of, medical care.",
      },
      {
        type: "Observation",
        text: "Stephen has observed that consistent, sustainable habits tend to matter more than short-term dietary extremes.",
      },
    ],
  },
  {
    slug: "patient-education",
    title: "Patient education",
    points: [
      {
        type: "Educational Recommendation",
        text: "A core part of Stephen's mission is translating research and lab data into language patients can actually use in conversations with their care team.",
      },
    ],
  },
  {
    slug: "monitoring-and-medical-supervision",
    title: "Monitoring and medical supervision",
    points: [
      {
        type: "Educational Recommendation",
        text: "Any changes to diet, supplements, or medication should be introduced gradually and reviewed with a qualified healthcare provider, with regular lab monitoring.",
      },
    ],
  },
];
