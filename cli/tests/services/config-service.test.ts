import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  configExists,
  readConfig,
  writeConfig,
  createDefaultConfig,
  addSkillToConfig,
  removeSkillFromConfig,
} from "../../src/core/services/config-service.js";

describe("config-service", () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `skills-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("configExists", () => {
    it("returns false when no config exists", async () => {
      const result = await configExists(testDir);
      expect(result).toBe(false);
    });

    it("returns true when config exists", async () => {
      await writeFile(join(testDir, ".skillsrc.json"), "{}");
      const result = await configExists(testDir);
      expect(result).toBe(true);
    });
  });

  describe("createDefaultConfig", () => {
    it("creates config with correct structure for claude editor", () => {
      const config = createDefaultConfig("claude", ["react-19", "nextjs"]);

      expect(config.version).toBe("1.0.0");
      expect(config.editor).toBe("claude");
      expect(config.skills.active).toEqual(["react-19", "nextjs"]);
      expect(config.skills.directory).toBe(".claude/skills");
    });

    it("creates config with different path for antigravity editor", () => {
      const config = createDefaultConfig("antigravity", ["typescript"]);

      expect(config.editor).toBe("antigravity");
      expect(config.skills.directory).toBe(".gemini/skills");
    });
  });

  describe("writeConfig / readConfig", () => {
    it("writes and reads config correctly", async () => {
      const config = createDefaultConfig("claude", ["react-19"]);

      await writeConfig(config, testDir);
      const read = await readConfig(testDir);

      expect(read).not.toBeNull();
      expect(read?.editor).toBe("claude");
      expect(read?.skills.active).toEqual(["react-19"]);
    });

    it("returns null for invalid config", async () => {
      await writeFile(join(testDir, ".skillsrc.json"), "invalid json");
      const result = await readConfig(testDir);
      expect(result).toBeNull();
    });
  });

  describe("addSkillToConfig", () => {
    it("adds skill to config", async () => {
      const config = createDefaultConfig("claude", ["react-19"]);
      await writeConfig(config, testDir);

      const result = await addSkillToConfig("nextjs", testDir);
      expect(result).toBe(true);

      const updated = await readConfig(testDir);
      expect(updated?.skills.active).toContain("nextjs");
    });

    it("does not duplicate existing skill", async () => {
      const config = createDefaultConfig("claude", ["react-19"]);
      await writeConfig(config, testDir);

      await addSkillToConfig("react-19", testDir);
      const updated = await readConfig(testDir);

      const count = updated?.skills.active.filter((s) => s === "react-19").length;
      expect(count).toBe(1);
    });
  });

  describe("removeSkillFromConfig", () => {
    it("removes skill from config", async () => {
      const config = createDefaultConfig("claude", ["react-19", "nextjs"]);
      await writeConfig(config, testDir);

      const result = await removeSkillFromConfig("react-19", testDir);
      expect(result).toBe(true);

      const updated = await readConfig(testDir);
      expect(updated?.skills.active).not.toContain("react-19");
      expect(updated?.skills.active).toContain("nextjs");
    });
  });
});
