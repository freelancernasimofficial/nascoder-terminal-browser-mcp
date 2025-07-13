#!/bin/bash

echo "🚀 Installing NasCoder Terminal Browser MCP..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install terminal browsers if not present
echo "🔧 Checking terminal browsers..."

if command -v brew &> /dev/null; then
    echo "📦 Homebrew detected - installing terminal browsers..."
    brew install lynx w3m links 2>/dev/null || echo "⚠️  Some browsers may already be installed"
elif command -v apt &> /dev/null; then
    echo "📦 APT detected - installing terminal browsers..."
    sudo apt update && sudo apt install -y lynx w3m links elinks 2>/dev/null || echo "⚠️  Some browsers may already be installed"
elif command -v yum &> /dev/null; then
    echo "📦 YUM detected - installing terminal browsers..."
    sudo yum install -y lynx w3m links elinks 2>/dev/null || echo "⚠️  Some browsers may already be installed"
else
    echo "⚠️  Package manager not detected. Please install lynx, w3m, or links manually."
fi

# Check which browsers are available
echo "🔍 Available terminal browsers:"
for browser in lynx w3m links elinks; do
    if command -v $browser &> /dev/null; then
        echo "  ✅ $browser"
    else
        echo "  ❌ $browser (not found)"
    fi
done

# Install the MCP package
echo "📦 Installing NasCoder Terminal Browser MCP..."
npm install -g nascoder-terminal-browser-mcp

if [ $? -eq 0 ]; then
    echo "✅ Installation successful!"
else
    echo "❌ Installation failed!"
    exit 1
fi

# Check if Q CLI config exists
CONFIG_DIR="$HOME/.config/amazonq"
CONFIG_FILE="$CONFIG_DIR/mcp.json"

echo "🔧 Setting up Q CLI configuration..."

if [ ! -d "$CONFIG_DIR" ]; then
    echo "📁 Creating Q CLI config directory..."
    mkdir -p "$CONFIG_DIR"
fi

if [ ! -f "$CONFIG_FILE" ]; then
    echo "📄 Creating new MCP configuration..."
    cat > "$CONFIG_FILE" << 'EOF'
{
  "mcpServers": {
    "nascoder-terminal-browser": {
      "command": "npx",
      "args": ["nascoder-terminal-browser-mcp"],
      "timeout": 30000,
      "disabled": false
    }
  }
}
EOF
    echo "✅ MCP configuration created at $CONFIG_FILE"
else
    echo "⚠️  MCP configuration already exists at $CONFIG_FILE"
    echo "💡 Please manually add the following to your mcpServers section:"
    echo ""
    echo '    "nascoder-terminal-browser": {'
    echo '      "command": "npx",'
    echo '      "args": ["nascoder-terminal-browser-mcp"],'
    echo '      "timeout": 30000,'
    echo '      "disabled": false'
    echo '    }'
    echo ""
fi

echo ""
echo "🎉 Installation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your Q CLI session:"
echo "   - Type '/quit' in Q CLI"
echo "   - Run 'q chat' to start again"
echo ""
echo "2. Test the installation:"
echo "   - Try: 'Browse https://example.com'"
echo "   - Or: 'Check what terminal browsers are available'"
echo ""
echo "💡 For help, visit: https://github.com/freelancernasimofficial/nascoder-terminal-browser-mcp"
