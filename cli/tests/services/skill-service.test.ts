import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdir, writeFile, rm, readdir, access } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import {
  removeSkill,
  getInstalledSkills,
  installSkill,
  installAgent,
  cleanupTemp,
} from "../../src/core/services/skill-service.js";
import type { Skill, Agent } from "../../src/core/types/skill.types.js";

describe("skill-service", () => {
  let testDir: string;
  let skillsDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `skills-test-${Date.now()}`);
    skillsDir = join(testDir, "skills");
    await mkdir(skillsDir, { recursive: true });
  });

  afterEach(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  describe("getInstalledSkills", () => {
    it("returns empty array for empty directory", async () => {
      const skills = await getInstalledSkills(skillsDir);
      expect(skills).toEqual([]);
    });

    it("returns skill directories", async () => {
      await mkdir(join(skillsDir, "react-19"));
      await mkdir(join(skillsDir, "nextjs"));
      await writeFile(join(skillsDir, "README.md"), "# Skills");

      const skills = await getInstalledSkills(skillsDir);

      expect(skills).toContain("react-19");
      expect(skills).toContain("nextjs");
      expect(skills).not.toContain("README.md"); // Files are excluded
    });

    it("returns empty array for non-existent directory", async () => {
      const skills = await getInstalledSkills("/non/existent/path");
      expect(skills).toEqual([]);
    });
  });

  describe("removeSkill", () => {
    it("removes existing skill directory", async () => {
      const skillPath = join(skillsDir, "react-19");
      await mkdir(skillPath);
      await writeFile(join(skillPath, "SKILL.md"), "# Skill");

      const result = await removeSkill("react-19", skillsDir);

      expect(result).toBe(true);

      // Verify skill directory no longer exists
      const { access } = await import("node:fs/promises");
      await expect(access(skillPath)).rejects.toThrow();
    });

    it("returns false for non-existent skill", async () => {
      const result = await removeSkill("non-existent", skillsDir);
      expect(result).toBe(false);
    });
  });

  describe("installSkill", () => {
    it("copies skill to target directory", async () => {
      // Create source skill
      const sourceDir = join(testDir, "source");
      const sourceSkillPath = join(sourceDir, "test-skill");
      await mkdir(sourceSkillPath, { recursive: true });
      await writeFile(join(sourceSkillPath, "SKILL.md"), "---\nname: test\n---\n# Test");

      const skill: Skill = {
        id: "test-skill",
        path: sourceSkillPath,
        metadata: {
          name: "test",
          description: "Test skill",
          version: "1.0.0",
        },
        isInstalled: false,
      };

      await installSkill(skill, skillsDir);

      const installedPath = join(skillsDir, "test-skill");
      const entries = await readdir(installedPath);
      expect(entries).toContain("SKILL.md");
    });
  });

  describe("getAvailableSkills", () => {
    it("returns skills from repo structure", async () => {
      // Create mock repo structure: repoPath/content/skills/skill-name/SKILL.md
      const contentSkillsPath = join(testDir, "content", "skills");
      await mkdir(join(contentSkillsPath, "react-19"), { recursive: true });
      await mkdir(join(contentSkillsPath, "nextjs"), { recursive: true });

      // Create SKILL.md with valid frontmatter
      await writeFile(
        join(contentSkillsPath, "react-19", "SKILL.md"),
        "---\nname: react-19\ndescription: React 19 patterns\nversion: \"1.0.0\"\n---\n# React 19"
      );
      await writeFile(
        join(contentSkillsPath, "nextjs", "SKILL.md"),
        "---\nname: nextjs\ndescription: Next.js patterns\nversion: \"1.0.0\"\n---\n# Next.js"
      );

      const { getAvailableSkills } = await import(
        "../../src/core/services/skill-service.js"
      );
      const skills = await getAvailableSkills(testDir);

      expect(skills.length).toBe(2);
      expect(skills.map((s) => s.id)).toContain("react-19");
      expect(skills.map((s) => s.id)).toContain("nextjs");
    });

    it("skips directories without valid SKILL.md", async () => {
      const contentSkillsPath = join(testDir, "content", "skills");
      await mkdir(join(contentSkillsPath, "valid-skill"), { recursive: true });
      await mkdir(join(contentSkillsPath, "invalid-skill"), { recursive: true });

      await writeFile(
        join(contentSkillsPath, "valid-skill", "SKILL.md"),
        "---\nname: valid\n---\n# Valid"
      );
      // No SKILL.md for invalid-skill

      const { getAvailableSkills } = await import(
        "../../src/core/services/skill-service.js"
      );
      const skills = await getAvailableSkills(testDir);

      expect(skills.length).toBe(1);
      expect(skills[0].id).toBe("valid-skill");
    });

    it("parses multiline description in frontmatter", async () => {
      const contentSkillsPath = join(testDir, "content", "skills");
      await mkdir(join(contentSkillsPath, "multiline-skill"), { recursive: true });

      // Create SKILL.md with multiline description
      await writeFile(
        join(contentSkillsPath, "multiline-skill", "SKILL.md"),
        `---
name: multiline-skill
description: This is a very long description
  that spans multiple lines
  and should be concatenated
version: "1.0.0"
---
# Multiline Skill`
      );

      const { getAvailableSkills } = await import(
        "../../src/core/services/skill-service.js"
      );
      const skills = await getAvailableSkills(testDir);

      expect(skills.length).toBe(1);
      expect(skills[0].metadata.description).toContain("very long description");
      expect(skills[0].metadata.description).toContain("multiple lines");
    });
  });

  describe("getAvailableAgents", () => {
    it("returns agents from repo structure", async () => {
      // Create mock repo structure: repoPath/content/agents/agent-name/
      const contentAgentsPath = join(testDir, "content", "agents");
      await mkdir(join(contentAgentsPath, "planner"), { recursive: true });
      await mkdir(join(contentAgentsPath, "reviewer"), { recursive: true });

      const { getAvailableAgents } = await import(
        "../../src/core/services/skill-service.js"
      );
      const agents = await getAvailableAgents(testDir);

      expect(agents.length).toBe(2);
      expect(agents.map((a) => a.id)).toContain("planner");
      expect(agents.map((a) => a.id)).toContain("reviewer");
    });

    it("capitalizes agent names", async () => {
      const contentAgentsPath = join(testDir, "content", "agents");
      await mkdir(join(contentAgentsPath, "planner"), { recursive: true });

      const { getAvailableAgents } = await import(
        "../../src/core/services/skill-service.js"
      );
      const agents = await getAvailableAgents(testDir);

      expect(agents[0].name).toBe("Planner");
    });
  });

  describe("installAgent", () => {
    it("copies agent to target directory", async () => {
      // Create source agent
      const sourceDir = join(testDir, "source");
      const sourceAgentPath = join(sourceDir, "planner");
      await mkdir(sourceAgentPath, { recursive: true });
      await writeFile(join(sourceAgentPath, "AGENT.md"), "# Planner Agent");

      const agent: Agent = {
        id: "planner",
        name: "Planner",
        description: "Planning agent",
        path: sourceAgentPath,
        isInstalled: false,
      };

      const agentsDir = join(testDir, "agents");
      await mkdir(agentsDir, { recursive: true });

      await installAgent(agent, agentsDir);

      // Check direct .md file was created for Claude Code
      const directFile = join(agentsDir, "planner.md");
      const directFileExists = await access(directFile).then(() => true).catch(() => false);
      expect(directFileExists).toBe(true);

      // Check folder exists but AGENT.md was removed (to avoid duplicate detection)
      const installedPath = join(agentsDir, "planner");
      const entries = await readdir(installedPath);
      expect(entries).not.toContain("AGENT.md");
    });
  });

  describe("cleanupTemp", () => {
    it("removes temp directory without error", async () => {
      const tempPath = join(testDir, "temp", "extracted");
      await mkdir(tempPath, { recursive: true });
      await writeFile(join(tempPath, "file.txt"), "test");

      // cleanupTemp should not throw
      await expect(cleanupTemp(tempPath)).resolves.not.toThrow();
    });

    it("handles non-existent path gracefully", async () => {
      await expect(cleanupTemp("/non/existent/path")).resolves.not.toThrow();
    });
  });
});
