export function generateEnv(config) {
  return `
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/${config.projectName}
CORS_ORIGIN=*

# JWT Authentication
JWT_SECRET=super_secret_access_jwt_key_change_in_production
${config.tokenStrategy === 'Multi Token (Access + Refresh)' ? 'JWT_REFRESH_SECRET=super_secret_refresh_jwt_key_change_in_production' : ''}

# Logging
LOG_LEVEL=info

${config.googleAuth ? `
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
` : ''}
`.trim();
}

export function generateGitIgnore() {
  return `
# Dependencies
node_modules
.pnpm-store

# Environment & Secret files
.env
.env.local
.env.development
.env.test
.env.production

# Build outputs
dist
build
*.tsbuildinfo

# Logs & Runtime data
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs

# Testing & Coverage
coverage
.nyc_output

# OS & Editor files
.DS_Store
Thumbs.db
.vscode
.idea
`.trim();
}

export function generateEslintConfig(config) {
  const isESM = config.moduleSystem === 'ES Modules';
  if (isESM) {
    return `
export default [
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
`.trim();
  } else {
    return `
module.exports = [
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off"
    }
  }
];
`.trim();
  }
}

export function generatePrettierConfig() {
  return JSON.stringify({
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: "none",
    printWidth: 100
  }, null, 2);
}

export function generateTsConfig(config) {
  const isESM = config.moduleSystem === 'ES Modules';
  return JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      module: isESM ? "NodeNext" : "CommonJS",
      moduleResolution: isESM ? "NodeNext" : "Node",
      outDir: "./dist",
      rootDir: "./",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true
    },
    include: ["server.ts", "src/**/*"],
    exclude: ["node_modules", "dist", "**/__tests__/*"]
  }, null, 2);
}

export function generateReadme(config) {
  return `
# ${config.projectName}

Production-ready Express backend generated using **create-backend-app**.

## Features

- **Language:** ${config.language}
- **Module System:** ${config.moduleSystem}
- **Architecture:** ${config.folderStructure} (${config.programmingStyle})
- **Database:** ${config.database}
- **Auth:** ${config.auth ? `Enabled (${config.tokenStrategy})` : 'Disabled'}
- **Logger:** ${config.logger}
- **Swagger Documentation:** ${config.swagger ? 'Enabled (`/docs`)' : 'Disabled'}
- **Docker Support:** ${config.docker ? 'Enabled' : 'Disabled'}
- **Testing:** ${config.testing ? 'Jest' : 'Disabled'}

## Getting Started

### 1. Environment Setup
Copy \`.env.example\` to \`.env\` and update the variables:
\`\`\`bash
cp .env.example .env
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

${config.docker ? `
### 4. Docker Deployment
Run application and MongoDB with Docker Compose from the root directory:
\`\`\`bash
docker-compose up --build
\`\`\`
` : ''}

${config.swagger ? `
### API Documentation
Access Swagger UI at: \`http://localhost:5000/docs\`
` : ''}
`.trim();
}
