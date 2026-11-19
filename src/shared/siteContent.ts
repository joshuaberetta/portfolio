// Typed view of src/content.yaml, which is loaded by the yaml-content plugin
// in vite.config.ts. Asset file names arrive here already resolved to URLs.
import content from "../content.yaml";

export interface Section {
  key: string;
  label: string;
  hint?: string;
  body: string;
  files?: { file: string; fileName: string; fileSize: number; label: string }[];
  /** Country names for a world map under the body, "Country (note)" allowed. */
  map?: { lived: string[]; visited: string[] };
}

export interface SiteContent {
  site: { title: string; cv?: string };
  header: {
    image: string;
    name: string;
    version: string;
    subtitle: string;
    path: string;
  };
  banner: string;
  intro: { prompt: string; section: string };
  window: string;
  sections: Section[];
}

export const SITE = content as SiteContent;
