export const EDITORS = {
  claude: {
    name: "Claude Code",
    skillsPath: ".claude/skills",
    agentsPath: ".claude/agents",
    configFiles: ["CLAUDE.md"],
    supportsNativeSkills: true,
  },
  cursor: {
    name: "Cursor",
    skillsPath: ".cursor/skills",
    agentsPath: ".cursor/agents",
    configFiles: [".cursor/rules/skills.mdc", ".cursorrules"],
    supportsNativeSkills: false,
  },
  copilot: {
    name: "GitHub Copilot",
    skillsPath: ".github/skills",
    agentsPath: ".github/agents",
    configFiles: [".github/copilot-instructions.md"],
    supportsNativeSkills: false,
  },
  gemini: {
    name: "Gemini",
    skillsPath: ".gemini/skills",
    agentsPath: ".gemini/agents",
    configFiles: [".gemini/styleguide.md", ".gemini/config.yaml"],
    supportsNativeSkills: false,
  },
} as const;

export type EditorId = keyof typeof EDITORS;

export interface EditorConfig {
  name: string;
  skillsPath: string;
  agentsPath: string;
  configFiles: readonly string[];
  supportsNativeSkills: boolean;
}
