import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Digital Wedding Invitations`,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FCFBF7",
    theme_color: "#073D31",
    icons: [
      {
        src: siteConfig.assets.icon,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: siteConfig.assets.icon,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
