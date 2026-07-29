import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { hasConfig, loadConfig } from './configStore.js';

async function yesNo(message, defaultYes = true) {
  const result = await select({
    message,
    choices: [
      { name: 'Yes', value: true },
      { name: 'No', value: false }
    ],
    default: defaultYes
  });
  return result;
}

export const RECOMMENDED_CONFIG = {
  language: 'TypeScript',
  moduleSystem: 'ES Modules',
  folderStructure: 'Modular',
  programmingStyle: 'Class Based',
  auth: true,
  tokenStrategy: 'Multi Token (Access + Refresh)',
  emailVerification: true,
  forgotPassword: true,
  googleAuth: true,
  database: 'MongoDB (Mongoose)',
  logger: 'Pino Logger',
  swagger: true,
  testing: true,
  comments: true,
  docker: true,
  installDependencies: true
};

export async function runPrompts() {
  const projectName = await input({
    message: 'Project name',
    default: 'my-backend',
    validate: (val) => {
      if (!val || !/^[a-zA-Z0-9_-]+$/.test(val.trim())) {
        return 'Please enter a valid directory name (alphanumeric, dashes, underscores)';
      }
      return true;
    }
  });

  const previousConfig = loadConfig();

  const setupChoices = [
    {
      name: `Recommended ${chalk.dim('(TypeScript • ES Modules • Modular • Class Based • Multi Token • Mongoose • Pino • Swagger • Docker • Jest)')}`,
      value: 'recommended',
      description: 'Scaffold production-ready Express app with industry-standard defaults'
    },
    {
      name: `Custom ${chalk.dim('(Select language, architecture, auth, logger, swagger, docker step-by-step)')}`,
      value: 'custom',
      description: 'Customize every layer of your Express application'
    }
  ];

  // If user has previous configuration stored (NOT a 1st time user), offer Reuse option
  if (previousConfig) {
    setupChoices.push({
      name: `Reuse Previous Configuration ${chalk.dim(`(Saved: ${previousConfig.language} • ${previousConfig.folderStructure} • ${previousConfig.programmingStyle} • ${previousConfig.auth ? 'Auth Enabled' : 'No Auth'})`)}`,
      value: 'reuse',
      description: 'Use your last saved choices instantly'
    });
  }

  const setupChoice = await select({
    message: 'Choose a setup',
    choices: setupChoices
  });

  if (setupChoice === 'reuse' && previousConfig) {
    console.log(chalk.green('\n✓ Found previous configuration.'));
    const reuse = await yesNo('Reuse it?', true);

    if (reuse) {
      return {
        projectName: projectName.trim(),
        ...previousConfig
      };
    }
  }

  if (setupChoice === 'recommended') {
    return {
      projectName: projectName.trim(),
      ...RECOMMENDED_CONFIG
    };
  }

  // Custom configuration step-by-step flow with ghost / dim text previews
  const language = await select({
    message: 'Language',
    choices: [
      { name: `TypeScript ${chalk.dim('(Strict types, compilation, tsconfig)')}`, value: 'TypeScript' },
      { name: `JavaScript ${chalk.dim('(Plain Node.js JavaScript)')}`, value: 'JavaScript' }
    ]
  });

  const moduleSystem = await select({
    message: 'Module System',
    choices: [
      { name: `ES Modules ${chalk.dim('(import/export, "type": "module")')}`, value: 'ES Modules' },
      { name: `CommonJS ${chalk.dim('(require/module.exports)')}`, value: 'CommonJS' }
    ]
  });

  const folderStructure = await select({
    message: 'Folder Structure',
    choices: [
      { name: `Modular ${chalk.dim('(Domain-driven modules: auth, users, etc.)')}`, value: 'Modular' },
      { name: `MVC ${chalk.dim('(Classic Model-View-Controller folders)')}`, value: 'MVC' }
    ]
  });

  const programmingStyle = await select({
    message: 'Programming Style',
    choices: [
      { name: `Class Based ${chalk.dim('(Controllers & Services as ES6/TS Classes)')}`, value: 'Class Based' },
      { name: `Function Based ${chalk.dim('(Exported pure/async functions)')}`, value: 'Function Based' }
    ]
  });

  const auth = await yesNo(`Enable Authentication? ${chalk.dim('(JWT, Signup, Login, Logout)')}`);

  let tokenStrategy = 'Single Token';
  let emailVerification = false;
  let forgotPassword = false;
  let googleAuth = false;

  if (auth) {
    tokenStrategy = await select({
      message: 'Token Strategy',
      choices: [
        { name: `Multi Token ${chalk.dim('(Access Token + Refresh Token)')}`, value: 'Multi Token (Access + Refresh)' },
        { name: `Single Token ${chalk.dim('(Single JWT Access Token)')}`, value: 'Single Token' }
      ]
    });

    emailVerification = await yesNo(`Email Verification? ${chalk.dim('(Token & verify-email endpoints)')}`);

    forgotPassword = await yesNo(`Forgot Password? ${chalk.dim('(Password reset token & email flow)')}`);

    googleAuth = await yesNo(`Google Authentication? ${chalk.dim('(OAuth 2.0 redirect & callback)')}`);
  }

  const database = await select({
    message: 'Database',
    choices: [
      { name: `MongoDB (Mongoose) ${chalk.dim('(Mongoose ORM with schema models)')}`, value: 'MongoDB (Mongoose)' }
    ]
  });

  const logger = await select({
    message: 'Logger',
    choices: [
      { name: `Pino Logger ${chalk.dim('(Structured JSON logger with pino-http)')}`, value: 'Pino Logger' },
      { name: `None ${chalk.dim('(No logger, use console.log)')}`, value: 'None' }
    ]
  });

  const swagger = await select({
    message: 'API Documentation',
    choices: [
      { name: `Swagger ${chalk.dim('(Interactive OpenAPI docs at /docs)')}`, value: 'Swagger' },
      { name: `None ${chalk.dim('(No OpenAPI documentation UI)')}`, value: 'None' }
    ]
  });
  const swaggerEnabled = swagger === 'Swagger';

  const testingChoice = await select({
    message: 'Testing',
    choices: [
      { name: `Jest ${chalk.dim('(Jest test suite & health test spec)')}`, value: 'Jest' },
      { name: `None ${chalk.dim('(No automated test setup)')}`, value: 'None' }
    ]
  });
  const testing = testingChoice === 'Jest';

  const comments = await yesNo(`Include code comments? ${chalk.dim('(Detailed JSDoc & architecture comments)')}`);

  const docker = await yesNo(`Docker Support? ${chalk.dim('(Dockerfile, docker-compose.yml & watch-package script)')}`);

  const installDependencies = await yesNo(`Install dependencies automatically? ${chalk.dim('(Executes npm install after scaffolding)')}`);

  return {
    projectName: projectName.trim(),
    language,
    moduleSystem,
    folderStructure,
    programmingStyle,
    auth,
    tokenStrategy,
    multiToken: auth ? tokenStrategy.includes('Multi Token') : false,
    emailVerification,
    forgotPassword,
    googleAuth,
    database,
    logger,
    swagger: swaggerEnabled,
    testing,
    comments,
    docker,
    installDependencies
  };
}
