#!/usr/bin/env node

import { printBanner, printSummary } from '../src/cli/banner.js';
import { runPrompts } from '../src/cli/prompts.js';
import { generateProject } from '../src/generator/index.js';

async function main() {
  printBanner();
  const config = await runPrompts();
  printSummary(config);
  await generateProject(config);
}

main().catch((err) => {
  console.error('\nFatal CLI error:', err.message);
  process.exit(1);
});
