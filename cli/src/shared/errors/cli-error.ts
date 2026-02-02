import pc from "picocolors";

export class CliError extends Error {
  constructor(
    message: string,
    public readonly code: string = "CLI_ERROR",
    public readonly suggestions?: string[]
  ) {
    super(message);
    this.name = "CliError";
  }

  print(): void {
    console.error("");
    console.error(pc.red(pc.bold("Error:")), this.message);

    if (this.suggestions && this.suggestions.length > 0) {
      console.error("");
      console.error(pc.dim("Suggestions:"));
      for (const suggestion of this.suggestions) {
        console.error(pc.dim(`  • ${suggestion}`));
      }
    }
    console.error("");
  }
}

export class ConfigNotFoundError extends CliError {
  constructor() {
    super(
      "No .skillsrc.json found in current directory",
      "CONFIG_NOT_FOUND",
      ['Run "skills init" to initialize your project']
    );
  }
}

export class SkillNotFoundError extends CliError {
  constructor(skillId: string) {
    super(`Skill "${skillId}" not found`, "SKILL_NOT_FOUND", [
      'Run "skills list" to see available skills',
      "Check the skill name for typos",
    ]);
  }
}

export class NetworkError extends CliError {
  constructor(message: string = "Failed to connect to GitHub") {
    super(message, "NETWORK_ERROR", [
      "Check your internet connection",
      "Try again in a few moments",
    ]);
  }
}

export class AlreadyInitializedError extends CliError {
  constructor() {
    super(
      "This project is already initialized (.skillsrc.json exists)",
      "ALREADY_INITIALIZED",
      [
        'Run "skills add <skill>" to add more skills',
        'Run "skills list" to see installed skills',
        "Delete .skillsrc.json to reinitialize",
      ]
    );
  }
}

export class NotInitializedError extends CliError {
  constructor() {
    super(
      "This project is not initialized",
      "NOT_INITIALIZED",
      ['Run "skills init" first to initialize your project']
    );
  }
}

export function handleError(error: unknown): never {
  if (error instanceof CliError) {
    error.print();
  } else if (error instanceof Error) {
    console.error("");
    console.error(pc.red(pc.bold("Unexpected error:")), error.message);
    console.error("");
  } else {
    console.error("");
    console.error(pc.red(pc.bold("Unknown error occurred")));
    console.error("");
  }

  process.exit(1);
}
