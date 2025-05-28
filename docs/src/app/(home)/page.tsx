import { PackageBadges } from "@/components/package-badges";
import { siteConfig } from "@/const";
import icon from "@@/public/icon-black.svg";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import { BookTextIcon, MoveRightIcon, ShapesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="flex flex-1 flex-col justify-center p-4 space-y-6">
      <h1 className="mb-4 text-5xl font-bold mx-auto">
        <Link href={"/"} className="inline-flex items-center gap-2">
          <Image src={icon} alt={""} className="dark:invert size-16"></Image> {siteConfig.name}
        </Link>
      </h1>

      <section className="space-y-3 mx-auto text-center">
        <p className="text-fd-muted-foreground max-w-md">
          gill is a modern javascript/typescript client library for interacting with the Solana
          blockchain
        </p>

        <PackageBadges packageName="gill" />
      </section>

      <Tabs items={["npm", "pnpm", "yarn", "bun"]} className="mx-auto rounded-lg max-w-md w-full">
        <Tab value="npm">
          <CodeBlock>
            <Pre>npm install gill</Pre>
          </CodeBlock>
        </Tab>
        <Tab value="pnpm">
          <CodeBlock>
            <Pre>pnpm add gill</Pre>
          </CodeBlock>
        </Tab>
        <Tab value="yarn">
          <CodeBlock>
            <Pre>yarn add gill</Pre>
          </CodeBlock>
        </Tab>
        <Tab value="bun">
          <CodeBlock>
            <Pre>bun install gill</Pre>
          </CodeBlock>
        </Tab>
      </Tabs>

      <Link href="/docs" className="text-center link inline-flex items-center justify-center gap-2">
        Read the quickstart guide
        {/* <MoveRightIcon strokeWidth={1.0} /> */}
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
