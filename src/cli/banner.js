import chalk from 'chalk';

export function printBanner() {
  console.log();
  console.log(chalk.bold.cyan('  ======================================================'));
  console.log(chalk.bold.cyan('    🚀 CREATE-BACKEND-APP — Backend Boilerplate Generator'));
  console.log(chalk.bold.cyan('  ======================================================'));
  console.log(chalk.gray('    Production-ready Express backend in under 60 seconds'));
  console.log();
}

export function printSummary(config) {
  console.log();
  console.log(chalk.bold.green('  Selected Configuration:'));
  console.log(chalk.cyan(`  ✓ Language:             `) + chalk.white(config.language));
  console.log(chalk.cyan(`  ✓ Module System:        `) + chalk.white(config.moduleSystem));
  console.log(chalk.cyan(`  ✓ Folder Structure:     `) + chalk.white(config.folderStructure));
  console.log(chalk.cyan(`  ✓ Programming Style:    `) + chalk.white(config.programmingStyle));
  console.log(chalk.cyan(`  ✓ Authentication:       `) + chalk.white(config.auth ? 'Yes' : 'No'));
  if (config.auth) {
    console.log(chalk.cyan(`    - Token Strategy:     `) + chalk.white(config.tokenStrategy));
    console.log(chalk.cyan(`    - Email Verification: `) + chalk.white(config.emailVerification ? 'Yes' : 'No'));
    console.log(chalk.cyan(`    - Forgot Password:    `) + chalk.white(config.forgotPassword ? 'Yes' : 'No'));
    console.log(chalk.cyan(`    - Google Auth:        `) + chalk.white(config.googleAuth ? 'Yes' : 'No'));
  }
  console.log(chalk.cyan(`  ✓ Database:             `) + chalk.white(config.database));
  console.log(chalk.cyan(`  ✓ Logger:               `) + chalk.white(config.logger));
  console.log(chalk.cyan(`  ✓ API Documentation:    `) + chalk.white(config.swagger ? 'Swagger' : 'None'));
  console.log(chalk.cyan(`  ✓ Testing:              `) + chalk.white(config.testing ? 'Jest' : 'None'));
  console.log(chalk.cyan(`  ✓ Comments:             `) + chalk.white(config.comments ? 'Yes' : 'No'));
  console.log(chalk.cyan(`  ✓ Docker:               `) + chalk.white(config.docker ? 'Yes' : 'No'));
  console.log(chalk.cyan(`  ✓ Install Dependencies: `) + chalk.white(config.installDependencies ? 'Yes' : 'No'));
  console.log();
}
