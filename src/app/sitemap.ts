import { getPosts } from "@/utils/utils";
import { baseURL, routes as routesConfig } from "@/resources";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogs = getPosts(["src", "app", "blog", "posts"]).map((post) => ({
    url: `${baseURL}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const works = getPosts(["src", "app", "work", "projects"]).map((post) => ({
    url: `${baseURL}/work/${post.slug}`,
    lastModified: post.metadata.publishedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const activeRoutes = Object.keys(routesConfig).filter(
    (route) => routesConfig[route as keyof typeof routesConfig],
  );

  const routePriorities: Record<string, number> = {
    "/": 1.0,
    "/about": 0.9,
    "/blog": 0.9,
    "/work": 0.9,
    "/gallery": 0.6,
  };

  const routes = activeRoutes.map((route) => ({
    url: `${baseURL}${route !== "/" ? route : ""}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency:
      route === "/" || route === "/blog" ? ("daily" as const) : ("weekly" as const),
    priority: routePriorities[route] || 0.5,
  }));

  return [...routes, ...blogs, ...works];
}
