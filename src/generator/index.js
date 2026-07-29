import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';

import { saveConfig } from '../cli/configStore.js';
import { generateServerFile, generateAppFile } from './templates/serverTemplates.js';
import {
  generateEnvConstants,
  generateEnvConfig,
  generateStatusCodes,
  generateTokensConstants,
  generateApiError,
  generateSubErrors,
  generateApiResponse,
  generateResponseHelpers,
  generateHashingUtil,
  generateIndexMiddleware,
  generateErrorHandler,
  generateNotFoundHandler,
  generateValidateMiddleware,
  generateValidateErrorsUtil,
  generateAuthMiddleware,
  generateRefreshMiddleware,
  generateDbConfig,
  generateLogger,
  generateMailConfig,
  generateUserDao,
  generateSessionDao,
  generateTokenDao,
  generateSessionModel,
  generateTokenModel,
  generateUserSanitizer,
  generateTokenUtil,
  generateBuildTokenPayloadUtil,
  generateCreateSessionUtil,
  generateSendMailUtil,
  generateGoogleAuthUtil
} from './templates/sharedTemplates.js';
import {
  generateUserModel,
  generateAuthTypes,
  generateAuthController,
  generateAuthRoutes,
  generateAuthValidators
} from './templates/authTemplates.js';
import { generateHealthRoutes, generateIndexRouter } from './templates/routerTemplates.js';
import { generateSwagger } from './templates/swaggerTemplates.js';
import {
  generateDockerfile,
  generateDockerCompose,
  generateDockerIgnore,
  generateWatchPackageScript
} from './templates/dockerTemplates.js';
import { generateJestConfig, generateHealthTest } from './templates/testingTemplates.js';
import { generatePackageJson } from './templates/packageJsonTemplate.js';
import {
  generateEnv,
  generateGitIgnore,
  generateEslintConfig,
  generatePrettierConfig,
  generateTsConfig,
  generateReadme
} from './templates/configFilesTemplate.js';
import { installDependencies } from './utils/installer.js';

