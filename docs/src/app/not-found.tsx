import { BookTextIcon, MoveRightIcon, ShapesIcon } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function Page() {
  return (
    <main className="flex flex-1 flex-col justify-center p-4 space-y-6">
      <h1 className="mb-4 text-5xl font-bold mx-auto">Page not found</h1>

      <section className="space-y-3 mx-auto text-center">
        <p className="text-fd-muted-foreground max-w-md">
          The page you are looking for was not found. Instead, try exploring one of these links
          below.
        </p>
      </section>

      <Link href="/docs" className="text-center link inline-flex items-center justify-center gap-2">
        Read the quickstart guide
      </Link>

      <footer className="row-start-3 flex flex-wrap items-center justify-center gap-[24px]">
        {/* <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href=""
        >
          <FileTextIcon strokeWidth={1.0} size={18} />
          Learn
        </Link> */}
        <Link
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="/guides"
        >
          {/* <GraduationCapIcon strokeWidth={1.0} size={18} /> */}
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
    </main>
  );
}
