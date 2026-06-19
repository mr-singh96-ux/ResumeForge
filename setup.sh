#!/bin/bash

# ResumeForge AI - Setup Script
# This script helps set up ResumeForge AI for local development

set -e

echo "=========================================="
echo "ResumeForge AI - Local Development Setup"
echo "=========================================="
echo ""

# Check if Node.js and pnpm are installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "Error: pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ pnpm version: $(pnpm --version)"
echo ""

# Install dependencies
echo "Installing dependencies..."
pnpm install
echo "✓ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "⚠ Please fill in .env.local with your configuration"
    echo ""
    echo "Required configuration:"
    echo "  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    echo "  - CLERK_SECRET_KEY"
    echo "  - GOOGLE_APPS_SCRIPT_URL"
    echo "  - GEMINI_API_KEY"
    echo "  - NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY (optional)"
    echo "  - RAZORPAY_KEY_ID"
    echo "  - RAZORPAY_KEY_SECRET"
    echo ""
    exit 0
else
    echo "✓ .env.local exists"
fi

# Check if .env.local has all required variables
required_vars=(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
    "CLERK_SECRET_KEY"
    "GOOGLE_APPS_SCRIPT_URL"
    "GEMINI_API_KEY"
)

echo "Checking environment variables..."
missing_vars=()

for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env.local; then
        value=$(grep "^${var}=" .env.local | cut -d '=' -f2)
        if [ "$value" != "your_${var,,}" ] && [ ! -z "$value" ]; then
            echo "✓ $var is configured"
        else
            missing_vars+=("$var")
        fi
    else
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo ""
    echo "⚠ Missing configuration for:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Please update .env.local with your configuration values"
    exit 1
fi

echo ""
echo "=========================================="
echo "Setup complete! You can now run:"
echo ""
echo "  pnpm dev"
echo ""
echo "This will start the development server at http://localhost:3000"
echo "=========================================="
