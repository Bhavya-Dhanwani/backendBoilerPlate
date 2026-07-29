import { stripComments } from '../utils/commentStripper.js';

export function generateSwagger(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `import swaggerUi from 'swagger-ui-express';\n`;
    if (isTS) {
      code += `import { Express } from 'express';\n`;
    }
    code += `\n`;
  } else {
    code += `const swaggerUi = require('swagger-ui-express');\n\n`;
  }

  code += `const swaggerSpec = {\n`;
  code += `  openapi: '3.0.0',\n`;
  code += `  info: {\n`;
  code += `    title: '${config.projectName} API Documentation',\n`;
  code += `    version: '1.0.0',\n`;
  code += `    description: 'Production-ready Express Backend API Specs'\n`;
  code += `  },\n`;
  code += `  servers: [\n`;
  code += `    { url: 'http://localhost:' + (process.env.PORT || 5000) + '/api/v1', description: 'Development Server' }\n`;
  code += `  ],\n`;
  code += `  components: {\n`;
  code += `    securitySchemes: {\n`;
  code += `      bearerAuth: {\n`;
  code += `        type: 'http',\n`;
  code += `        scheme: 'bearer',\n`;
  code += `        bearerFormat: 'JWT'\n`;
  code += `      }\n`;
  code += `    }\n`;
  code += `  }\n`;
  code += `};\n\n`;

  code += `export function setupSwagger(app${isTS ? ': Express' : ''}) {\n`;
  code += `  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));\n`;
  code += `}\n`;

  if (!isESM) {
    code = code.replace('export function setupSwagger', 'function setupSwagger');
    code += `\nmodule.exports = { setupSwagger };\n`;
  }

  return config.comments ? code : stripComments(code);
}
