import { execa } from 'execa';
import ora from 'ora';
import chalk from 'chalk';

export async function installDependencies(projectDir) {
  const spinner = ora('Installing dependencies in server...').start();
  try {
    await execa('npm', ['install'], { cwd: projectDir });
    spinner.succeed(chalk.green('Dependencies installed successfully!'));
  } catch (err) {
    spinner.fail(chalk.red('Failed to install dependencies automatically.'));
    console.error(chalk.yellow('You can run "npm install" manually inside the server/ directory.'));
  }
}
