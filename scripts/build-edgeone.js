#!/usr/bin/env node

/**
 * Build script for EdgeOne Pages deployment
 * This script sets the appropriate environment variables for EdgeOne Pages
 */

const { execSync } = require('child_process');
const path = require('path');

// Set environment variables for EdgeOne Pages
process.env.EDGEONE_PAGES = '1';
process.env.NODE_ENV = 'production';

console.log('🚀 Building for EdgeOne Pages...');
console.log('Environment variables set:');
console.log('- EDGEONE_PAGES=1');
console.log('- NODE_ENV=production');

try {
  // Run the presource script
  console.log('\n📦 Running presource script...');
  execSync('npm run presource', { stdio: 'inherit', cwd: process.cwd() });
  
  // Run the build
  console.log('\n🔨 Building application...');
  execSync('npx vite build', { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('\n✅ Build completed successfully!');
  console.log('📁 Output directory: dist/output/public');
  console.log('\n📋 EdgeOne Pages deployment instructions:');
  console.log('1. Upload the contents of dist/output/public to EdgeOne Pages');
  console.log('2. Set the following environment variables in EdgeOne Pages dashboard:');
  console.log('   - EDGEONE_PAGES=1');
  console.log('   - G_CLIENT_ID=your_github_client_id (if using login)');
  console.log('   - G_CLIENT_SECRET=your_github_client_secret (if using login)');
  console.log('   - JWT_SECRET=your_jwt_secret (if using login)');
  console.log('   - INIT_TABLE=false (set to true only on first deployment)');
  console.log('   - ENABLE_CACHE=false (EdgeOne Pages doesn\'t support D1 database)');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
