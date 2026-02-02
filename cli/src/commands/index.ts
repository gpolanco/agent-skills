import { Command } from "commander";

const program = new Command();

program
  .name("skills")
  .description("CLI for managing AI agent skills")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize skills in your project")
  .option("-e, --editor <editor>", "Target editor (claude, cursor, copilot, antigravity)")
  .option("-p, --preset <preset>", "Use a preset (nextjs, react, node, full)")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(async (options) => {
    console.log("Init command - to be implemented in Phase 2");
    console.log("Options:", options);
  });

program
  .command("list")
  .description("List available and installed skills")
  .option("-l, --local", "Show only locally installed skills")
  .action(async (options) => {
    console.log("List command - to be implemented in Phase 3");
    console.log("Options:", options);
  });

program
  .command("add <skill>")
  .description("Add a skill to your project")
  .action(async (skill) => {
    console.log(`Add command for ${skill} - to be implemented in Phase 3`);
  });

program
  .command("remove <skill>")
  .description("Remove a skill from your project")
  .action(async (skill) => {
    console.log(`Remove command for ${skill} - to be implemented in Phase 3`);
  });

program.parse();
