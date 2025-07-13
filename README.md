# 🌐 NasCoder Terminal Browser MCP

**🚀 Ultimate Standalone Terminal Browser & Web Scraper** - Browse any website, extract content & links directly in your terminal with zero file pollution. **100% standalone** with smart fallbacks, enhanced by optional terminal browsers. Perfect for documentation reading, API exploration & web scraping.

[![npm version](https://img.shields.io/npm/v/nascoder-terminal-browser-mcp.svg)](https://www.npmjs.com/package/nascoder-terminal-browser-mcp)
[![downloads](https://img.shields.io/npm/dt/nascoder-terminal-browser-mcp.svg)](https://www.npmjs.com/package/nascoder-terminal-browser-mcp)
![standalone](https://img.shields.io/badge/dependencies-standalone-green.svg)
![no-files](https://img.shields.io/badge/files-zero%20downloads-blue.svg)
![cross-platform](https://img.shields.io/badge/platform-cross--platform-orange.svg)

## ⚡ Quick Start (2 minutes)

### **Method 1: Simple CLI Tool (Easiest)**
```bash
# Install
npm install -g nascoder-terminal-browser-mcp

# Use immediately
browse https://example.com
browse https://docs.python.org --format summary
browse https://news.ycombinator.com --format links
```

### **Method 2: Amazon Q CLI Integration**
```bash
# Install
npm install -g nascoder-terminal-browser-mcp
```

### **2. Add to Q CLI**
Edit `~/.config/amazonq/mcp.json`:
```json
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
```

### **3. Restart Q CLI**
```bash
# Exit Q CLI
/quit

# Start again
q chat
```

### **4. Try It!**
```
Browse https://example.com and show me the content
```

## 🔥 Why Choose This MCP?

| Feature | Standard Tools | **NasCoder Terminal Browser** |
|---------|---------------|-------------------------------|
| File Downloads | ❌ Creates files | **✅ No files - terminal only** |
| Dependencies | ❌ Requires external tools | **✅ 100% standalone** |
| Browser Support | Limited | **✅ Multiple engines + fallback** |
| Fallback Method | None | **✅ Built-in fetch+html-to-text** |
| Link Extraction | Manual | **✅ Automatic link parsing** |
| Content Formatting | Raw HTML | **✅ Clean terminal formatting** |
| Error Handling | Basic | **✅ Advanced retry & fallback** |
| Output Control | Fixed | **✅ Multiple format options** |

## 🎯 What You Get

### **🚀 Standalone Operation**
- **Zero external dependencies** - Works on any system with Node.js
- **Built-in fallback** - Uses fetch+html-to-text when no terminal browsers available
- **Smart enhancement** - Automatically uses lynx/w3m/links if installed for better formatting
- **Always functional** - Never fails due to missing system tools

### **Terminal Web Browsing**
- **No file pollution** - Everything displayed directly in terminal
- **Multiple browser engines** - lynx, w3m, links, elinks with auto-selection
- **Smart fallback** - Uses fetch+html-to-text if no terminal browsers available
- **Clean formatting** - Optimized for terminal reading

### **Advanced Features**
- **Link extraction** - Automatically find and list all page links
- **Content truncation** - Prevent overwhelming output with length limits
- **Multiple formats** - Choose between full, content-only, links-only, or summary
- **Error resilience** - Multiple fallback methods ensure success

### **Developer Friendly**
- **Zero configuration** - Works out of the box
- **Comprehensive logging** - Debug issues easily
- **Flexible options** - Customize behavior per request
- **MCP standard** - Integrates with any MCP-compatible system

## 🛠️ Available Tools

### **1. `terminal_browse`**
Browse websites and display content directly in terminal.

**Parameters:**
- `url` (required) - Website URL to browse
- `browser` - Terminal browser to use (auto, lynx, w3m, links, elinks)
- `format` - Output format (full, content-only, links-only, summary)
- `extractLinks` - Extract page links (true/false)
- `maxLength` - Maximum content length to prevent overwhelming output

**Example:**
```
Use terminal_browse to visit https://docs.github.com with format=summary
```

### **2. `check_browsers`**
Check which terminal browsers are available on your system.

**Example:**
```
Check what terminal browsers are available
```

### **3. `extract_links`**
Extract all links from a webpage without showing full content.

**Parameters:**
- `url` (required) - Website URL to extract links from
- `maxLinks` - Maximum number of links to return (default: 50)

**Example:**
```
Extract all links from https://news.ycombinator.com
```

## 🚀 Usage Examples

### **🎯 Simple CLI Commands**
```bash
# Browse any website
browse https://example.com

# Get page summary with stats
browse https://docs.python.org --format summary

# Extract all links
browse https://news.ycombinator.com --format links

# Full content with metadata
browse https://github.com/trending --format full

# Limit content length
browse https://very-long-page.com --max-length 1000

# Use specific browser
browse https://example.com --browser lynx
```

### **📋 Available Formats**
- **`content`** - Clean page text (default)
- **`summary`** - Brief overview with stats
- **`links`** - All extracted links
- **`full`** - Complete content with links

### **🔧 CLI Options**
```
browse <url> [options]

Options:
  --format, -f     Output format (content, summary, links, full)
  --max-length, -l Maximum content length [default: 2000]
  --browser, -b    Browser to use (auto, lynx, w3m, links)
  --help, -h       Show help
```

### **🤖 Amazon Q CLI Integration**
```
Browse https://example.com
```

### **Documentation Reading**
```
Browse https://docs.python.org/3/ with format=content-only
```

### **Link Discovery**
```
Extract links from https://github.com/trending
```

### **Quick Summary**
```
Browse https://news.ycombinator.com with format=summary
```

### **Specific Browser**
```
Browse https://example.com using lynx browser
```

## 📊 Output Formats

### **Full Format (default)**
- Complete page content
- All extracted links
- Metadata and statistics
- Method used for browsing

### **Content-Only**
- Just the page text content
- No links or metadata
- Clean reading experience

### **Links-Only**
- Only the extracted links
- Perfect for navigation
- Numbered list format

### **Summary**
- Brief content preview
- Key statistics
- Quick overview

## 🔧 Dependencies & Installation

### **📦 What's Included (Standalone)**
The package includes everything needed to work:
- `@modelcontextprotocol/sdk` - MCP protocol support
- `node-fetch` - HTTP requests
- `cheerio` - HTML parsing  
- `html-to-text` - HTML to text conversion
- `winston` - Logging

### **🚀 Optional Enhancements**
For even better text formatting, install terminal browsers:
```bash
# macOS (Homebrew)
brew install lynx w3m links

# Ubuntu/Debian  
sudo apt install lynx w3m links elinks

# CentOS/RHEL
sudo yum install lynx w3m links elinks
```

### **💡 How It Works**
1. **First Choice**: Uses terminal browsers (lynx, w3m, links) if available
2. **Automatic Fallback**: Uses built-in fetch+html-to-text if no browsers found
3. **Always Works**: Never fails due to missing dependencies

## 🛠️ Terminal Browser Support

### **Supported Browsers**
- **lynx** - Best text formatting, recommended
- **w3m** - Good table support, images in some terminals
- **links** - Interactive features, mouse support
- **elinks** - Enhanced links with more features

### **Installation Commands**
```bash
# macOS (Homebrew)
brew install lynx w3m links

# Ubuntu/Debian
sudo apt install lynx w3m links elinks

# CentOS/RHEL
sudo yum install lynx w3m links elinks
```

### **Auto-Selection Priority**
1. lynx (best formatting)
2. w3m (good compatibility)
3. links (interactive features)
4. elinks (enhanced features)
5. fetch+html-to-text (always available fallback)

## 🎨 Advanced Usage

### **Custom Content Length**
```json
{
  "url": "https://very-long-page.com",
  "maxLength": 5000
}
```

### **Links Only Mode**
```json
{
  "url": "https://documentation-site.com",
  "format": "links-only",
  "maxLinks": 100
}
```

### **Specific Browser**
```json
{
  "url": "https://example.com",
  "browser": "w3m",
  "extractLinks": false
}
```

## 🔍 Troubleshooting

### **"No terminal browsers found"**
```bash
# Install at least one terminal browser
brew install lynx  # macOS
sudo apt install lynx  # Ubuntu
```

### **"Browser failed" errors**
- The tool automatically falls back to fetch+html-to-text
- Check internet connectivity
- Some sites may block terminal browsers

### **Content too long**
```
Use maxLength parameter to limit output:
Browse https://long-page.com with maxLength=2000
```

### **Q CLI doesn't see MCP**
1. Check `~/.config/amazonq/mcp.json` syntax
2. Restart Q CLI (`/quit` then `q chat`)
3. Verify package installation: `npm list -g nascoder-terminal-browser-mcp`

## 📈 Performance Features

### **Smart Caching**
- No file system caching (by design)
- Memory-efficient processing
- Fast response times

### **Error Handling**
- Multiple fallback methods
- Graceful degradation
- Comprehensive error messages

### **Resource Management**
- 30-second timeout protection
- Memory-conscious content truncation
- Efficient link extraction

## 🎉 Success Stories

> *"Finally, a way to browse documentation without cluttering my filesystem with temp files!"* - Developer

> *"The automatic fallback from lynx to fetch+html-to-text saved my workflow when lynx wasn't available."* - DevOps Engineer

> *"Perfect for scraping API docs directly in my terminal. The link extraction is incredibly useful."* - API Developer

## 📋 Comparison

| Tool | Files Created | Browser Support | Link Extraction | Fallback Method |
|------|---------------|-----------------|-----------------|-----------------|
| **NasCoder Terminal Browser** | ✅ **None** | ✅ **4 browsers** | ✅ **Automatic** | ✅ **fetch+html-to-text** |
| curl + html2text | ❌ Temp files | ❌ None | ❌ Manual | ❌ None |
| wget + pandoc | ❌ Downloads | ❌ None | ❌ Manual | ❌ None |
| lynx alone | ❌ Can save files | ✅ lynx only | ❌ Manual | ❌ None |

## 🔗 Links

- **NPM Package**: https://www.npmjs.com/package/nascoder-terminal-browser-mcp
- **GitHub**: https://github.com/freelancernasimofficial/nascoder-terminal-browser-mcp
- **Issues**: https://github.com/freelancernasimofficial/nascoder-terminal-browser-mcp/issues
- **Author**: @freelancernasimofficial

## 📄 License

MIT - Feel free to use, modify, and distribute

---

**🚀 Ready to browse the web in your terminal without file clutter?**

**Install now and experience the difference!**

```bash
npm install -g nascoder-terminal-browser-mcp
```

**Built with ❤️ by NasCoder (@freelancernasimofficial)**
