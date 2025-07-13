#!/usr/bin/env node

// Bulletproof imports with error handling
let Server, StdioServerTransport, CallToolRequestSchema, ListToolsRequestSchema;
let fetch, cheerio, htmlToText, winston;
let fs, path, spawn, exec;

try {
  // Core MCP imports
  const mcpSdk = await import("@modelcontextprotocol/sdk/server/index.js");
  Server = mcpSdk.Server;
  
  const mcpTransport = await import("@modelcontextprotocol/sdk/server/stdio.js");
  StdioServerTransport = mcpTransport.StdioServerTransport;
  
  const mcpTypes = await import("@modelcontextprotocol/sdk/types.js");
  CallToolRequestSchema = mcpTypes.CallToolRequestSchema;
  ListToolsRequestSchema = mcpTypes.ListToolsRequestSchema;
  
  // External dependencies
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;
  
  const { load: cheerioLoad } = await import('cheerio');
  cheerio = { load: cheerioLoad };
  
  const htmlToTextModule = await import('html-to-text');
  htmlToText = htmlToTextModule.htmlToText;
  
  const winstonModule = await import('winston');
  winston = winstonModule.default;
  
  // Built-in Node.js modules
  fs = await import('fs');
  path = await import('path');
  const childProcess = await import('child_process');
  const { spawn: spawnFunc, exec: execFunc } = childProcess;
  spawn = spawnFunc;
  exec = execFunc;
  
} catch (error) {
  console.error('❌ Failed to import required dependencies:', error.message);
  console.error('💡 Please run: npm install');
  process.exit(1);
}

/**
 * NASCODER TERMINAL BROWSER MCP - ULTRA PRO VERSION
 * 
 * Features:
 * - Terminal web browsing without file downloads
 * - Multiple browser engines (lynx, w3m, links, curl+html-to-text)
 * - Link extraction and navigation
 * - Documentation scraping
 * - Content formatting for terminal display
 * - No file system pollution - everything in memory/terminal
 * - Advanced HTML parsing and text conversion
 * - Error handling and fallback methods
 */

