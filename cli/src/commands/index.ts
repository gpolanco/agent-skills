import { Command } from "commander";
import { registerInitCommand } from "./init.js";

const program = new Command();

program
  .name("skills")
  .description("CLI for managing AI agent skills")
  .version("0.1.0");

// Register commands
registerInitCommand(program);

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
