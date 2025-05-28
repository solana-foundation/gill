import { docs, guides } from "@/.source";
import { loader } from "fumadocs-core/source";

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export const guidesSource = loader({
  baseUrl: "/guides",
  source: guides.toFumadocsSource(),
});