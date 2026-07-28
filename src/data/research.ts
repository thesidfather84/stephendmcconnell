import { YOUTUBE_CHANNEL_URL } from "@/lib/site";

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
  publication: string;
  summary: string;
  category: ResearchCategory;
  mainTopics: string[];
  externalLink: string;
  pdfLink?: string;
  featured?: boolean;
};

export const researchItems: ResearchItem[] = [
  {
    slug: "basic-biochemical-approach-to-ckd",
    title: "A Basic Biochemical Approach to Addressing Chronic Kidney Disease",
    authors: "Stephen D. McConnell, MSc",
    year: 2023,
    publication: "Kidney Total Health",
    summary:
      "A foundational overview of Stephen McConnell's biochemical framework for thinking about chronic kidney disease, connecting metabolic health, lipid metabolism, and kidney function in plain, accessible language.",
    category: "Educational Article",
    mainTopics: ["Chronic kidney disease", "Biochemistry", "Metabolic health"],
    externalLink: YOUTUBE_CHANNEL_URL,
    featured: true,
  },
  {
    slug: "reversing-ckd-with-niacin-and-sodium-bicarbonate",
    title: "Reversing Chronic Kidney Disease with Niacin and Sodium Bicarbonate",
    authors: "Stephen D. McConnell, MSc",
    year: 2024,
    publication: "Kidney Total Health",
    summary:
      "An exploration of Stephen McConnell's research and educational hypotheses on how niacin and sodium bicarbonate protocols may support kidney function, presented alongside published lipidology and nephrology literature. This is an emerging hypothesis under continued study, not an established cure.",
    category: "Emerging Hypothesis",
    mainTopics: ["Niacin", "Sodium bicarbonate", "Chronic kidney disease", "Emerging hypothesis"],
    externalLink: YOUTUBE_CHANNEL_URL,
  },
  {
    slug: "lipidology-foundations-for-kidney-health",
    title: "Lipidology Foundations for Kidney Health",
    authors: "Stephen D. McConnell, MSc",
    year: 2023,
    publication: "Kidney Total Health",
    summary:
      "A primer connecting lipid metabolism to renal function, written for patients and clinicians who want a plain-language bridge between lipidemiology research and everyday kidney health decisions.",
    category: "Educational Article",
    mainTopics: ["Lipid metabolism", "Kidney function", "Patient education"],
    externalLink: YOUTUBE_CHANNEL_URL,
  },
];

export function getFeaturedResearch(): ResearchItem | undefined {
  return researchItems.find((item) => item.featured) ?? researchItems[0];
}
