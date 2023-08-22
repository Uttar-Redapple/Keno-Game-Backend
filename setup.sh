#!/bin/bash

# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "nvm not found. Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
fi

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Read required Node.js version from package.json
required_node_version=$(node -e "console.log(require('./package.json').engines.node)")

# Install required Node.js version if not already installed
nvm install v16.19.0

# Use the required Node.js version
nvm use v16.19.0

