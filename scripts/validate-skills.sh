#!/bin/bash
# Validates that all skills have the required structure

set -e

SKILLS_DIR="content/skills"
ERRORS=0

echo "Validating skills..."

for skill_dir in "$SKILLS_DIR"/*/; do
  skill_name=$(basename "$skill_dir")

  # Skip README
  if [ "$skill_name" = "README.md" ]; then
    continue
  fi

  # Check for SKILL.md
  if [ ! -f "$skill_dir/SKILL.md" ]; then
    echo "ERROR: $skill_name is missing SKILL.md"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo "All skills valid."
else
  echo "$ERRORS error(s) found."
  exit 1
fi
