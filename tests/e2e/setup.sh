#!/bin/bash
# E2E Test Setup Script
# Run this script to set up the E2E testing environment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() { echo -e "${BLUE}[*]${NC} $1"; }
print_success() { echo -e "${GREEN}[+]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[!]${NC} $1"; }

echo ""
echo "=========================================="
echo "  E2E Test Setup"
echo "=========================================="
echo ""

# Step 1: Install dependencies
print_status "Installing npm dependencies..."
npm install
print_success "Dependencies installed"

# Step 2: Install Playwright browsers
print_status "Installing Playwright browsers..."
npx playwright install chromium
print_success "Playwright browsers installed"

# Step 3: Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cp .env.example .env
    print_success "Created .env file (edit as needed)"
else
    print_warning ".env file already exists"
fi

# Step 4: Create sample audio fixture if ffmpeg is available
if command -v ffmpeg &> /dev/null; then
    if [ ! -f fixtures/sample-audio.mp3 ]; then
        print_status "Generating sample audio fixture..."
        mkdir -p fixtures
        ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -acodec libmp3lame -ab 64k fixtures/sample-audio.mp3 -y > /dev/null 2>&1
        print_success "Created fixtures/sample-audio.mp3"
    else
        print_warning "Sample audio fixture already exists"
    fi
else
    print_warning "ffmpeg not found - please create fixtures/sample-audio.mp3 manually"
    print_warning "See fixtures/README.md for instructions"
fi

echo ""
print_success "Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env if needed (configure BASE_URL, etc.)"
echo "  2. Start your frontend and backend services"
echo "  3. Run tests: npm test"
echo ""
echo "Quick start commands:"
echo "  npm test              - Run all tests"
echo "  npm run test:ui       - Run tests in UI mode"
echo "  npm run test:headed   - Run tests with browser visible"
echo ""
