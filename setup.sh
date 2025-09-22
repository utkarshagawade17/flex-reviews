#!/bin/bash

echo "🚀 Setting up Flex Living Reviews Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cat > .env.local << EOF
# Google Places API Configuration
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Hostaway API Configuration (already provided in code)
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
EOF
    echo "✅ Environment file created at .env.local"
else
    echo "✅ Environment file already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the development server:"
echo "  npm run dev"
echo ""
echo "To start the production server:"
echo "  npm start"
echo ""
echo "The application will be available at:"
echo "  http://localhost:3000"
echo ""
echo "API Test page:"
echo "  http://localhost:3000/test"
echo ""
echo "Property page example:"
echo "  http://localhost:3000/property/1"
echo ""
echo "📚 For more information, see README.md"

