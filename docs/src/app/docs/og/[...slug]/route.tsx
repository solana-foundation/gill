import { readFileSync } from "node:fs";
import { generateOGImage } from "./og";
import { docsSource } from "@/lib/source";
import { notFound } from "next/navigation";

const font = readFileSync("./src/app/docs/og/[...slug]/Inter_24pt-Regular.ttf");
const fontBold = readFileSync("./src/app/docs/og/[...slug]/Inter_24pt-SemiBold.ttf");

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const page = docsSource.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return generateOGImage({
    primaryTextColor: "rgb(240,240,240)",
    title: page.data.title,
    description: page.data.description,
    fonts: [
      {
        name: "Regular",
        data: font,
        weight: 400,
      },
      {
        name: "Regular",
        data: fontBold,
        weight: 600,
      },
    ],
  });
}

export function generateStaticParams(): {
  slug: string[];
}[] {
  return docsSource.generateParams().map((page) => ({
    ...page,
    slug: [...page.slug, "image.png"],
  }));
}
