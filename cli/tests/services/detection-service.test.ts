import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  detectStack,
  getRecommendedSkills,
} from "../../src/core/services/detection-service.js";

describe("detection-service", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `skills-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("detectStack", () => {
    it("detects Next.js project", async () => {
      await writeFile(
        join(testDir, "package.json"),
        JSON.stringify({
          dependencies: { next: "14.0.0", react: "18.0.0" },
        })
      );

      const stack = await detectStack(testDir);

      expect(stack.hasNext).toBe(true);
      expect(stack.hasReact).toBe(true);
    });

    it("detects Tailwind", async () => {
      await writeFile(
        join(testDir, "package.json"),
        JSON.stringify({
          devDependencies: { tailwindcss: "3.0.0" },
        })
      );

      const stack = await detectStack(testDir);

      expect(stack.hasTailwind).toBe(true);
    });

    it("detects React Hook Form and Zod", async () => {
      await writeFile(
        join(testDir, "package.json"),
        JSON.stringify({
          dependencies: {
            "react-hook-form": "7.0.0",
            zod: "3.23.0",
          },
        })
      );

      const stack = await detectStack(testDir);

      expect(stack.hasReactHookForm).toBe(true);
      expect(stack.hasZod).toBe(true);
    });

    it("returns empty stack for missing package.json", async () => {
      const stack = await detectStack(testDir);

      expect(stack.hasNext).toBe(false);
      expect(stack.hasReact).toBe(false);
    });
  });

  describe("getRecommendedSkills", () => {
    it("recommends nextjs skill for Next.js projects", () => {
      const stack = {
        hasNext: true,
        hasReact: true,
        hasTailwind: false,
        hasTypescript: false,
        hasZod: false,
        hasSupabase: false,
        hasVitest: false,
        hasReactHookForm: false,
        packageManager: null as const,
      };
      const skills = getRecommendedSkills(stack);

      expect(skills).toContain("nextjs");
      expect(skills).toContain("react-19");
    });

    it("recommends forms skill for react-hook-form projects", () => {
      const stack = {
        hasNext: false,
        hasReact: false,
        hasTailwind: false,
        hasTypescript: false,
        hasZod: true,
        hasSupabase: false,
        hasVitest: false,
        hasReactHookForm: true,
        packageManager: null as const,
      };
      const skills = getRecommendedSkills(stack);

      expect(skills).toContain("forms");
      expect(skills).toContain("zod-4");
    });

    it("recommends tailwind for Tailwind projects", () => {
      const stack = {
        hasNext: false,
        hasReact: false,
        hasTailwind: true,
        hasTypescript: false,
        hasZod: false,
        hasSupabase: false,
        hasVitest: false,
        hasReactHookForm: false,
        packageManager: null as const,
      };
      const skills = getRecommendedSkills(stack);

      expect(skills).toContain("tailwind-4");
    });
  });
});
