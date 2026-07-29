import { stripComments } from '../utils/commentStripper.js';

export function generateServerFile(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isModular = config.folderStructure === 'Modular';

  const configPath = isModular ? './src/shared/config' : './src/config';

  let code = '';

  if (isESM) {
    code += `import createApp from "./src/app${isTS ? '.js' : '.js'}";\n`;
    code += `import connectDB from "${configPath}/db.config${isTS ? '.js' : '.js'}";\n`;
    code += `import env from "${configPath}/env.config${isTS ? '.js' : '.js'}";\n`;
    code += `import logger from "${configPath}/logger.config${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `require('dotenv').config();\n`;
    code += `const createApp = require('./src/app');\n`;
    code += `const connectDB = require('${configPath}/db.config');\n`;
    code += `const env = require('${configPath}/env.config');\n`;
    code += `const logger = require('${configPath}/logger.config');\n\n`;
  }

  code += `async function startServer() {\n`;
  code += `\tconst app = createApp();\n\n`;
  code += `\tawait connectDB();\n\n`;
  code += `\tapp.listen(env.PORT || 5000, () => {\n`;
  code += `\t\tlogger.info(\`Server is running on port \${env.PORT || 5000}\`);\n`;
  code += `\t});\n`;
  code += `}\n\n`;
  code += `startServer();\n`;

  return config.comments ? code : stripComments(code);
}

export function generateAppFile(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isModular = config.folderStructure === 'Modular';
  const hasSwagger = config.swagger;

  const baseRel = isModular ? './shared' : '.';
  const routesDirName = isModular ? 'routers' : 'routes';

  let code = '';

  if (isESM) {
    code += `// Importing modules\n`;
    code += `import express${isTS ? ', { Express }' : ''} from "express";\n`;
    code += `import path from "node:path";\n`;
    code += `import { fileURLToPath } from "node:url";\n`;
    code += `import { existsSync } from "node:fs";\n`;
    code += `import router from "${baseRel}/${routesDirName}/index.router${isTS ? '.js' : '.js'}";\n`;
    code += `import applyMiddlewares from "${baseRel}/middlewares/index.middleware${isTS ? '.js' : '.js'}";\n`;
    code += `import notFoundHandler from "${baseRel}/middlewares/NotFound.middleware${isTS ? '.js' : '.js'}";\n`;
    code += `import errorHandler from "${baseRel}/middlewares/error.middleware${isTS ? '.js' : '.js'}";\n`;
    if (hasSwagger) {
      code += `import { setupSwagger } from "${baseRel}/swagger${isTS ? '.js' : '.js'}";\n`;
    }
    code += `\n`;
    code += `const serverDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");\n`;
    code += `const publicDirectory = path.join(serverDirectory, "public");\n`;
    code += `const frontendIndex = path.join(publicDirectory, "index.html");\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const express = require("express");\n`;
    code += `const path = require("path");\n`;
    code += `const { existsSync } = require("fs");\n`;
    code += `const router = require("${baseRel}/${routesDirName}/index.router");\n`;
    code += `const applyMiddlewares = require("${baseRel}/middlewares/index.middleware");\n`;
    code += `const notFoundHandler = require("${baseRel}/middlewares/NotFound.middleware");\n`;
    code += `const errorHandler = require("${baseRel}/middlewares/error.middleware");\n`;
    if (hasSwagger) {
      code += `const { setupSwagger } = require("${baseRel}/swagger");\n`;
    }
    code += `\n`;
    code += `const serverDirectory = path.resolve(__dirname, "..");\n`;
    code += `const publicDirectory = path.join(serverDirectory, "public");\n`;
    code += `const frontendIndex = path.join(publicDirectory, "index.html");\n\n`;
  }

  code += `// function to make the app\n`;
  code += `function createApp()${isTS ? ': Express' : ''} {\n\n`;

  code += `    // create an express app\n`;
  code += `    const app = express();\n\n`;

  code += `    // applying middlewares\n`;
  code += `    applyMiddlewares(app);\n\n`;

  code += `    // adding the index router to the app\n`;
  code += `    app.use("/api", router);\n\n`;

  code += `    // API routes must continue returning JSON 404 responses instead of the SPA shell.\n`;
  code += `    app.use("/api", notFoundHandler);\n\n`;

  if (hasSwagger) {
    code += `    // setting up swagger documentation\n`;
    code += `    setupSwagger(app);\n\n`;
  }

  code += `    // Serve a built frontend copied into server/public, when present.\n`;
  code += `    if (existsSync(frontendIndex)) {\n`;
  code += `        app.use(express.static(publicDirectory));\n\n`;
  code += `        // Express 5 requires a named wildcard. This lets client-side routes reload correctly.\n`;
  code += `        app.get("/*path", (req, res) => res.sendFile(frontendIndex));\n`;
  code += `    }\n\n`;

  code += `    // not found middleware\n`;
  code += `    app.use(notFoundHandler);\n\n`;

  code += `    // error handling middleware\n`;
  code += `    app.use(errorHandler);\n\n`;

  code += `    // returning the app\n`;
  code += `    return app;\n\n`;
  code += `}\n\n`;

  if (isESM) {
    code += `export default createApp;\n`;
  } else {
    code += `module.exports = createApp;\n`;
  }

  return config.comments ? code : stripComments(code);
}
