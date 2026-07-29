export function generateJestConfig(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  if (isESM) {
    return `
export default {
  testEnvironment: 'node',
  ${isTS ? "preset: 'ts-jest/presets/default-esm'," : ''}
  testMatch: ['**/__tests__/**/*.test.${isTS ? 'ts' : 'js'}'],
  ${isTS ? "moduleNameMapper: {\n    '^(\\\\.{1,2}/.*)\\\\.js$': '$1'\n  }," : ''}
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
`.trim();
  } else {
    return `
module.exports = {
  testEnvironment: 'node',
  ${isTS ? "preset: 'ts-jest'," : ''}
  testMatch: ['**/__tests__/**/*.test.${isTS ? 'ts' : 'js'}'],
  verbose: true,
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
`.trim();
  }
}

export function generateHealthTest(config) {
  const isTS = config.language === 'TypeScript';
  const isESM = config.moduleSystem === 'ES Modules';

  let code = '';
  if (isESM) {
    code += `import request from 'supertest';\n`;
    code += `import createApp from '../app${isTS ? '' : '.js'}';\n\n`;
  } else {
    code += `const request = require('supertest');\n`;
    code += `const createApp = require('../app');\n\n`;
  }

  code += `describe('GET /api/health', () => {\n`;
  code += `  it('should return 200 OK with server status', async () => {\n`;
  code += `    const app = createApp();\n`;
  code += `    const res = await request(app).get('/api/health');\n`;
  code += `    expect(res.status).toBe(200);\n`;
  code += `    expect(res.body.data).toHaveProperty('status', 'UP');\n`;
  code += `  });\n`;
  code += `});\n`;

  return code;
}
