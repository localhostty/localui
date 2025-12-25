import { defineConfig } from "@solidjs/start/config";
import { withSolidBase } from "@kobalte/solidbase/config";

export default defineConfig(
  withSolidBase(
    // SolidStart config
    {
      server: {
        prerender: {
          crawlLinks: true,
        },
      },
    },
    // SolidBase config
    {
      title: "LocalUI",
      titleTemplate: ":title - LocalUI",
      description: "Primitive UI Library for SolidJS",
      themeConfig: {
        sidebar: {
          "/": {
            items: [
              {
                title: "Overview",
                collapsed: false,
                items: [
                  {
                    title: "About",
                    link: "/about",
                  },
                ],
              },
              {
                title: "Primitives",
                collapsed: false,
                items: [
                  {
                    title: "Collapsible",
                    link: "/collapsible",
                  },
                  {
                    title: "Button",
                    link: "/button",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  ),
);