class NascoderTerminalBrowser {
  constructor() {
    try {
      // Initialize logger
      this.logger = winston.createLogger({
        level: 'info',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.simple()
        ),
        transports: [
          new winston.transports.Console({ 
            format: winston.format.simple(),
            silent: process.env.NODE_ENV === 'test'
          })
        ]
      });
      
      // Available terminal browsers
      this.browsers = {
        'lynx': { cmd: 'lynx', args: ['-dump', '-nolist'] },
        'w3m': { cmd: 'w3m', args: ['-dump'] },
        'links': { cmd: 'links', args: ['-dump'] },
        'elinks': { cmd: 'elinks', args: ['-dump'] }
      };
      
      this.logger.info('NasCoder Terminal Browser MCP initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize NasCoder Terminal Browser MCP:', error.message);
      process.exit(1);
    }
  }

  // Check which terminal browsers are available
  async checkAvailableBrowsers() {
    const available = {};
    
    for (const [name, config] of Object.entries(this.browsers)) {
      try {
        await new Promise((resolve, reject) => {
          exec(`which ${config.cmd}`, (error) => {
            if (error) reject(error);
            else resolve();
          });
        });
        available[name] = config;
      } catch (error) {
        // Browser not available
      }
    }
    
    return available;
  }

  // Use terminal browser to get page content
  async useTerminalBrowser(url, browserName = 'auto') {
    const availableBrowsers = await this.checkAvailableBrowsers();
    
    if (Object.keys(availableBrowsers).length === 0) {
      throw new Error('No terminal browsers available. Please install lynx, w3m, or links.');
    }
    
    // Auto-select best available browser
    if (browserName === 'auto') {
      if (availableBrowsers.lynx) browserName = 'lynx';
      else if (availableBrowsers.w3m) browserName = 'w3m';
      else if (availableBrowsers.links) browserName = 'links';
      else if (availableBrowsers.elinks) browserName = 'elinks';
      else browserName = Object.keys(availableBrowsers)[0];
    }
    
    if (!availableBrowsers[browserName]) {
      throw new Error(`Browser '${browserName}' is not available. Available: ${Object.keys(availableBrowsers).join(', ')}`);
    }
    
    const browser = availableBrowsers[browserName];
    
    return new Promise((resolve, reject) => {
      const process = spawn(browser.cmd, [...browser.args, url]);
      let output = '';
      let error = '';
      
      process.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      process.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      process.on('close', (code) => {
        if (code === 0) {
          resolve({
            content: output,
            browser: browserName,
            success: true
          });
        } else {
          reject(new Error(`Browser ${browserName} failed: ${error}`));
        }
      });
      
      // Timeout after 30 seconds
      setTimeout(() => {
        process.kill();
        reject(new Error(`Browser ${browserName} timed out`));
      }, 30000);
    });
  }

  // Fallback method using fetch + html-to-text
  async useFetchMethod(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'NasCoder-Terminal-Browser/1.0 (Terminal Browser MCP)'
        },
        timeout: 30000
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Convert HTML to text
      const text = htmlToText(html, {
        wordwrap: 80,
        ignoreHref: false,
        ignoreImage: true,
        preserveNewlines: true,
        uppercaseHeadings: false
      });
      
      return {
        content: text,
        browser: 'fetch+html-to-text',
        success: true
      };
    } catch (error) {
      throw new Error(`Fetch method failed: ${error.message}`);
    }
  }

  // Extract links from HTML
  async extractLinks(url) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'NasCoder-Terminal-Browser/1.0 (Link Extractor)'
        },
        timeout: 30000
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);
      const links = [];
      
      $('a[href]').each((i, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().trim();
        
        if (href && text) {
          // Convert relative URLs to absolute
          let fullUrl = href;
          if (href.startsWith('/')) {
            const urlObj = new URL(url);
            fullUrl = `${urlObj.protocol}//${urlObj.host}${href}`;
          } else if (!href.startsWith('http')) {
            fullUrl = new URL(href, url).href;
          }
          
          links.push({
            text: text.substring(0, 100), // Limit text length
            url: fullUrl
          });
        }
      });
      
      return links;
    } catch (error) {
      throw new Error(`Link extraction failed: ${error.message}`);
    }
  }

  // Main browse function with fallback methods
  async browse(url, options = {}) {
    const { browser = 'auto', extractLinks = false, maxLength = 10000 } = options;
    
    let result = {
      url: url,
      content: '',
      links: [],
      method: '',
      success: false,
      error: null
    };
    
    // Try terminal browser first
    try {
      const browserResult = await this.useTerminalBrowser(url, browser);
      result.content = browserResult.content;
      result.method = `terminal-browser-${browserResult.browser}`;
      result.success = true;
    } catch (browserError) {
      this.logger.warn(`Terminal browser failed: ${browserError.message}`);
      
      // Fallback to fetch method
      try {
        const fetchResult = await this.useFetchMethod(url);
        result.content = fetchResult.content;
        result.method = fetchResult.browser;
        result.success = true;
      } catch (fetchError) {
        result.error = `All methods failed. Browser: ${browserError.message}, Fetch: ${fetchError.message}`;
        result.success = false;
      }
    }
    
    // Extract links if requested
    if (extractLinks && result.success) {
      try {
        result.links = await this.extractLinks(url);
      } catch (linkError) {
        this.logger.warn(`Link extraction failed: ${linkError.message}`);
        result.links = [];
      }
    }
    
    // Truncate content if too long
    if (result.content.length > maxLength) {
      result.content = result.content.substring(0, maxLength) + '\n\n[Content truncated - use maxLength parameter to see more]';
    }
    
    return result;
  }

  // Format output for terminal display
  formatOutput(result, format = 'full') {
    if (!result.success) {
      return {
        type: 'text',
        text: `❌ Failed to browse ${result.url}\nError: ${result.error}`
      };
    }
    
    switch (format) {
      case 'content-only':
        return {
          type: 'text',
          text: result.content
        };
        
      case 'links-only':
        if (result.links.length === 0) {
          return {
            type: 'text',
            text: 'No links found on this page.'
          };
        }
        
        let linksText = `🔗 Found ${result.links.length} links:\n\n`;
        result.links.forEach((link, i) => {
          linksText += `${i + 1}. ${link.text}\n   ${link.url}\n\n`;
        });
        
        return {
          type: 'text',
          text: linksText
        };
        
      case 'summary':
        const lines = result.content.split('\n').filter(line => line.trim());
        const preview = lines.slice(0, 10).join('\n');
        
        return {
          type: 'text',
          text: `📄 ${result.url}\n🔧 Method: ${result.method}\n📊 Content: ${result.content.length} chars, ${result.links.length} links\n\n📋 Preview:\n${preview}${lines.length > 10 ? '\n\n[Use format=full to see complete content]' : ''}`
        };
        
      case 'full':
      default:
        let output = `🌐 URL: ${result.url}\n`;
        output += `🔧 Method: ${result.method}\n`;
        output += `📊 Stats: ${result.content.length} characters`;
        
        if (result.links.length > 0) {
          output += `, ${result.links.length} links found`;
        }
        
        output += `\n\n${'='.repeat(80)}\n`;
        output += `📄 CONTENT:\n`;
        output += `${'='.repeat(80)}\n\n`;
        output += result.content;
        
        if (result.links.length > 0) {
          output += `\n\n${'='.repeat(80)}\n`;
          output += `🔗 LINKS FOUND:\n`;
          output += `${'='.repeat(80)}\n\n`;
          
          result.links.slice(0, 20).forEach((link, i) => {
            output += `${i + 1}. ${link.text}\n   ${link.url}\n\n`;
          });
          
          if (result.links.length > 20) {
            output += `... and ${result.links.length - 20} more links\n`;
          }
        }
        
        return {
          type: 'text',
          text: output
        };
    }
  }
}

