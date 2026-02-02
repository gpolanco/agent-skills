import { mkdir, cp, rm, readdir, access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import type { Skill, Agent, SkillMetadata } from "../types/skill.types.js";

const execAsync = promisify(exec);

const REPO_URL = "https://github.com/gpolanco/skills-as-context";
const CONTENT_PATH = "content";

export interface DownloadOptions {
  repo?: string;
  branch?: string;
}

export async function downloadRepository(
  options: DownloadOptions = {}
): Promise<string> {
  const { repo = "gpolanco/skills-as-context", branch = "main" } = options;
  const tempDir = join(tmpdir(), `skills-${Date.now()}`);
  const zipUrl = `https://github.com/${repo}/archive/refs/heads/${branch}.zip`;

  await mkdir(tempDir, { recursive: true });

  const zipPath = join(tempDir, "repo.zip");
  await execAsync(`curl -sSL "${zipUrl}" -o "${zipPath}"`);
  await execAsync(`unzip -q "${zipPath}" -d "${tempDir}"`);

  // Find extracted folder (usually repo-name-branch)
  const entries = await readdir(tempDir);
  const extractedDir = entries.find((e) => e !== "repo.zip");

  if (!extractedDir) {
    throw new Error("Failed to extract repository");
  }

  return join(tempDir, extractedDir);
}

export async function getAvailableSkills(repoPath: string): Promise<Skill[]> {
  const skillsPath = join(repoPath, CONTENT_PATH, "skills");
  const entries = await readdir(skillsPath, { withFileTypes: true });

  const skills: Skill[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "README.md") continue;

    const skillPath = join(skillsPath, entry.name);
    const metadata = await parseSkillMetadata(skillPath);

    if (metadata) {
      skills.push({
        id: entry.name,
        metadata,
        path: skillPath,
        isInstalled: false,
      });
    }
  }

  return skills;
}

export async function getAvailableAgents(repoPath: string): Promise<Agent[]> {
  const agentsPath = join(repoPath, CONTENT_PATH, "agents");
  const entries = await readdir(agentsPath, { withFileTypes: true });

  const agents: Agent[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === "README.md") continue;

    agents.push({
      id: entry.name,
      name: entry.name.charAt(0).toUpperCase() + entry.name.slice(1),
      description: `${entry.name} agent`,
      path: join(agentsPath, entry.name),
      isInstalled: false,
    });
  }

  return agents;
}

async function parseSkillMetadata(skillPath: string): Promise<SkillMetadata | null> {
  try {
    const skillFile = join(skillPath, "SKILL.md");
    const content = await readFile(skillFile, "utf-8");

    // Parse YAML frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match?.[1]) return null;

    const frontmatter = match[1];
    const lines = frontmatter.split("\n");

    const metadata: Record<string, string> = {};
    let currentKey = "";
    let currentValue = "";

    for (const line of lines) {
      if (line.match(/^\w+:/)) {
        if (currentKey) {
          metadata[currentKey] = currentValue.trim();
        }
        const [key, ...rest] = line.split(":");
        currentKey = key ?? "";
        currentValue = rest.join(":").trim();
      } else if (currentKey && line.startsWith("  ")) {
        currentValue += " " + line.trim();
      }
    }

    if (currentKey) {
      metadata[currentKey] = currentValue.trim();
    }

    return {
      name: metadata["name"] ?? "",
      description: (metadata["description"] ?? "").replace(/^>?\s*/, ""),
      version: metadata["version"]?.replace(/"/g, "") ?? "1.0.0",
      author: metadata["author"],
      license: metadata["license"],
    };
  } catch {
    return null;
  }
}

export async function installSkill(
  skill: Skill,
  targetDir: string
): Promise<void> {
  const destPath = join(targetDir, skill.id);
  await mkdir(destPath, { recursive: true });
  await cp(skill.path, destPath, { recursive: true });
}

export async function installAgent(
  agent: Agent,
  targetDir: string
): Promise<void> {
  const destPath = join(targetDir, agent.id);
  await mkdir(destPath, { recursive: true });
  await cp(agent.path, destPath, { recursive: true });
}

export async function removeSkill(
  skillId: string,
  skillsDir: string
): Promise<boolean> {
  const skillPath = join(skillsDir, skillId);

  try {
    await access(skillPath);
    await rm(skillPath, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

export async function getInstalledSkills(skillsDir: string): Promise<string[]> {
  try {
    const entries = await readdir(skillsDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name);
  } catch {
    return [];
  }
}

export async function cleanupTemp(tempPath: string): Promise<void> {
  try {
    // Go up one level to remove the temp directory
    const parentDir = join(tempPath, "..");
    await rm(parentDir, { recursive: true });
  } catch {
    // Ignore cleanup errors
  }
}
