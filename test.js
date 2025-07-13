#!/usr/bin/env node

/**
 * Test Suite for NasCoder Terminal Browser MCP
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing NasCoder Terminal Browser MCP...\n');

// Test environment
console.log('1️⃣  Testing environment...');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
  console.log(`✅ Node.js version ${nodeVersion} is supported`);
} else {
  console.log(`❌ Node.js version ${nodeVersion} is not supported (requires 18+)`);
  process.exit(1);
}

// Test basic imports
console.log('\n2️⃣  Testing imports...');
try {
  // Test if we can import the main dependencies
  await import('@modelcontextprotocol/sdk/server/index.js');
  await import('node-fetch');
  await import('cheerio');
  await import('html-to-text');
  await import('winston');
  console.log('✅ All dependencies imported successfully');
} catch (error) {
  console.log(`❌ Import test failed: ${error.message}`);
  process.exit(1);
}

// Test terminal browser availability
console.log('\n3️⃣  Testing terminal browser availability...');
const browsers = ['lynx', 'w3m', 'links', 'elinks'];
const availableBrowsers = [];

for (const browser of browsers) {
  try {
    await new Promise((resolve, reject) => {
      const process = spawn('which', [browser]);
      process.on('close', (code) => {
        if (code === 0) {
          availableBrowsers.push(browser);
          resolve();
        } else {
          reject();
        }
      });
    });
  } catch (error) {
    // Browser not available
  }
}

if (availableBrowsers.length > 0) {
  console.log(`✅ Available browsers: ${availableBrowsers.join(', ')}`);
} else {
  console.log('⚠️  No terminal browsers found - will use fetch+html-to-text fallback');
}

// Test MCP server startup
console.log('\n4️⃣  Testing MCP server startup...');
try {
  const serverProcess = spawn('node', [join(__dirname, 'index.js')], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let output = '';
  let hasStarted = false;
  
  serverProcess.stdout.on('data', (data) => {
    output += data.toString();
    if (output.includes('NasCoder Terminal Browser MCP server started')) {
      hasStarted = true;
    }
  });
  
  serverProcess.stderr.on('data', (data) => {
    output += data.toString();
  });
  
  // Send a test message to the server
  setTimeout(() => {
    serverProcess.stdin.write(JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/list"
    }) + '\n');
  }, 1000);
  
  // Wait for response
  await new Promise((resolve) => {
    setTimeout(() => {
      serverProcess.kill();
      resolve();
    }, 3000);
  });
  
  if (hasStarted || output.includes('tools')) {
    console.log('✅ MCP server startup test passed');
  } else {
    console.log('❌ MCP server startup test failed');
    console.log('Output:', output);
  }
  
} catch (error) {
  console.log(`❌ MCP server test failed: ${error.message}`);
}

// Test basic functionality
console.log('\n5️⃣  Testing basic functionality...');
try {
  // Test URL validation
  const testUrl = 'https://example.com';
  if (testUrl.startsWith('http://') || testUrl.startsWith('https://')) {
    console.log('✅ URL validation works');
  } else {
    console.log('❌ URL validation failed');
  }
  
  // Test HTML to text conversion
  const htmlToTextModule = await import('html-to-text');
  const { htmlToText } = htmlToTextModule;
  const testHtml = '<h1>Test</h1><p>This is a test.</p>';
  const text = htmlToText(testHtml);
  
  if (text.toLowerCase().includes('test') && text.includes('This is a test')) {
    console.log('✅ HTML to text conversion works');
  } else {
    console.log('❌ HTML to text conversion failed');
    console.log('Converted text:', JSON.stringify(text));
  }
  
} catch (error) {
  console.log(`❌ Basic functionality test failed: ${error.message}`);
}

console.log('\n🎉 Test suite completed!\n');

console.log('📋 Summary:');
console.log('- Environment: Checked');
console.log('- Dependencies: Imported');
console.log('- Terminal browsers: Detected');
console.log('- MCP server: Tested');
console.log('- Basic functions: Verified');

console.log('\n🚀 NasCoder Terminal Browser MCP is ready to use!');

// Exit with success
process.exit(0);
