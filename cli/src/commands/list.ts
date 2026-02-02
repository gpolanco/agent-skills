import type { Command } from "commander";
import { join } from "node:path";

import { readConfig } from "../core/services/config-service.js";
import {
  downloadRepository,
  getAvailableSkills,
  getInstalledSkills,
  cleanupTemp,
} from "../core/services/skill-service.js";
import {
  startSpinner,
  succeedSpinner,
  failSpinner,
  info,
} from "../shared/ui/spinner.js";
import { handleError, NotInitializedError } from "../shared/errors/cli-error.js";

interface ListOptions {
  local?: boolean;
}

export function registerListCommand(program: Command): void {
  program
    .command("list")
    .description("List available and installed skills")
    .option("-l, --local", "Show only locally installed skills")
    .action(async (options: ListOptions) => {
      try {
        await listSkills(options);
      } catch (error) {
        handleError(error);
      }
    });
}

async function listSkills(options: ListOptions): Promise<void> {
  const cwd = process.cwd();
  const config = await readConfig(cwd);

  if (options.local) {
    // Show only locally installed skills
    if (!config) {
      throw new NotInitializedError();
    }

    const skillsDir = join(cwd, config.skills.directory);
    const installed = await getInstalledSkills(skillsDir);

    if (installed.length === 0) {
      info("No skills installed. Run 'skills add <skill>' to add one.");
      return;
    }

    console.log("\n  Installed Skills\n");
    for (const skillId of installed) {
      const isActive = config.skills.active.includes(skillId);
      const status = isActive ? "✅" : "📦";
      console.log(`  ${status} ${skillId}`);
    }
    console.log();
  } else {
    // Show all available skills from catalog
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
      const installedIds = config?.skills.active ?? [];

      console.log("\n  Available Skills\n");
      console.log("  Status  ID                    Description");
      console.log("  ──────  ────────────────────  ─────────────────────────────────");

      for (const skill of availableSkills) {
        const isInstalled = installedIds.includes(skill.id);
        const status = isInstalled ? "✅" : "📦";
        const id = skill.id.padEnd(20);
        const desc = (skill.metadata.description || "").slice(0, 35);
        console.log(`  ${status}      ${id}  ${desc}`);
      }

      console.log();
      console.log("  ✅ = installed   📦 = available");
      console.log();

      await cleanupTemp(repoPath);
    } catch (error) {
      await cleanupTemp(repoPath);
      throw error;
    }
  }
}
