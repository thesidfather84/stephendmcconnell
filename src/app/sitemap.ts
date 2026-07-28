import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllLibraryItems } from "@/data/library";
import { niacinNav } from "@/data/niacin";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/approach",
    "/library",
    "/niacin",
    ...niacinNav.map((item) => item.href),
    "/treatment-process",
    "/media",
    "/about",
    "/contact",
    "/disclaimer",
  ];
  const priority: Record<string, number> = {
    "": 1,
    "/approach": 0.9,
    "/library": 0.9,
    "/niacin": 0.9,
  };

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: priority[route] ?? 0.7,
  }));

  const libraryEntries: MetadataRoute.Sitemap = getAllLibraryItems()
    .filter((item) => item.status === "published")
    .map((item) => ({
      url: `${SITE_URL}/library/${item.slug}`,
      lastModified: item.date ? new Date(item.date) : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticEntries, ...libraryEntries];
}
