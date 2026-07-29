import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.create-backend-app');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export function hasConfig() {
  return fs.existsSync(CONFIG_FILE);
}

export function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return fs.readJsonSync(CONFIG_FILE);
    }
  } catch (err) {
    // Return null if corrupt or unreadable
  }
  return null;
}

export function saveConfig(config) {
  try {
    fs.ensureDirSync(CONFIG_DIR);
    fs.writeJsonSync(CONFIG_FILE, config, { spaces: 2 });
  } catch (err) {
    console.error('Failed to save config:', err.message);
  }
}
