import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { apiSource } from "@/lib/source";
import { Metadata } from "next";
import { siteConfig } from "@/const";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} API References`,
    template: `%s | ${siteConfig.name} API`,
  },
  description: siteConfig.description,
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout tree={apiSource.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  );
}
