#!/bin/bash
# Validates that all agents have the required structure

set -e

AGENTS_DIR="content/agents"
ERRORS=0

echo "Validating agents..."

for agent_dir in "$AGENTS_DIR"/*/; do
  agent_name=$(basename "$agent_dir")

  # Skip README
  if [ "$agent_name" = "README.md" ]; then
    continue
  fi

  # Check for AGENT.md
  if [ ! -f "$agent_dir/AGENT.md" ]; then
    echo "ERROR: $agent_name is missing AGENT.md"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo "All agents valid."
else
  echo "$ERRORS error(s) found."
  exit 1
fi
