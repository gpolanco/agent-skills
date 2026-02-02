import { readFile } from "node:fs/promises";
import { join } from "node:path";

export interface DetectedStack {
  hasNext: boolean;
  hasReact: boolean;
  hasTailwind: boolean;
  hasTypescript: boolean;
  hasZod: boolean;
  hasSupabase: boolean;
  hasVitest: boolean;
  hasReactHookForm: boolean;
  packageManager: "npm" | "yarn" | "pnpm" | "bun" | null;
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageManager?: string;
}

const DETECTION_RULES: Record<keyof Omit<DetectedStack, "packageManager">, string[]> = {
  hasNext: ["next"],
  hasReact: ["react", "react-dom"],
  hasTailwind: ["tailwindcss"],
  hasTypescript: ["typescript"],
  hasZod: ["zod"],
  hasSupabase: ["@supabase/supabase-js", "@supabase/ssr"],
  hasVitest: ["vitest"],
  hasReactHookForm: ["react-hook-form"],
};

export async function detectStack(cwd: string = process.cwd()): Promise<DetectedStack> {
  const result: DetectedStack = {
    hasNext: false,
    hasReact: false,
    hasTailwind: false,
    hasTypescript: false,
    hasZod: false,
    hasSupabase: false,
    hasVitest: false,
    hasReactHookForm: false,
    packageManager: null,
  };

  try {
    const packageJsonPath = join(cwd, "package.json");
    const content = await readFile(packageJsonPath, "utf-8");
    const pkg: PackageJson = JSON.parse(content);

    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    for (const [key, packages] of Object.entries(DETECTION_RULES)) {
      const hasPackage = packages.some((p) => p in allDeps);
      result[key as keyof typeof DETECTION_RULES] = hasPackage;
    }

    result.packageManager = detectPackageManager(pkg, cwd);
  } catch {
    // No package.json found, return defaults
  }

  return result;
}

function detectPackageManager(
  pkg: PackageJson,
  cwd: string
): DetectedStack["packageManager"] {
  if (pkg.packageManager) {
    if (pkg.packageManager.startsWith("pnpm")) return "pnpm";
    if (pkg.packageManager.startsWith("yarn")) return "yarn";
    if (pkg.packageManager.startsWith("bun")) return "bun";
    if (pkg.packageManager.startsWith("npm")) return "npm";
  }

  // Could also check for lock files here if needed
  return "npm";
}

export function getRecommendedSkills(stack: DetectedStack): string[] {
  const skills: string[] = [];

  if (stack.hasTypescript) skills.push("typescript");
  if (stack.hasReact) skills.push("react-19");
  if (stack.hasNext) skills.push("nextjs");
  if (stack.hasTailwind) skills.push("tailwind-4");
  if (stack.hasZod) skills.push("zod-4");
  if (stack.hasSupabase) skills.push("supabase");
  if (stack.hasVitest) skills.push("testing-vitest");
  if (stack.hasReactHookForm) skills.push("forms");

  // Always recommend structuring-projects
  if (skills.length > 0) {
    skills.push("structuring-projects");
  }

  return skills;
}
