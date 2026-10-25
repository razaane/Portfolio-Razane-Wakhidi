import type { MetadataRoute } from "next";
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/profile";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/cv", ...featuredProjects.map((p) => `/stories/${p.slug}`)];
  return paths.map((path) => ({
    url: `${site.url}${path || "/"}`,
    lastModified: site.updated,
    alternates: { languages: { en: `${site.url}${path || "/"}`, fr: `${site.url}/fr${path}` } },
  }));
}
