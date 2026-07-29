const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const serverPkg = path.join(__dirname, '../server/package.json');
let serverProcess = null;

function startServer() {
  if (serverProcess) {
    serverProcess.kill();
  }
  console.log('[Watch Script] Starting server...');
  serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '../server'),
    stdio: 'inherit',
    shell: true
  });
}

function installAndRestart() {
  console.log('[Watch Script] package.json changed! Reinstalling dependencies...');
  try {
    execSync('npm install', { cwd: path.join(__dirname, '../server'), stdio: 'inherit' });
    console.log('[Watch Script] Dependencies reinstalled successfully.');
    startServer();
  } catch (err) {
    console.error('[Watch Script] Error reinstalling dependencies:', err.message);
  }
}

if (fs.existsSync(serverPkg)) {
  startServer();
  fs.watchFile(serverPkg, { interval: 1000 }, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
      installAndRestart();
    }
  });
} else {
  console.error('[Watch Script] server/package.json not found!');
}