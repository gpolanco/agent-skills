import { Command } from "commander";
import { registerInitCommand } from "./init.js";
import { registerListCommand } from "./list.js";
import { registerAddCommand } from "./add.js";
import { registerRemoveCommand } from "./remove.js";

const program = new Command();

program
  .name("skills")
  .description("CLI for managing AI agent skills")
  .version("0.1.0");

// Register commands
registerInitCommand(program);
registerListCommand(program);
registerAddCommand(program);
registerRemoveCommand(program);

program.parse();
