#!/bin/bash
# Specify the name of your PM2 project
PROJECT_NAME="keno-api"
PROJECT_PATH="/var/www/html/Keno-Game-Backend"
# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    echo "nvm not found. Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Read required Node.js version from package.json
    required_node_version=$(node -e "console.log(require('./package.json').engines.node)")

    # Install required Node.js version if not already installed
    nvm install "$required_node_version"

    # Use the required Node.js version
    nvm use "$required_node_version"

    # Install Dependencies
    npm install

    # Copy Files
    cp -R * "$PROJECT_PATH"

    # Start Project
    # Check if the project is running in PM2
    echo pm2 list | grep -q "$PROJECT_NAME";
    if pm2 list | grep -q "$PROJECT_NAME"; then
        echo "Project is already running in PM2. Restarting..."
        pm2 restart "$PROJECT_NAME"
    else
        echo "Project is not running in PM2. Starting..."
        pm2 start "npm start" --name "$PROJECT_NAME"  # Replace with your actual start command
    fi
fi