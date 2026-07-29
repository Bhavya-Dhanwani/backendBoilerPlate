import { stripComments } from '../utils/commentStripper.js';

export function generateHealthRoutes(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import express${isTS ? ', { Request, Response }' : ''} from "express";\n`;
    code += `import Ok from "../responses/Ok.response${isTS ? '.js' : '.js'}";\n\n`;
  } else {
    code += `// Importing modules\n`;
    code += `const express = require("express");\n`;
    code += `const Ok = require("../responses/Ok.response");\n\n`;
  }

  code += `// Making the express router\n`;
  code += `const router = express.Router();\n\n`;

  code += `/*\n    @route GET /api/health\n    @desc checks server health\n    @access Public\n*/\n`;
  code += `router.get("/", (req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}) => {\n\n`;
  code += `    // sending Ok as response\n`;
  code += `    return Ok(res, "Server is healthy", {\n`;
  code += `        status: "UP",\n`;
  code += `        uptime: process.uptime(),\n`;
  code += `        timestamp: new Date().toISOString()\n`;
  code += `    });\n\n`;
  code += `});\n\n`;

  if (isESM) {
    code += `// exporting the router\n`;
    code += `export default router;\n`;
  } else {
    code += `// exporting the router\n`;
    code += `module.exports = router;\n`;
  }

  return config.comments ? code : stripComments(code);
}

export function generateIndexRouter(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';
  const isModular = config.folderStructure === 'Modular';

  const healthPath = './health.router';
  const authPath = isModular ? '../../modules/public/auth/auth.router' : './auth.router';

  let code = '';
  if (isESM) {
    code += `// Importing modules\n`;
    code += `import express from "express";\n`;
    code += `import healthRouter from "${healthPath}${isTS ? '.js' : '.js'}";\n`;
    if (config.auth) {
      code += `import authRouter from "${authPath}${isTS ? '.js' : '.js'}";\n`;
    }
  } else {
    code += `// Importing modules\n`;
    code += `const express = require("express");\n`;
    code += `const healthRouter = require("${healthPath}");\n`;
    if (config.auth) {
      code += `const authRouter = require("${authPath}");\n`;
    }
  }

  code += `\n// making the router\n`;
  code += `const router = express.Router();\n\n`;

  code += `// mounting the public routers\n`;
  code += `router.use("/health", healthRouter);\n`;
  if (config.auth) {
    code += `router.use("/auth", authRouter);\n`;
  }

  if (isESM) {
    code += `\n// exporting the router\n`;
    code += `export default router;\n`;
  } else {
    code += `\n// exporting the router\n`;
    code += `module.exports = router;\n`;
  }

  return config.comments ? code : stripComments(code);
}
