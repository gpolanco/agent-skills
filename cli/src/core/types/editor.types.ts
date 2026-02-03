export const EDITORS = {
  claude: {
    name: "Claude Code",
    skillsPath: ".claude/skills",
    agentsPath: ".claude/agents",
    configFiles: ["AGENTS.md"],
  },
  cursor: {
    name: "Cursor",
    skillsPath: ".cursor/skills",
    agentsPath: ".cursor/agents",
    configFiles: ["AGENTS.md", ".cursorrules"],
  },
  copilot: {
    name: "GitHub Copilot",
    skillsPath: ".github/skills",
    agentsPath: ".github/agents",
    configFiles: ["AGENTS.md", ".github/copilot-instructions.md"],
  },
  antigravity: {
    name: "Antigravity (Gemini)",
    skillsPath: ".gemini/skills",
    agentsPath: ".gemini/agents",
    configFiles: ["AGENTS.md"],
  },
} as const;

export type EditorId = keyof typeof EDITORS;

export interface EditorConfig {
  name: string;
  skillsPath: string;
  agentsPath: string;
  configFiles: readonly string[];
}
