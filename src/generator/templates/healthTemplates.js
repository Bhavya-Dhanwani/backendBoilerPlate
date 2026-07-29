import { stripComments } from '../utils/commentStripper.js';

export function generateHealthRoutes(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `import { Router${isTS ? ', Request, Response' : ''} } from 'express';\n\n`;
  } else {
    code += `const { Router } = require('express');\n\n`;
  }

  code += `export const healthRouter = Router();\n\n`;
  code += `healthRouter.get('/', (req${isTS ? ': Request' : ''}, res${isTS ? ': Response' : ''}) => {\n`;
  code += `  res.status(200).json({\n`;
  code += `    status: 'UP',\n`;
  code += `    uptime: process.uptime(),\n`;
  code += `    timestamp: new Date().toISOString()\n`;
  code += `  });\n`;
  code += `});\n`;

  if (!isESM) {
    code = code.replace('export const healthRouter', 'const healthRouter');
    code += `\nmodule.exports = { healthRouter };\n`;
  }

  return config.comments ? code : stripComments(code);
}
