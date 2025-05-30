import { FooterLinks } from "@/components/footer-links";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function Page() {
  return (
    <main className="flex flex-col justify-center flex-1 p-4 space-y-6">
      <h1 className="mx-auto mb-4 text-5xl font-bold">Page not found</h1>

      <section className="mx-auto space-y-3 text-center">
        <p className="max-w-md text-fd-muted-foreground">
          The page you are looking for was not found. Instead, try exploring one of these links
          below.
        </p>
      </section>

      <Link href="/docs" className="inline-flex items-center justify-center gap-2 text-center link">
        Read the quickstart guide
      </Link>

      <FooterLinks />
    </main>
  );
}
