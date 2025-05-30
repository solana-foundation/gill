import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookTextIcon, CodeXmlIcon, ShapesIcon } from "lucide-react";
import Image from "next/image";

import icon from "@@/public/icon-black.svg";
import { siteConfig } from "@/const";

/**
 * Shared layout configurations
 *
 * you can customize layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image src={icon} alt="" className="dark:invert size-9"></Image>{" "}
        <span className="text-xl font-bold">{siteConfig.name}</span>
      </>
    ),
  },
  links: [
    {
      text: "Documentation",
      url: "/docs",
      active: "nested-url",
      icon: <BookTextIcon />,
    },
    {
      text: "Guides",
      url: "/guides",
      active: "nested-url",
      icon: <ShapesIcon />,
    },
    {
      text: "API Reference",
      url: "/api",
      active: "nested-url",
      icon: <CodeXmlIcon />,
    },
  ],
};
