export type LibraryCategory =
  | "Published Research"
  | "Review Article"
  | "Research Discussion"
  | "Educational Article"
  | "Supporting Literature"
  | "Video"
  | "Podcast"
  | "Interview";

export type LibraryTopic =
  | "Chronic Kidney Disease"
  | "Niacin"
  | "Sodium Bicarbonate"
  | "Calcium Carbonate"
  | "Lipid Metabolism"
  | "Cardiovascular Health"
  | "Blood Pressure"
  | "Metabolic Health"
  | "Patient Education";

export type LibraryStatus = "published" | "coming-soon" | "awaiting-review";

export type RelatedResource = {
  label: string;
  url: string;
};

export type LibraryItem = {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  year?: number;
  date?: string;
  category: LibraryCategory;
  topics: LibraryTopic[];
  publication?: string;
  summary: string;
  plainLanguageSummary?: string;
  keyPoints?: string[];
  stephensRole?: string;
  citation?: string;
  externalUrl?: string;
  pdfUrl?: string;
  videoUrl?: string;
  podcastUrl?: string;
  relatedResources?: RelatedResource[];
  featured?: boolean;
  status: LibraryStatus;
  isStephenAuthor: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

/**
 * Evidence-level label shown alongside each entry's category, so the
 * library never implies a review article, a profile link, and a
 * published study carry the same evidential weight.
 */
export const EVIDENCE_LABELS: Record<LibraryCategory, string> = {
  "Published Research": "Published Research",
  "Review Article": "Review and Commentary",
  "Research Discussion": "Research Discussion",
  "Educational Article": "Educational Material",
  "Supporting Literature": "Supporting Literature",
  Video: "Media Appearance",
  Podcast: "Media Appearance",
  Interview: "Media Appearance",
};

export const LIBRARY_CATEGORIES: LibraryCategory[] = [
  "Published Research",
  "Review Article",
  "Research Discussion",
  "Educational Article",
  "Supporting Literature",
  "Video",
  "Podcast",
  "Interview",
];

export const LIBRARY_TOPICS: LibraryTopic[] = [
  "Chronic Kidney Disease",
  "Niacin",
  "Sodium Bicarbonate",
  "Calcium Carbonate",
  "Lipid Metabolism",
  "Cardiovascular Health",
  "Blood Pressure",
  "Metabolic Health",
  "Patient Education",
];

export const libraryItems: LibraryItem[] = [
  {
    id: "lib-001",
    slug: "reversing-ckd-with-niacin-and-sodium-bicarbonate",
    title:
      "Reversing Chronic Kidney Disease with Niacin and Sodium Bicarbonate: Review and Commentary",
    authors: ["Stephen McConnell", "W. Todd Penberthy"],
    year: 2021,
    date: "2021-10-14",
    category: "Review Article",
    topics: ["Chronic Kidney Disease", "Niacin", "Sodium Bicarbonate"],
    publication: "Orthomolecular Medicine News Service (OMNS)",
    summary:
      "Stephen McConnell and W. Todd Penberthy review documented cases in which low-dose niacin combined with sodium bicarbonate was associated with improvement of at least one chronic kidney disease stage, and discuss the biochemical mechanisms proposed to explain the effect.",
    plainLanguageSummary:
      "This review and commentary, co-authored by Stephen McConnell, looks at cases where people with early-stage chronic kidney disease saw their disease stage improve after adding low-dose niacin and sodium bicarbonate. It walks through the biochemistry behind why the authors believe this combination may help, including its effect on phosphate levels, and includes a personal account from Stephen about his own father's kidney disease.",
    keyPoints: [
      "Co-authored by Stephen McConnell and W. Todd Penberthy, published by the Orthomolecular Medicine News Service.",
      "Reviews documented cases of chronic kidney disease stage improvement associated with low-dose niacin and sodium bicarbonate.",
      "Discusses proposed mechanisms, including NAD synthesis, PCSK9 inhibition, sodium transporter effects, and PPAR gamma activation.",
      "Includes a personal account from Stephen McConnell about his father's experience with chronic kidney disease.",
    ],
    stephensRole: "Lead Author",
    citation:
      "McConnell, S., & Penberthy, W. T. (2021, October 14). Reversing chronic kidney disease with niacin and sodium bicarbonate: Review and commentary. Orthomolecular Medicine News Service.",
    externalUrl: "https://www.orthomolecular.org/resources/omns/v17n22.shtml",
    relatedResources: [
      {
        label: "View on ResearchGate",
        url: "https://www.researchgate.net/publication/376352949_Reversing_Chronic_Kidney_Disease_with_Niacin_and_Sodium_Bicarbonate_Review_and_Commentary",
      },
    ],
    featured: true,
    status: "published",
    isStephenAuthor: true,
    seoTitle: "Reversing Chronic Kidney Disease with Niacin and Sodium Bicarbonate",
    seoDescription:
      "Stephen D. McConnell and W. Todd Penberthy's review and commentary on niacin and sodium bicarbonate in chronic kidney disease, published by the Orthomolecular Medicine News Service.",
  },
  {
    id: "lib-002",
    slug: "basic-biochemical-approach-to-ckd",
    title: "A Basic Biochemical Approach to Addressing Chronic Kidney Disease",
    authors: ["W. Todd Penberthy", "Stephen McConnell", "Richard Chern", "Chester H. Fox"],
    year: 2025,
    date: "2025-03-18",
    category: "Published Research",
    topics: [
      "Chronic Kidney Disease",
      "Niacin",
      "Sodium Bicarbonate",
      "Calcium Carbonate",
    ],
    publication: "Journal of Orthomolecular Medicine, Vol. 40, No. 1",
    summary:
      "Penberthy, McConnell, Chern, and Fox present a biochemical formulation combining niacin, sodium bicarbonate, calcium carbonate, and isoquercetin for chronic kidney disease stages 3B–5, tracking eGFR and urine albumin-creatinine ratios across a documented patient cohort.",
    plainLanguageSummary:
      "This published research paper, co-authored by Stephen McConnell, describes a combination of niacin, sodium bicarbonate, calcium carbonate, and isoquercetin used to address later-stage chronic kidney disease. The authors tracked kidney function markers in a group of patients over six months and report on the biochemical reasoning behind the approach, including its effect on phosphate levels, acidosis, and protein in the urine.",
    keyPoints: [
      "Co-authored by Stephen McConnell, W. Todd Penberthy, Richard Chern, and Chester H. Fox.",
      "Published in the Journal of Orthomolecular Medicine, Volume 40, Number 1.",
      "Describes a formulation combining niacin, sodium bicarbonate, calcium carbonate, and isoquercetin for CKD stages 3B–5.",
      "Tracks eGFR and urine albumin-creatinine ratio at baseline, 3 months, and 6 months across a documented patient cohort.",
    ],
    stephensRole: "Co-Author",
    citation:
      "Penberthy, W. T., McConnell, S., Chern, R., & Fox, C. H. (2025). A basic biochemical approach to addressing chronic kidney disease. Journal of Orthomolecular Medicine, 40(1).",
    externalUrl:
      "https://isom.ca/article/a-basic-biochemical-approach-to-addressing-chronic-kidney-disease/",
    featured: true,
    status: "published",
    isStephenAuthor: true,
    seoTitle: "A Basic Biochemical Approach to Addressing Chronic Kidney Disease",
    seoDescription:
      "Published research by Stephen D. McConnell, W. Todd Penberthy, Richard Chern, and Chester H. Fox on a biochemical approach to chronic kidney disease, in the Journal of Orthomolecular Medicine.",
  },
  {
    id: "lib-003",
    slug: "stephen-mcconnell-researchgate-profile",
    title: "Stephen D. McConnell — ResearchGate Profile",
    authors: ["Stephen McConnell"],
    category: "Research Discussion",
    topics: ["Chronic Kidney Disease", "Patient Education"],
    publication: "ResearchGate",
    summary:
      "Stephen McConnell's ResearchGate profile, where his publications and research activity can be found and followed.",
    plainLanguageSummary:
      "This is a link to Stephen McConnell's profile on ResearchGate, a platform researchers use to share publications and connect with other researchers.",
    stephensRole: "Profile Subject",
    externalUrl: "https://www.researchgate.net/profile/Stephen-Mcconnell-2",
    featured: false,
    status: "published",
    isStephenAuthor: true,
    seoTitle: "Stephen D. McConnell on ResearchGate",
    seoDescription:
      "Stephen D. McConnell's ResearchGate profile, featuring his published research on chronic kidney disease.",
  },
];

export function getFeaturedLibraryItems(): LibraryItem[] {
  return libraryItems.filter((item) => item.featured && item.status === "published");
}

export function getLibraryItemBySlug(slug: string): LibraryItem | undefined {
  return libraryItems.find((item) => item.slug === slug);
}

export function getSortableTime(item: LibraryItem): number {
  if (item.date) return new Date(item.date).getTime();
  if (item.year) return new Date(`${item.year}-01-01`).getTime();
  return 0;
}
