import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";
import { examplesSource } from "@/lib/source";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      // tree={{
      //     ...examplesSource.pageTree,
      //     children: examplesSource.pageTree.children.filter(node => node.type !== 'page' || node.url !== '/api'),
      // }}
      tree={examplesSource.pageTree}
      {...baseOptions}
    >
      {children}
    </DocsLayout>
  );
}
