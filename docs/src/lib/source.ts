import { docs, examples } from "@/.source";
import { loader } from "fumadocs-core/source";

export const docsSource = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});

export const examplesSource = loader({
  baseUrl: "/examples",
  source: examples.toFumadocsSource(),
});