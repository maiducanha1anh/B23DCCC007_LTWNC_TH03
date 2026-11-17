import type { MetadataRoute } from "next";
import { loadBooksShift } from "@/lib/books";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    "/",
    "/books",
    ...(await loadBooksShift()).map((book) => `/books/${book.id}`),
  ].map((path) => ({ url: `http://localhost:3000${path}` }));
}
