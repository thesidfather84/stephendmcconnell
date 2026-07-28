import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/approach",
    "/research",
    "/treatment-process",
    "/media",
    "/about",
    "/contact",
    "/disclaimer",
  ];
  const priority: Record<string, number> = {
    "": 1,
    "/approach": 0.9,
    "/research": 0.9,
  };

  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: priority[route] ?? 0.7,
  }));
}
