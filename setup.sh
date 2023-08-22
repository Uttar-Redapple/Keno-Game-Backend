#!/bin/bash
# Specify the name of your PM2 project
PROJECT_NAME="keno-api"
PROJECT_PATH="/var/www/html/Keno-Game-Backend"
NODE_VER="v16.19.0"
# Check if nvm is installed
if ! command -v nvm &> /dev/null; then
    sudo su ubuntu
    echo "nvm not found. Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

    # Install required Node.js version if not already installed
    nvm install "$NODE_VER"

    # Use the required Node.js version
    nvm use "$NODE_VER"

    # Install Dependencies
    npm install

    # Copy Files
    cp -R * "$PROJECT_PATH"

    # Start Project
    # Check if the project is running in PM2
    if pm2 list | grep -q "$PROJECT_NAME"; then
        echo "Project is already running in PM2. Restarting..."
        pm2 restart "$PROJECT_NAME"
    else
        echo "Project is not running in PM2. Starting..."
        pm2 start "npm start" --name "$PROJECT_NAME"  # Replace with your actual start command
    fi
fi