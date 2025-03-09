#!/bin/bash

echo "Starting Health Recipes App with mock database"
echo "=============================================="

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo "Creating .env.local file with template settings..."
  cat > .env.local << EOL
# Anthropic API Key - Please replace with your actual key
ANTHROPIC_API_KEY=YOUR_API_KEY_HERE

# For production, set this to your actual website URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database URL for Prisma (SQLite file)
DATABASE_URL="file:./dev.db"

# NextAuth.js Secret
NEXTAUTH_SECRET="this-is-a-development-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
EOL
  echo ".env.local file created successfully!"
  echo "IMPORTANT: Please edit the .env.local file and add your ANTHROPIC_API_KEY before continuing."
  exit 1
fi

# Check if ANTHROPIC_API_KEY is properly set in .env.local
if grep -q "ANTHROPIC_API_KEY=YOUR_API_KEY_HERE" .env.local || grep -q "ANTHROPIC_API_KEY=$" .env.local; then
  echo "ERROR: ANTHROPIC_API_KEY is not set in your .env.local file."
  echo "Please edit the .env.local file and add your ANTHROPIC_API_KEY before continuing."
  exit 1
fi

echo -e "\nDemo account credentials:"
echo "  Email: demo@example.com"
echo "  Password: password123"

echo -e "\nStarting the development server..."
npm run dev 