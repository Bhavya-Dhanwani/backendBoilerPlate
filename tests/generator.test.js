import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';

import { saveConfig, loadConfig, hasConfig } from '../src/cli/configStore.js';
import { RECOMMENDED_CONFIG } from '../src/cli/prompts.js';
import { generateProject } from '../src/generator/index.js';

test('ConfigStore - save, load, and hasConfig', () => {
  const testConfig = {
    ...RECOMMENDED_CONFIG,
    projectName: 'test-config-app'
  };

  saveConfig(testConfig);
  assert.equal(hasConfig(), true);

  const loaded = loadConfig();
  assert.notEqual(loaded, null);
  assert.equal(loaded.language, 'TypeScript');
  assert.equal(loaded.moduleSystem, 'ES Modules');
});

test('Generator - Recommended setup matching randomshit/server architecture', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cba-test-rec-'));
  const config = {
    projectName: 'my-rec-backend',
    ...RECOMMENDED_CONFIG,
    installDependencies: false
  };

  await generateProject(config, tmpDir);

  const projectPath = path.join(tmpDir, 'my-rec-backend');
  const serverPath = path.join(projectPath, 'server');

  // Verify Root Docker files
  assert.equal(await fs.pathExists(path.join(projectPath, 'Dockerfile')), true);
  assert.equal(await fs.pathExists(path.join(projectPath, 'docker-compose.yml')), true);
  assert.equal(await fs.pathExists(path.join(projectPath, '.dockerignore')), true);
  assert.equal(await fs.pathExists(path.join(projectPath, 'scripts', 'watch-package.js')), true);

  // Verify Server Entry Points
  assert.equal(await fs.pathExists(path.join(serverPath, 'server.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'app.ts')), true);

  // Verify Public Auth module structure matching randomshit/server
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'modules', 'public', 'auth', 'auth.controller.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'modules', 'public', 'auth', 'auth.router.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'modules', 'public', 'auth', 'auth.validator.ts')), true);

  // Verify Shared Architecture (DAO, Models, Errors, Responses, Middlewares, Utils, Config)
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'utils', 'ApiError.util.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'utils', 'hashing.util.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'utils', 'validateErrors.util.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'utils', 'createSession.util.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'utils', 'token.util.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'utils', 'sendMail.util.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'utils', 'googleAuth.util.ts')), true);

  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'models', 'user.model.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'models', 'sessions.model.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'models', 'token.model.ts')), true);

  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'dao', 'user.dao.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'dao', 'session.dao.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'dao', 'token.dao.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'sanitizers', 'user.sanitizer.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'routers', 'index.router.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'routers', 'health.router.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'config', 'db.config.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'config', 'env.config.ts')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'shared', 'config', 'logger.config.ts')), true);

  await fs.remove(tmpDir);
});

test('Generator - Custom JavaScript + CommonJS + MVC + Function based without Docker', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cba-test-custom-'));
  const config = {
    projectName: 'custom-mvc-app',
    language: 'JavaScript',
    moduleSystem: 'CommonJS',
    folderStructure: 'MVC',
    programmingStyle: 'Function Based',
    auth: true,
    tokenStrategy: 'Single Token',
    emailVerification: false,
    forgotPassword: false,
    googleAuth: false,
    database: 'MongoDB (Mongoose)',
    logger: 'Morgan',
    swagger: false,
    testing: true,
    comments: false,
    docker: false,
    installDependencies: false
  };

  await generateProject(config, tmpDir);

  const projectPath = path.join(tmpDir, 'custom-mvc-app');
  const serverPath = path.join(projectPath, 'server');

  // Docker should NOT exist
  assert.equal(await fs.pathExists(path.join(projectPath, 'Dockerfile')), false);

  // Verify structure (.js extension)
  assert.equal(await fs.pathExists(path.join(serverPath, 'server.js')), true);
  assert.equal(await fs.pathExists(path.join(serverPath, 'src', 'app.js')), true);

  // Verify comments stripped
  const appContent = await fs.readFile(path.join(serverPath, 'src', 'app.js'), 'utf-8');
  assert.equal(appContent.includes('// Importing modules'), false);

  await fs.remove(tmpDir);
});
