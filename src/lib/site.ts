export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stephendmcconnell.com";

export const SITE_NAME = "Stephen D. McConnell, MSc";
export const SITE_TAGLINE = "Lipidemiologist • Kidney Researcher • Educator";

export const SITE_DESCRIPTION =
  "The official research archive of Stephen D. McConnell, MSc — lipidemiologist and kidney researcher. Articles, studies, and interviews on chronic kidney disease, niacin, and lipidology.";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@KidneyTotalHealth";
export const YOUTUBE_CHANNEL_NAME = "Kidney Total Health";

export const CONTACT_EMAIL = "contact@stephendmcconnell.com";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research & Articles" },
  { href: "/media", label: "Videos & Podcasts" },
  { href: "/contact", label: "Contact" },
] as const;
