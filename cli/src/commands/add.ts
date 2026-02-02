import type { Command } from "commander";
import { join } from "node:path";

import { readConfig, addSkillToConfig } from "../core/services/config-service.js";
import {
  downloadRepository,
  getAvailableSkills,
  installSkill,
  cleanupTemp,
} from "../core/services/skill-service.js";
import {
  startSpinner,
  succeedSpinner,
  failSpinner,
  success,
  warning,
} from "../shared/ui/spinner.js";
import { handleError, NotInitializedError } from "../shared/errors/cli-error.js";

export function registerAddCommand(program: Command): void {
  program
    .command("add <skill>")
    .description("Add a skill to your project")
    .action(async (skillId: string) => {
      try {
        await addSkill(skillId);
      } catch (error) {
        handleError(error);
      }
    });
}

async function addSkill(skillId: string): Promise<void> {
  const cwd = process.cwd();
  const config = await readConfig(cwd);

  if (!config) {
    throw new NotInitializedError();
  }

  // Check if already installed
  if (config.skills.active.includes(skillId)) {
    warning(`Skill "${skillId}" is already installed.`);
    return;
  }

  // Download catalog
  startSpinner("Fetching skills catalog...");

  let repoPath: string;
  try {
    repoPath = await downloadRepository();
    succeedSpinner("Skills catalog loaded");
  } catch {
    failSpinner("Failed to fetch skills catalog");
    throw new Error("Could not fetch skills catalog. Check your internet connection.");
  }

  try {
    const availableSkills = await getAvailableSkills(repoPath);
    const skill = availableSkills.find((s) => s.id === skillId);

    if (!skill) {
      await cleanupTemp(repoPath);
      throw new Error(
        `Skill "${skillId}" not found. Run 'skills list' to see available skills.`
      );
    }

    // Install skill
    startSpinner(`Installing ${skillId}...`);

    const skillsDir = join(cwd, config.skills.directory);
    await installSkill(skill, skillsDir);

    succeedSpinner(`Installed ${skillId}`);

    // Update config
    await addSkillToConfig(skillId, cwd);

    await cleanupTemp(repoPath);

    success(`\n  Skill "${skillId}" added successfully!\n`);
  } catch (error) {
    await cleanupTemp(repoPath);
    throw error;
  }
}
