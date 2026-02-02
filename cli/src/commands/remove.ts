import type { Command } from "commander";
import { join } from "node:path";

import { readConfig, removeSkillFromConfig } from "../core/services/config-service.js";
import { removeSkill as removeSkillFromDisk } from "../core/services/skill-service.js";
import { success, warning } from "../shared/ui/spinner.js";
import { handleError, NotInitializedError } from "../shared/errors/cli-error.js";

export function registerRemoveCommand(program: Command): void {
  program
    .command("remove <skill>")
    .description("Remove a skill from your project")
    .action(async (skillId: string) => {
      try {
        await removeSkillAction(skillId);
      } catch (error) {
        handleError(error);
      }
    });
}

async function removeSkillAction(skillId: string): Promise<void> {
  const cwd = process.cwd();
  const config = await readConfig(cwd);

  if (!config) {
    throw new NotInitializedError();
  }

  // Check if installed
  if (!config.skills.active.includes(skillId)) {
    warning(`Skill "${skillId}" is not installed.`);
    return;
  }

  // Remove from disk
  const skillsDir = join(cwd, config.skills.directory);
  const removed = await removeSkillFromDisk(skillId, skillsDir);

  if (!removed) {
    warning(`Could not find skill "${skillId}" on disk, but removing from config.`);
  }

  // Update config
  await removeSkillFromConfig(skillId, cwd);

  success(`\n  Skill "${skillId}" removed successfully!\n`);
}
