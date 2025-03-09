#!/bin/bash

echo "Setting up authentication and database for Health Recipes app"
echo "============================================================="

# Check Node.js version
NODE_VERSION=$(node -v)
echo "Current Node.js version: $NODE_VERSION"

if [[ $NODE_VERSION =~ ^v[0-9]+\. ]]; then
  MAJOR_VERSION=${NODE_VERSION:1:2}  # Extract major version number
  if [ $MAJOR_VERSION -lt 18 ]; then
    echo "ERROR: Node.js version 18.18.0 or higher is required."
    echo "Please update your Node.js version before continuing."
    echo "Visit https://nodejs.org/ to download the latest version."
    exit 1
  fi
fi

# Install required packages
echo -e "\nInstalling required packages..."
npm install prisma @prisma/client next-auth bcrypt @auth/prisma-adapter
npm install --save-dev @types/bcrypt
echo "Packages installed successfully!"

# Initialize Prisma if schema.prisma is not already set up
if [ ! -f prisma/schema.prisma ]; then
  echo -e "\nInitializing Prisma..."
  npx prisma init
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo -e "\nCreating .env file..."
  echo 'DATABASE_URL="file:./dev.db"' > .env
  echo ".env file created with SQLite configuration"
fi

# Run migrations
echo -e "\nSetting up database with Prisma migrations..."
npx prisma migrate dev --name init

# Generate Prisma client
echo -e "\nGenerating Prisma client..."
npx prisma generate

echo -e "\n==========================================="
echo "Setup complete! You can now start your app with:"
echo "npm run dev" 