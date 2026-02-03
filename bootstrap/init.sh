#!/bin/bash

# Agent Skills Initialization Script
# This script performs a bulk download of all AI Agent Skills.

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

REPO_NAME="agent-skills"
ZIP_URL="https://github.com/gpolanco/agent-skills/archive/refs/heads/main.zip"
TEMP_DIR=".skills_temp"

echo -e "${BLUE}Initializing Bulk AI Agent Skills...${NC}"

# 1. Download and Extract
echo -e "${BLUE}Downloading skills catalog from GitHub...${NC}"

if ! curl -sSL "$ZIP_URL" -o "$TEMP_DIR.zip"; then
    echo -e "${RED}Failed to download skills catalog.${NC}"
    exit 1
fi

mkdir -p "$TEMP_DIR"
unzip -q "$TEMP_DIR.zip" -d "$TEMP_DIR"

# Determine the extracted folder name (usually repo-name-main)
EXTRACTED_FOLDER=$(ls "$TEMP_DIR" | head -n 1)

# 2. Copy content folder (skills + agents)
echo -e "${BLUE}Copying content catalog...${NC}"

mkdir -p content
cp -r "$TEMP_DIR/$EXTRACTED_FOLDER/content/skills" ./content/
cp -r "$TEMP_DIR/$EXTRACTED_FOLDER/content/agents" ./content/

# 3. Create project files from Remote Templates
echo -e "${BLUE}Initializing AGENTS.md from remote template...${NC}"

TEMPLATE_AGENTS="$TEMP_DIR/$EXTRACTED_FOLDER/bootstrap/templates/AGENTS.template.md"
TEMPLATE_README="$TEMP_DIR/$EXTRACTED_FOLDER/bootstrap/templates/SKILLS_README.template.md"

if [ ! -f "AGENTS.md" ]; then
    cp "$TEMPLATE_AGENTS" AGENTS.md
fi

if [ ! -f "content/skills/README.md" ]; then
    cp "$TEMPLATE_README" content/skills/README.md
fi

# 4. Cleanup
rm -rf "$TEMP_DIR"
rm "$TEMP_DIR.zip"

echo -e "${GREEN}All skills and agents have been imported locally!${NC}"
echo -e ""
echo -e "--------------------------------------------------------------------------------"
echo -e "${BLUE}AI HANDOVER GUIDE${NC}"
echo -e "--------------------------------------------------------------------------------"
echo -e "Copy and paste the following message to your AI assistant (Claude/Cursor/Copilot):"
echo -e ""
echo -e "${GREEN}\"Analyze my project stack and configure my AGENTS.md based on the local skills catalog. Use @skill-integrator for guidance.\"${NC}"
echo -e ""
echo -e "${BLUE}Installed:${NC}"
echo -e "- content/skills/  - AI agent skills"
echo -e "- content/agents/  - Agent definitions"
echo -e "- AGENTS.md        - Project configuration"
echo -e "--------------------------------------------------------------------------------"
