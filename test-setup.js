#!/usr/bin/env node

// Test script to verify the ChatKit setup
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing ChatKit Setup...\n');

// Check if required directories exist
const requiredDirs = [
    'chatkit-app',
    'sample-website',
    'backend',
    'openai'
];

console.log('📁 Checking directories...');
requiredDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        console.log(`✅ ${dir}/ exists`);
    } else {
        console.log(`❌ ${dir}/ missing`);
    }
});

// Check if required files exist
const requiredFiles = [
    'chatkit-app/package.json',
    'chatkit-app/.env.local',
    'backend/package.json',
    'backend/.env',
    'sample-website/index.html',
    'sample-website/chatkit-with-backend.html',
    'backend/server.js'
];

console.log('\n📄 Checking files...');
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file} exists`);
    } else {
        console.log(`❌ ${file} missing`);
    }
});

// Check Node.js version
console.log('\n🔧 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 18) {
    console.log(`✅ Node.js ${nodeVersion} (compatible)`);
} else {
    console.log(`❌ Node.js ${nodeVersion} (requires 18+)`);
}

// Check if backend dependencies are installed
console.log('\n📦 Checking backend dependencies...');
if (fs.existsSync('backend/node_modules')) {
    console.log('✅ Backend dependencies installed');
} else {
    console.log('❌ Backend dependencies not installed. Run: cd backend && npm install');
}

// Check if ChatKit app dependencies are installed
console.log('\n📦 Checking ChatKit app dependencies...');
if (fs.existsSync('chatkit-app/node_modules')) {
    console.log('✅ ChatKit app dependencies installed');
} else {
    console.log('❌ ChatKit app dependencies not installed. Run: cd chatkit-app && npm install');
}

console.log('\n🚀 Setup Instructions:');
console.log('1. Set your OpenAI API key in both .env files');
console.log('2. Start the backend: cd backend && npm start');
console.log('3. Start the ChatKit app: cd chatkit-app && npm run dev');
console.log('4. Open sample-website/chatkit-with-backend.html in your browser');
console.log('\n📚 For detailed instructions, see README.md');