// Initialize the MCP server
const terminalBrowser = new NascoderTerminalBrowser();

// Define tools
const TOOLS = [
  {
    name: "terminal_browse",
    description: "Browse websites and display content directly in terminal without saving files. Supports multiple terminal browsers (lynx, w3m, links) with fallback to fetch+html-to-text.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL to browse (must include http:// or https://)"
        },
        browser: {
          type: "string",
          enum: ["auto", "lynx", "w3m", "links", "elinks"],
          default: "auto",
          description: "Terminal browser to use (auto selects best available)"
        },
        format: {
          type: "string",
          enum: ["full", "content-only", "links-only", "summary"],
          default: "full",
          description: "Output format"
        },
        extractLinks: {
          type: "boolean",
          default: true,
          description: "Extract and display links from the page"
        },
        maxLength: {
          type: "number",
          default: 10000,
          description: "Maximum content length to display (prevents overwhelming output)"
        }
      },
      required: ["url"]
    }
  },
  {
    name: "check_browsers",
    description: "Check which terminal browsers are available on the system",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "extract_links",
    description: "Extract all links from a webpage without displaying the full content",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL to extract links from"
        },
        maxLinks: {
          type: "number",
          default: 50,
          description: "Maximum number of links to return"
        }
      },
      required: ["url"]
    }
  }
];

// Create and start server
const server = new Server(
  {
    name: "nascoder-terminal-browser-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case "terminal_browse":
        const { url, browser = 'auto', format = 'full', extractLinks = true, maxLength = 10000 } = args;
        
        if (!url) {
          throw new Error('URL is required');
        }
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          throw new Error('URL must start with http:// or https://');
        }
        
        const result = await terminalBrowser.browse(url, { browser, extractLinks, maxLength });
        const formatted = terminalBrowser.formatOutput(result, format);
        
        return {
          content: [formatted]
        };
        
      case "check_browsers":
        const availableBrowsers = await terminalBrowser.checkAvailableBrowsers();
        const browserList = Object.keys(availableBrowsers);
        
        let output = "🔧 Available Terminal Browsers:\n\n";
        
        if (browserList.length === 0) {
          output += "❌ No terminal browsers found!\n\n";
          output += "💡 Install one of these:\n";
          output += "   • lynx: brew install lynx (macOS) or apt install lynx (Ubuntu)\n";
          output += "   • w3m: brew install w3m (macOS) or apt install w3m (Ubuntu)\n";
          output += "   • links: brew install links (macOS) or apt install links (Ubuntu)\n";
        } else {
          browserList.forEach((browser, i) => {
            output += `${i + 1}. ✅ ${browser} - Available\n`;
          });
          output += `\n🎯 Recommended: ${browserList.includes('lynx') ? 'lynx' : browserList[0]} (best formatting)\n`;
        }
        
        output += "\n📋 Fallback: fetch+html-to-text (always available)";
        
        return {
          content: [{
            type: "text",
            text: output
          }]
        };
        
      case "extract_links":
        const { url: linkUrl, maxLinks = 50 } = args;
        
        if (!linkUrl) {
          throw new Error('URL is required');
        }
        
        const links = await terminalBrowser.extractLinks(linkUrl);
        const limitedLinks = links.slice(0, maxLinks);
        
        let linkOutput = `🔗 Extracted ${limitedLinks.length} links from ${linkUrl}:\n\n`;
        
        limitedLinks.forEach((link, i) => {
          linkOutput += `${i + 1}. ${link.text}\n   ${link.url}\n\n`;
        });
        
        if (links.length > maxLinks) {
          linkOutput += `... and ${links.length - maxLinks} more links (use maxLinks parameter to see more)\n`;
        }
        
        return {
          content: [{
            type: "text",
            text: linkOutput
          }]
        };
        
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    terminalBrowser.logger.error(`Tool ${name} failed:`, error.message);
    return {
      content: [{
        type: "text",
        text: `❌ Error: ${error.message}`
      }],
      isError: true
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  terminalBrowser.logger.info("NasCoder Terminal Browser MCP server started");
}

main().catch((error) => {
  terminalBrowser.logger.error("Server failed to start:", error);
  process.exit(1);
});
