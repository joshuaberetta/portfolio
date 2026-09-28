// Typed view of src/content.yaml, which is loaded by the yaml-content plugin
// in vite.config.ts. Asset file names arrive here already resolved to URLs.
import content from "../content.yaml";

export type LinkIcon = "email" | "github" | "linkedin" | "flickr";

export interface SiteContent {
  site: { title: string; name: string };
  profile: {
    image: string;
    details: { label: string; value: string }[];
  };
  research: {
    title: string;
    items: {
      title: string;
      detail?: string;
      file: string;
      fileName: string;
      button: string;
    }[];
  };
  links: { icon: LinkIcon; href: string }[];
}

export const SITE = content as SiteContent;
