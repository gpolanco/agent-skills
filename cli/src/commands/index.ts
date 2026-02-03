import { Command } from "commander";
import { registerInitCommand } from "./init.js";
import { registerListCommand } from "./list.js";
import { registerAddCommand } from "./add.js";
import { registerRemoveCommand } from "./remove.js";

import { CLI_NAME } from "../core/constants.js";

const program = new Command();

program
  .name(CLI_NAME)
  .description("CLI for managing AI agent skills")
  .version("1.0.0");

// Register commands
registerInitCommand(program);
registerListCommand(program);
registerAddCommand(program);
registerRemoveCommand(program);

program.parse();
