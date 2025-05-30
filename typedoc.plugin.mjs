// @ts-check
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";
import * as td from "typedoc-plugin-markdown";

import { typedocPageIndexData } from "./docs/typedoc-data.mjs";

// Extract the package directory name to be used as the part of the markdown links
let dirs = cwd().split("/packages/");

/** @param {td.MarkdownApplication} app */
export function load(app) {
  // For multi-export packages, put each docs into a different directory
  if (!app.options.getValue("out").endsWith("/.docs")) {
    // console.warn("[app]", app.options.getValue("out"));
    dirs = app.options.getValue("out").split("/.docs/");
  }

  const apiDirName = dirs[dirs.length - 1];

  // Set Markdown frontmatter for each page
  app.renderer.on(td.MarkdownPageEvent.BEGIN, (page) => {
    page.frontmatter = {
      title: page.model.name,
    };

    // Slice in the index data (when desired)
    if (page.url == "index.mdx" && typedocPageIndexData[apiDirName]?.frontmatter) {
      page.frontmatter = {
        ...page.frontmatter,
        ...typedocPageIndexData[apiDirName].frontmatter,
      };
    }
  });

  // Rewrite all of the internal links
  // - root relative for compatibility with Next.js
  // - strip the .mdx extension
  app.renderer.on(td.MarkdownPageEvent.END, (page) => {
    if (!page.contents) return;

    // Slice in the index data (when desired)
    if (page.url == "index.mdx" && typedocPageIndexData[apiDirName]?.contents) {
      page.contents = insertAfterFrontmatter(page.contents, typedocPageIndexData[apiDirName].contents);
    }

    page.contents = page.contents.replace(/\(((?:[^\/\)]+\/)*[^\/\)]+)\.mdx\)/gm, (_, path) => {
      // Remove trailing /index routes
      if (path.endsWith("/index")) path = path.replace(/\/index$/gi, "");

      const rootRelativeUrl = resolve(`/api/${apiDirName}`, dirname(page.url), path);
      return `(${rootRelativeUrl})`;
    });
  });
}

function insertAfterFrontmatter(markdownText, textToInsert) {
  if (!markdownText.startsWith("---")) {
    return textToInsert + markdownText;
  }

  const secondDelimiter = markdownText.indexOf("\n---\n", 4);
  if (secondDelimiter === -1) {
    return textToInsert + markdownText;
  }

  const frontmatter = markdownText.substring(0, secondDelimiter + 5);
  const content = markdownText.substring(secondDelimiter + 5);

  return frontmatter + `\n${textToInsert}\n` + content;
}
