export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stephendmcconnell.com";

export const SITE_NAME = "Stephen D. McConnell, MSc";
export const SITE_TAGLINE = "Lipidemiologist • Kidney Researcher • Educator";

export const SITE_DESCRIPTION =
  "Stephen D. McConnell, MSc — lipidemiologist and kidney researcher. Explore his kidney-health approach, published research and articles, niacin and sodium bicarbonate research, and educational treatment process for chronic kidney disease.";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@KidneyTotalHealth";
export const YOUTUBE_CHANNEL_NAME = "Kidney Total Health";

export const HEALTH_DEFENDER_URL = "https://www.healthdefender.care/pages/meet-the-team";
export const HEALTH_DEFENDER_NAME = "Health Defender";

export const CONTACT_EMAIL = "contact@stephendmcconnell.com";

export const NAV_LINKS = [
  { href: "/approach", label: "Kidney Health Approach" },
  { href: "/research", label: "Research & Articles" },
  { href: "/treatment-process", label: "Treatment Process" },
  { href: "/media", label: "Videos & Podcasts" },
  { href: "/about", label: "About Stephen" },
  { href: "/contact", label: "Contact" },
] as const;
