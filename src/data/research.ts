export type ResearchCategory =
  | "Published Research"
  | "Educational Article"
  | "Case Observation"
  | "Emerging Hypothesis";

export type ResearchItem = {
  slug: string;
  title: string;
  authors: string;
  year: number;
  summary: string;
  category: ResearchCategory;
  publication: string;
  externalLink: string;
  featured?: boolean;
};

export const researchItems: ResearchItem[] = [
  {
    slug: "reversing-ckd-with-niacin-and-sodium-bicarbonate",
    title: "Reversing Chronic Kidney Disease with Niacin and Sodium Bicarbonate",
    authors: "Stephen D. McConnell, MSc",
    year: 2024,
    summary:
      "An overview of Stephen McConnell's research and clinical observations exploring how niacin and sodium bicarbonate protocols may support kidney function in patients with chronic kidney disease, framed alongside published lipidology and nephrology literature.",
    category: "Emerging Hypothesis",
    publication: "Kidney Total Health",
    externalLink: "https://www.youtube.com/@KidneyTotalHealth",
    featured: true,
  },
  {
    slug: "lipidology-foundations-for-kidney-health",
    title: "Lipidology Foundations for Kidney Health",
    authors: "Stephen D. McConnell, MSc",
    year: 2023,
    summary:
      "A primer connecting lipid metabolism to renal function, written for patients and clinicians who want a plain-language bridge between lipidemiology research and everyday kidney health decisions.",
    category: "Educational Article",
    publication: "Kidney Total Health",
    externalLink: "https://www.youtube.com/@KidneyTotalHealth",
  },
  {
    slug: "niacin-and-metabolic-markers-case-observations",
    title: "Niacin and Metabolic Markers: Case Observations",
    authors: "Stephen D. McConnell, MSc",
    year: 2023,
    summary:
      "A collection of de-identified case observations tracking metabolic markers in patients using niacin-based protocols, presented for educational discussion rather than as clinical guidance.",
    category: "Case Observation",
    publication: "Kidney Total Health",
    externalLink: "https://www.youtube.com/@KidneyTotalHealth",
  },
];

export function getFeaturedResearch(): ResearchItem | undefined {
  return researchItems.find((item) => item.featured) ?? researchItems[0];
}
