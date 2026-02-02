import { select, checkbox, confirm, input } from "@inquirer/prompts";
import pc from "picocolors";
import { EDITORS, type EditorId } from "../../core/types/editor.types.js";
import { PRESETS, type PresetId } from "../../core/types/skill.types.js";
import type { Skill, Agent } from "../../core/types/skill.types.js";

export async function selectEditor(): Promise<EditorId> {
  const choices = Object.entries(EDITORS).map(([id, config]) => ({
    name: config.name,
    value: id as EditorId,
    description: `Skills in ${config.skillsPath}`,
  }));

  return select({
    message: "Which AI editor are you using?",
    choices,
    default: "claude",
  });
}

export async function selectPreset(): Promise<PresetId | "custom"> {
  const choices = [
    ...Object.entries(PRESETS).map(([id, config]) => ({
      name: `${config.name} (${config.skills.length} skills)`,
      value: id as PresetId,
      description: config.skills.join(", "),
    })),
    {
      name: "Custom selection",
      value: "custom" as const,
      description: "Choose individual skills",
    },
  ];

  return select({
    message: "Choose a preset or customize:",
    choices,
    default: "nextjs",
  });
}

export async function selectSkills(
  available: Skill[],
  recommended: string[]
): Promise<string[]> {
  const choices = available.map((skill) => {
    const isRecommended = recommended.includes(skill.id);
    return {
      name: isRecommended
        ? `${skill.id} ${pc.cyan("(recommended)")}`
        : skill.id,
      value: skill.id,
      checked: isRecommended,
      description: skill.metadata.description.slice(0, 60),
    };
  });

  return checkbox({
    message: "Select skills to install:",
    choices,
    required: true,
  });
}

export async function selectAgents(available: Agent[]): Promise<string[]> {
  const choices = available.map((agent) => ({
    name: agent.name,
    value: agent.id,
    checked: true,
    description: agent.description,
  }));

  return checkbox({
    message: "Select agents to install:",
    choices,
  });
}

export async function confirmInstall(summary: {
  editor: string;
  skillCount: number;
  agentCount: number;
  skillsPath: string;
}): Promise<boolean> {
  console.log("");
  console.log(pc.bold("Installation Summary:"));
  console.log(`  Editor:     ${pc.cyan(summary.editor)}`);
  console.log(`  Skills:     ${pc.green(summary.skillCount.toString())} selected`);
  console.log(`  Agents:     ${pc.green(summary.agentCount.toString())} selected`);
  console.log(`  Location:   ${pc.dim(summary.skillsPath)}`);
  console.log("");

  return confirm({
    message: "Proceed with installation?",
    default: true,
  });
}

export async function askProjectName(): Promise<string> {
  return input({
    message: "Project name:",
    default: "my-project",
  });
}

export function printWelcome(): void {
  console.log("");
  console.log(pc.bold(pc.cyan("  Skills as Context")));
  console.log(pc.dim("  AI Agent Skills Manager"));
  console.log("");
}

export function printSuccess(skillsPath: string): void {
  console.log("");
  console.log(pc.green(pc.bold("  Installation complete!")));
  console.log("");
  console.log("  Next steps:");
  console.log(`    1. Review installed skills in ${pc.cyan(skillsPath)}`);
  console.log(`    2. Check ${pc.cyan("AGENTS.md")} for configuration`);
  console.log(`    3. Start coding with your AI assistant!`);
  console.log("");
  console.log(pc.dim('  Tip: Run "skills list" to see installed skills'));
  console.log("");
}

export function printDetectedStack(stack: Record<string, unknown>): void {
  const detected = Object.entries(stack)
    .filter(([key, value]) => value === true && key !== "packageManager")
    .map(([key]) => key.replace("has", ""));

  if (detected.length > 0) {
    console.log("");
    console.log(
      pc.dim("  Detected: ") + detected.map((d) => pc.cyan(d)).join(", ")
    );
  }
}
