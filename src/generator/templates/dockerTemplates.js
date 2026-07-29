export function generateDockerfile(config) {
  const isTS = config.language === 'TypeScript';
  return `
# Multi-stage Dockerfile
# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci

# Copy server source code
COPY server/ ./
${isTS ? 'RUN npm run build' : ''}

# Stage 2: Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
WORKDIR /app/server

COPY --from=builder /app/server/package*.json ./
RUN npm ci --only=production

${isTS ? 'COPY --from=builder /app/server/dist ./dist' : 'COPY --from=builder /app/server/src ./src'}
COPY --from=builder /app/server/server.${isTS ? 'js' : 'js'} ./server.js

EXPOSE 5000
CMD ["node", "server.js"]
`.trim();
}

export function generateDockerCompose(config) {
  return `
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongodb:27017/${config.projectName}
      - JWT_SECRET=super_secret_jwt_key
      - JWT_REFRESH_SECRET=super_secret_refresh_key
    depends_on:
      - mongodb
    restart: always

  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: always

volumes:
  mongodb_data:
`.trim();
}

export function generateDockerIgnore() {
  return `
node_modules
npm-debug.log
.git
.gitignore
.env
dist
coverage
scripts
.dockerignore
Dockerfile
docker-compose.yml
`.trim();
}

export function generateWatchPackageScript(config) {
  return `
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
`.trim();
}
