export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://stephendmcconnell.com";

export const SITE_NAME = "Stephen D. McConnell, BS, MSc-CCP, CIS";

/** Short, compact tagline for tight spaces (header, footer). */
export const SITE_TAGLINE = "Lipid Specialist • Kidney Researcher";

/** Full credential tagline for the homepage hero and About page — do not abbreviate. */
export const FULL_CREDENTIAL_TAGLINE =
  "Lipid Specialist • Clinical Application Specialist • Kidney Researcher • Medical Science Liaison";

export const SITE_DESCRIPTION =
  "Stephen D. McConnell, BS, MSc-CCP, CIS — lipid specialist and kidney researcher. Explore his kidney-health approach, published research and articles, niacin and sodium bicarbonate research, and educational treatment process for chronic kidney disease.";

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@KidneyTotalHealth";
export const YOUTUBE_CHANNEL_NAME = "Kidney Total Health";

export const HEALTH_DEFENDER_URL = "https://www.healthdefender.care/pages/meet-the-team";
export const HEALTH_DEFENDER_NAME = "Health Defender";

export const CONTACT_EMAIL = "McConSD55@gmail.com";

/**
 * Stored per Stephen's instruction but not yet confirmed for public display.
 * Do not render this on any public page until he explicitly approves it.
 */
export const CONTACT_MOBILE_PRIVATE = "814-572-1801";

export type NavLink = { href: string; label: string };

/** Top-level links shown directly in the header, no dropdown. */
export const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/approach", label: "Kidney Health Approach" },
  { href: "/treatment-process", label: "Treatment Process" },
];

export const RESOURCES_NAV_LINKS: NavLink[] = [
  { href: "/library", label: "Research Library" },
  { href: "/niacin", label: "Niacin Resource Center" },
  { href: "/testing", label: "Testing & Self-Assessment" },
  { href: "/media", label: "Videos & Podcasts" },
];

export const ABOUT_NAV_LINKS: NavLink[] = [
  { href: "/about", label: "About Stephen" },
  { href: "/contact", label: "Contact" },
];

/** Every page in one flat list, for the footer. */
export const NAV_LINKS: NavLink[] = [
  ...PRIMARY_NAV_LINKS.filter((link) => link.href !== "/"),
  ...RESOURCES_NAV_LINKS,
  ...ABOUT_NAV_LINKS,
];
