import { z } from "zod";

export const SkillMetadataSchema = z.object({
  name: z.string(),
  description: z.string(),
  version: z.string(),
  author: z.string().optional(),
  license: z.string().optional(),
});

export type SkillMetadata = z.infer<typeof SkillMetadataSchema>;

export interface Skill {
  id: string;
  metadata: SkillMetadata;
  path: string;
  isInstalled: boolean;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  path: string;
  isInstalled: boolean;
}

export const PRESETS = {
  nextjs: {
    name: "Next.js Full Stack",
    skills: [
      "react-19",
      "nextjs",
      "typescript",
      "tailwind-4",
      "zod-4",
      "structuring-projects",
    ],
    agents: ["planner", "reviewer"],
  },
  react: {
    name: "React SPA",
    skills: [
      "react-19",
      "typescript",
      "tailwind-4",
      "zod-4",
      "structuring-projects",
    ],
    agents: ["planner", "reviewer"],
  },
  node: {
    name: "Node.js Backend",
    skills: ["typescript", "zod-4", "structuring-projects"],
    agents: ["planner", "reviewer"],
  },
  full: {
    name: "All Skills",
    skills: [
      "react-19",
      "nextjs",
      "typescript",
      "tailwind-4",
      "zod-4",
      "forms",
      "supabase",
      "testing-vitest",
      "structuring-projects",
      "skill-creator",
      "skill-integrator",
    ],
    agents: ["planner", "reviewer"],
  },
} as const;

export type PresetId = keyof typeof PRESETS;
