import { BookTextIcon, CodeXmlIcon, MoveRightIcon, ShapesIcon } from "lucide-react";
import Link from "next/link";

export function FooterLinks() {
  return (
    <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
      <Link
        className="inline-flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/api"
      >
        <CodeXmlIcon strokeWidth={1.0} size={18} />
        API Reference
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/docs/guides"
      >
        <ShapesIcon strokeWidth={1.0} size={18} />
        Guides
      </Link>
      <Link
        className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        href="/docs"
      >
        <BookTextIcon strokeWidth={1.0} size={18} />
        Docs
        <MoveRightIcon strokeWidth={1.0} />
      </Link>
    </footer>
  );
}
