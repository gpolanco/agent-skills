import { readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";
import { ConfigFileSchema, type ConfigFile } from "../types/config.types.js";
import { EDITORS, type EditorId } from "../types/editor.types.js";

const CONFIG_FILE_NAME = ".skillsrc.json";

export async function configExists(cwd: string = process.cwd()): Promise<boolean> {
  try {
    await access(join(cwd, CONFIG_FILE_NAME));
    return true;
  } catch {
    return false;
  }
}

export async function readConfig(cwd: string = process.cwd()): Promise<ConfigFile | null> {
  try {
    const configPath = join(cwd, CONFIG_FILE_NAME);
    const content = await readFile(configPath, "utf-8");
    const parsed = JSON.parse(content);
    return ConfigFileSchema.parse(parsed);
  } catch {
    return null;
  }
}

export async function writeConfig(
  config: ConfigFile,
  cwd: string = process.cwd()
): Promise<void> {
  const configPath = join(cwd, CONFIG_FILE_NAME);
  const validated = ConfigFileSchema.parse(config);
  await writeFile(configPath, JSON.stringify(validated, null, 2) + "\n", "utf-8");
}

export function createDefaultConfig(
  editor: EditorId,
  skills: string[],
  agents: string[] = ["planner", "reviewer"]
): ConfigFile {
  const editorConfig = EDITORS[editor];

  return {
    version: "1.0.0",
    editor,
    skills: {
      directory: editorConfig.skillsPath,
      active: skills,
    },
    agents: {
      directory: editorConfig.agentsPath,
      active: agents,
    },
    memory: {
      enabled: true,
      directory: "docs/agent",
    },
    source: {
      repo: "gpolanco/skills-as-context",
      branch: "main",
    },
  };
}

export async function addSkillToConfig(
  skillId: string,
  cwd: string = process.cwd()
): Promise<boolean> {
  const config = await readConfig(cwd);
  if (!config) return false;

  if (!config.skills.active.includes(skillId)) {
    config.skills.active.push(skillId);
    await writeConfig(config, cwd);
  }

  return true;
}

export async function removeSkillFromConfig(
  skillId: string,
  cwd: string = process.cwd()
): Promise<boolean> {
  const config = await readConfig(cwd);
  if (!config) return false;

  const index = config.skills.active.indexOf(skillId);
  if (index > -1) {
    config.skills.active.splice(index, 1);
    await writeConfig(config, cwd);
  }

  return true;
}
