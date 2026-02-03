import { z } from "zod";
import type { EditorId } from "./editor.types.js";
import { DEFAULT_REPO, DEFAULT_BRANCH } from "../constants.js";

export const ConfigFileSchema = z.object({
  version: z.string().default("1.0.0"),
  editor: z.enum(["claude", "cursor", "copilot", "antigravity"]),
  skills: z.object({
    directory: z.string(),
    active: z.array(z.string()),
  }),
  agents: z.object({
    directory: z.string(),
    active: z.array(z.string()),
  }),
  memory: z.object({
    enabled: z.boolean().default(true),
    directory: z.string().default("docs/agent"),
  }),
  source: z
    .object({
      repo: z.string().default(DEFAULT_REPO),
      branch: z.string().default(DEFAULT_BRANCH),
    })
    .optional(),
});

export type ConfigFile = z.infer<typeof ConfigFileSchema>;

export interface InitOptions {
  editor?: EditorId;
  preset?: string;
  skills?: string[];
  agents?: string[];
  memory?: boolean;
  yes?: boolean;
}
