import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import type { EditorId } from "../core/types/editor.types.js";
import { EDITORS } from "../core/types/editor.types.js";
import { PRESETS, type PresetId } from "../core/types/skill.types.js";
import type { InitOptions } from "../core/types/config.types.js";

import {
  detectStack,
  getRecommendedSkills,
} from "../core/services/detection-service.js";
import {
  configExists,
  createDefaultConfig,
  writeConfig,
} from "../core/services/config-service.js";
import {
  downloadRepository,
  getAvailableSkills,
  getAvailableAgents,
  installSkill,
  installAgent,
  cleanupTemp,
} from "../core/services/skill-service.js";

import {
  printWelcome,
  printDetectedStack,
  printSuccess,
  selectEditor,
  selectPreset,
  selectSkills,
  selectAgents,
  confirmInstall,
} from "../shared/ui/prompts.js";
import {
  startSpinner,
  succeedSpinner,
  failSpinner,
  info,
  success,
  warning,
} from "../shared/ui/spinner.js";
import { AlreadyInitializedError, NetworkError } from "../shared/errors/cli-error.js";

export interface WizardResult {
  editor: EditorId;
  skills: string[];
  agents: string[];
  skillsPath: string;
  agentsPath: string;
}

export async function runInitWizard(
  options: InitOptions,
  cwd: string = process.cwd()
): Promise<WizardResult> {
  // Check if already initialized
  if (await configExists(cwd)) {
    throw new AlreadyInitializedError();
  }

  printWelcome();

  // Step 1: Detect stack
  const stack = await detectStack(cwd);
  printDetectedStack(stack as unknown as Record<string, unknown>);
  const recommendedSkills = getRecommendedSkills(stack);

  // Step 2: Select editor
  const editor = options.editor ?? (await selectEditor());
  const editorConfig = EDITORS[editor];

  // Step 3: Download repository to get available skills
  startSpinner("Fetching skills catalog...");
  let repoPath: string;

  try {
    repoPath = await downloadRepository();
    succeedSpinner("Skills catalog loaded");
  } catch (err) {
    failSpinner("Failed to fetch skills catalog");
    throw new NetworkError();
  }

  try {
    // Get available skills and agents
    const availableSkills = await getAvailableSkills(repoPath);
    const availableAgents = await getAvailableAgents(repoPath);

    // Step 4: Select skills (preset or custom)
    let selectedSkills: string[];

    if (options.preset) {
      const preset = PRESETS[options.preset as PresetId];
      if (preset) {
        selectedSkills = [...preset.skills];
        info(`Using preset: ${preset.name}`);
      } else {
        warning(`Unknown preset "${options.preset}", using custom selection`);
        selectedSkills = await selectSkills(availableSkills, recommendedSkills);
      }
    } else if (options.yes) {
      // Non-interactive: use recommended or nextjs preset
      selectedSkills =
        recommendedSkills.length > 0
          ? recommendedSkills
          : [...PRESETS.nextjs.skills];
      info(`Auto-selected ${selectedSkills.length} skills`);
    } else {
      const presetChoice = await selectPreset();

      if (presetChoice === "custom") {
        selectedSkills = await selectSkills(availableSkills, recommendedSkills);
      } else {
        selectedSkills = [...PRESETS[presetChoice].skills];
      }
    }

    // Step 5: Select agents
    let selectedAgents: string[];

    if (options.agents) {
      selectedAgents = options.agents;
    } else if (options.yes) {
      selectedAgents = ["planner", "reviewer"];
    } else {
      selectedAgents = await selectAgents(availableAgents);
    }

    // Step 6: Confirm
    const skillsPath = editorConfig.skillsPath;
    const agentsPath = editorConfig.agentsPath;

    if (!options.yes) {
      const confirmed = await confirmInstall({
        editor: editorConfig.name,
        skillCount: selectedSkills.length,
        agentCount: selectedAgents.length,
        skillsPath,
      });

      if (!confirmed) {
        info("Installation cancelled");
        await cleanupTemp(repoPath);
        process.exit(0);
      }
    }

    // Step 7: Install
    startSpinner("Installing skills...");

    // Create directories
    const fullSkillsPath = join(cwd, skillsPath);
    const fullAgentsPath = join(cwd, agentsPath);
    await mkdir(fullSkillsPath, { recursive: true });
    await mkdir(fullAgentsPath, { recursive: true });

    // Install skills
    for (const skillId of selectedSkills) {
      const skill = availableSkills.find((s) => s.id === skillId);
      if (skill) {
        await installSkill(skill, fullSkillsPath);
      }
    }

    succeedSpinner(`Installed ${selectedSkills.length} skills`);

    // Install agents
    if (selectedAgents.length > 0) {
      startSpinner("Installing agents...");

      for (const agentId of selectedAgents) {
        const agent = availableAgents.find((a) => a.id === agentId);
        if (agent) {
          await installAgent(agent, fullAgentsPath);
        }
      }

      succeedSpinner(`Installed ${selectedAgents.length} agents`);
    }

    // Step 8: Create config file
    startSpinner("Creating configuration...");

    const config = createDefaultConfig(editor, selectedSkills, selectedAgents);
    await writeConfig(config, cwd);

    // Create AGENTS.md if it doesn't exist
    await createAgentsMd(cwd, editor, selectedSkills);

    // Initialize agent memory structure
    await initializeAgentMemory(cwd);

    succeedSpinner("Configuration created");

    // Cleanup
    await cleanupTemp(repoPath);

    // Done!
    printSuccess(skillsPath);

    return {
      editor,
      skills: selectedSkills,
      agents: selectedAgents,
      skillsPath,
      agentsPath,
    };
  } catch (error) {
    await cleanupTemp(repoPath);
    throw error;
  }
}

async function createAgentsMd(
  cwd: string,
  editor: EditorId,
  skills: string[]
): Promise<void> {
  const agentsMdPath = join(cwd, "AGENTS.md");
  const editorConfig = EDITORS[editor];

  const content = `# AGENTS.md

## Editor
${editorConfig.name}

## Skills Location
\`${editorConfig.skillsPath}/\`

## Active Skills
${skills.map((s) => `- ${s}`).join("\n")}

## Agents Location
\`${editorConfig.agentsPath}/\`

## Agent Memory
\`docs/agent/\`

---

*Generated by skills-as-context CLI*
`;

  await writeFile(agentsMdPath, content, "utf-8");
}

async function initializeAgentMemory(cwd: string): Promise<void> {
  const memoryPath = join(cwd, "docs", "agent");
  const plansPath = join(memoryPath, "plans");

  await mkdir(plansPath, { recursive: true });

  // Create state.md
  const stateContent = `# State

## Now
- ...

## Next
- ...

## Blockers
- ...
`;
  await writeFile(join(memoryPath, "state.md"), stateContent, "utf-8");

  // Create decisions.md
  const decisionsContent = `# Decisions

## YYYY-MM-DD — <decision title>
- **Decision**: ...
- **Why**: ...
- **Impact**: ...
`;
  await writeFile(join(memoryPath, "decisions.md"), decisionsContent, "utf-8");
}
