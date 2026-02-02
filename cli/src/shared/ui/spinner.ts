import ora, { type Ora } from "ora";
import pc from "picocolors";

let currentSpinner: Ora | null = null;

export function startSpinner(text: string): Ora {
  stopSpinner();
  currentSpinner = ora({ text, color: "cyan" }).start();
  return currentSpinner;
}

export function updateSpinner(text: string): void {
  if (currentSpinner) {
    currentSpinner.text = text;
  }
}

export function succeedSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.succeed(text);
    currentSpinner = null;
  }
}

export function failSpinner(text?: string): void {
  if (currentSpinner) {
    currentSpinner.fail(text);
    currentSpinner = null;
  }
}

export function stopSpinner(): void {
  if (currentSpinner) {
    currentSpinner.stop();
    currentSpinner = null;
  }
}

export function info(message: string): void {
  stopSpinner();
  console.log(pc.cyan("ℹ"), message);
}

export function success(message: string): void {
  stopSpinner();
  console.log(pc.green("✔"), message);
}

export function warning(message: string): void {
  stopSpinner();
  console.log(pc.yellow("⚠"), message);
}

export function error(message: string): void {
  stopSpinner();
  console.log(pc.red("✖"), message);
}

export function dim(message: string): string {
  return pc.dim(message);
}

export function bold(message: string): string {
  return pc.bold(message);
}

export function cyan(message: string): string {
  return pc.cyan(message);
}

export function green(message: string): string {
  return pc.green(message);
}
