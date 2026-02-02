import type { Command } from "commander";
import type { EditorId } from "../core/types/editor.types.js";
import type { InitOptions } from "../core/types/config.types.js";
import { runInitWizard } from "../wizards/init-wizard.js";
import { handleError } from "../shared/errors/cli-error.js";

interface InitCommandOptions {
  editor?: string;
  preset?: string;
  yes?: boolean;
}

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize skills in your project")
    .option(
      "-e, --editor <editor>",
      "Target editor (claude, cursor, copilot, antigravity)"
    )
    .option(
      "-p, --preset <preset>",
      "Use a preset (nextjs, react, node, full)"
    )
    .option("-y, --yes", "Skip prompts and use defaults")
    .action(async (cmdOptions: InitCommandOptions) => {
      try {
        const options: InitOptions = {
          editor: cmdOptions.editor as EditorId | undefined,
          preset: cmdOptions.preset,
          yes: cmdOptions.yes,
        };

        await runInitWizard(options);
      } catch (error) {
        handleError(error);
      }
    });
}