export async function generateProject(config, outputDir = process.cwd()) {
  const spinner = ora('Scaffolding backend boilerplate matching randomshit/server architecture...').start();
  const projectDir = path.join(outputDir, config.projectName);
  const serverDir = path.join(projectDir, 'server');
  const srcDir = path.join(serverDir, 'src');

  const isTS = config.language === 'TypeScript';
  const ext = isTS ? 'ts' : 'js';

  try {
    // 1. Save config for future reuse
    saveConfig(config);

    // 2. Ensure directories
    await fs.ensureDir(projectDir);
    await fs.ensureDir(serverDir);
    await fs.ensureDir(srcDir);

    // 3. Generate server core
    await fs.outputFile(path.join(serverDir, `server.${ext}`), generateServerFile(config));
    await fs.outputFile(path.join(srcDir, `app.${ext}`), generateAppFile(config));

    // 4. Generate core components matching requested structure (Modular vs MVC)
    const isModular = config.folderStructure === 'Modular';
    const baseDir = isModular ? path.join(srcDir, 'shared') : srcDir;
    const routesDirName = isModular ? 'routers' : 'routes';
    const sessionModelName = isModular ? 'sessions.model' : 'session.model';

    const isMultiToken = typeof config.multiToken === 'boolean'
      ? config.multiToken
      : config.tokenStrategy
        ? config.tokenStrategy.includes('Multi Token')
        : true;
    const hasGoogle = Boolean(config.googleAuth);
    const hasEmailVerif = Boolean(config.emailVerification);
    const hasForgotPass = Boolean(config.forgotPassword);
    const hasTokenDao = hasEmailVerif || hasForgotPass;

    // Constants
    await fs.outputFile(path.join(baseDir, 'constants', `env.constants.${ext}`), generateEnvConstants(config));
    await fs.outputFile(path.join(baseDir, 'constants', `StatusCodes.constants.${ext}`), generateStatusCodes(config));
    await fs.outputFile(path.join(baseDir, 'constants', `tokens.constants.${ext}`), generateTokensConstants(config));

    // Config
    await fs.outputFile(path.join(baseDir, 'config', `env.config.${ext}`), generateEnvConfig(config));
    await fs.outputFile(path.join(baseDir, 'config', `db.config.${ext}`), generateDbConfig(config));
    await fs.outputFile(path.join(baseDir, 'config', `logger.config.${ext}`), generateLogger(config));
    if (hasTokenDao) {
      await fs.outputFile(path.join(baseDir, 'config', `mail.config.${ext}`), generateMailConfig(config));
    }

    // Utils & Errors
    await fs.outputFile(path.join(baseDir, 'utils', `ApiError.util.${ext}`), generateApiError(config));
    await fs.outputFile(path.join(baseDir, 'utils', `ApiResponse.util.${ext}`), generateApiResponse(config));
    await fs.outputFile(path.join(baseDir, 'utils', `hashing.util.${ext}`), generateHashingUtil(config));
    await fs.outputFile(path.join(baseDir, 'utils', `validateErrors.util.${ext}`), generateValidateErrorsUtil(config));
    await fs.outputFile(path.join(baseDir, 'utils', `token.util.${ext}`), generateTokenUtil(config));
    await fs.outputFile(path.join(baseDir, 'utils', `buildTokenPayload.util.${ext}`), generateBuildTokenPayloadUtil(config));
    await fs.outputFile(path.join(baseDir, 'utils', `createSession.util.${ext}`), generateCreateSessionUtil(config));
    if (hasTokenDao) {
      await fs.outputFile(path.join(baseDir, 'utils', `sendMail.util.${ext}`), generateSendMailUtil(config));
    }
    if (hasGoogle) {
      await fs.outputFile(path.join(baseDir, 'utils', `googleAuth.util.${ext}`), generateGoogleAuthUtil(config));
    }

    await fs.outputFile(path.join(baseDir, 'errors', `BadRequest.error.${ext}`), generateSubErrors(config, 'BadRequest'));
    await fs.outputFile(path.join(baseDir, 'errors', `Unauthorized.error.${ext}`), generateSubErrors(config, 'Unauthorized'));
    await fs.outputFile(path.join(baseDir, 'errors', `Forbidden.error.${ext}`), generateSubErrors(config, 'Forbidden'));
    await fs.outputFile(path.join(baseDir, 'errors', `NotFound.error.${ext}`), generateSubErrors(config, 'NotFound'));
    await fs.outputFile(path.join(baseDir, 'errors', `Conflict.error.${ext}`), generateSubErrors(config, 'Conflict'));

    // Responses
    await fs.outputFile(path.join(baseDir, 'responses', `Ok.response.${ext}`), generateResponseHelpers(config, 'Ok'));
    await fs.outputFile(path.join(baseDir, 'responses', `Created.response.${ext}`), generateResponseHelpers(config, 'Created'));
    await fs.outputFile(path.join(baseDir, 'responses', `NoContent.response.${ext}`), generateResponseHelpers(config, 'NoContent'));

    // Middlewares
    await fs.outputFile(path.join(baseDir, 'middlewares', `index.middleware.${ext}`), generateIndexMiddleware(config));
    await fs.outputFile(path.join(baseDir, 'middlewares', `error.middleware.${ext}`), generateErrorHandler(config));
    await fs.outputFile(path.join(baseDir, 'middlewares', `NotFound.middleware.${ext}`), generateNotFoundHandler(config));
    await fs.outputFile(path.join(baseDir, 'middlewares', `validate.middleware.${ext}`), generateValidateMiddleware(config));
    await fs.outputFile(path.join(baseDir, 'middlewares', `auth.middleware.${ext}`), generateAuthMiddleware(config));
    if (isMultiToken) {
      await fs.outputFile(path.join(baseDir, 'middlewares', `refresh.middleware.${ext}`), generateRefreshMiddleware(config));
    }

    // Models, DAOs & Sanitizers
    await fs.outputFile(path.join(baseDir, 'models', `user.model.${ext}`), generateUserModel(config));
    if (isMultiToken) {
      await fs.outputFile(path.join(baseDir, 'models', `${sessionModelName}.${ext}`), generateSessionModel(config));
    }
    if (hasTokenDao) {
      await fs.outputFile(path.join(baseDir, 'models', `token.model.${ext}`), generateTokenModel(config));
    }

    await fs.outputFile(path.join(baseDir, 'dao', `user.dao.${ext}`), generateUserDao(config));
    if (isMultiToken) {
      await fs.outputFile(path.join(baseDir, 'dao', `session.dao.${ext}`), generateSessionDao(config));
    }
    if (hasTokenDao) {
      await fs.outputFile(path.join(baseDir, 'dao', `token.dao.${ext}`), generateTokenDao(config));
    }

    await fs.outputFile(path.join(baseDir, 'sanitizers', `user.sanitizer.${ext}`), generateUserSanitizer(config));

    // Routers / Routes
    await fs.outputFile(path.join(baseDir, routesDirName, `health.router.${ext}`), generateHealthRoutes(config));
    await fs.outputFile(path.join(baseDir, routesDirName, `index.router.${ext}`), generateIndexRouter(config));

    if (config.swagger) {
      await fs.outputFile(path.join(baseDir, `swagger.${ext}`), generateSwagger(config));
    }

    // 5. Generate Auth Module / MVC Files
    if (config.auth || config.authentication) {
      if (isModular) {
        const authDir = path.join(srcDir, 'modules', 'public', 'auth');
        if (isTS) {
          await fs.outputFile(path.join(authDir, `auth.types.ts`), generateAuthTypes(config));
        }
        await fs.outputFile(path.join(authDir, `auth.controller.${ext}`), generateAuthController(config));
        await fs.outputFile(path.join(authDir, `auth.router.${ext}`), generateAuthRoutes(config));
        await fs.outputFile(path.join(authDir, `auth.validator.${ext}`), generateAuthValidators(config));
      } else {
        // MVC Structure File Placement
        if (isTS) {
          await fs.outputFile(path.join(srcDir, 'controllers', `auth.types.ts`), generateAuthTypes(config));
        }
        await fs.outputFile(path.join(srcDir, 'controllers', `auth.controller.${ext}`), generateAuthController(config));
        await fs.outputFile(path.join(srcDir, 'routes', `auth.router.${ext}`), generateAuthRoutes(config));
        await fs.outputFile(path.join(srcDir, 'validators', `auth.validator.${ext}`), generateAuthValidators(config));
      }
    }

    // 6. Generate configuration files
    await fs.outputFile(path.join(projectDir, '.gitignore'), generateGitIgnore());
    await fs.outputFile(path.join(serverDir, 'package.json'), generatePackageJson(config));
    await fs.outputFile(path.join(serverDir, '.env'), generateEnv(config));
    await fs.outputFile(path.join(serverDir, '.env.example'), generateEnv(config));
    await fs.outputFile(path.join(serverDir, '.gitignore'), generateGitIgnore());
    await fs.outputFile(path.join(serverDir, 'eslint.config.js'), generateEslintConfig(config));
    await fs.outputFile(path.join(serverDir, 'prettier.config.js'), generatePrettierConfig());
    await fs.outputFile(path.join(serverDir, 'README.md'), generateReadme(config));

    if (isTS) {
      await fs.outputFile(path.join(serverDir, 'tsconfig.json'), generateTsConfig(config));
    }

    if (config.testing) {
      await fs.outputFile(path.join(serverDir, 'jest.config.js'), generateJestConfig(config));
      await fs.outputFile(path.join(srcDir, '__tests__', `health.test.${ext}`), generateHealthTest(config));
    }

    // 7. Generate Docker integration in root if Docker enabled
    if (config.docker) {
      await fs.outputFile(path.join(projectDir, 'Dockerfile'), generateDockerfile(config));
      await fs.outputFile(path.join(projectDir, 'docker-compose.yml'), generateDockerCompose(config));
      await fs.outputFile(path.join(projectDir, '.dockerignore'), generateDockerIgnore());
      await fs.outputFile(path.join(projectDir, 'scripts', 'watch-package.js'), generateWatchPackageScript(config));
    }

    spinner.succeed(chalk.bold.green(`Successfully scaffolded ${config.projectName}!`));

    // 8. Run dependency installation if requested
    if (config.installDependencies) {
      await installDependencies(serverDir);
    }

    console.log();
    console.log(chalk.bold.cyan('  Next steps:'));
    console.log(chalk.white(`    cd ${config.projectName}/server`));
    if (!config.installDependencies) {
      console.log(chalk.white('    npm install'));
    }
    console.log(chalk.white('    npm run dev'));
    console.log();

  } catch (err) {
    spinner.fail(chalk.red('Scaffolding failed.'));
    console.error(err);
    throw err;
  }
}
