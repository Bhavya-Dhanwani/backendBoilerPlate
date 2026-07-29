import path from 'path';
import fs from 'fs-extra';
import { stripComments } from './utils/commentStripper.js';

export class TemplateEngine {
  constructor(config) {
    this.config = config;
    this.isTS = config.language === 'TypeScript';
    this.isESM = config.moduleSystem === 'ES Modules';
    this.isModular = config.folderStructure === 'Modular';
    this.isClass = config.programmingStyle === 'Class Based';
    this.ext = this.isTS ? 'ts' : 'js';
  }

  formatCode(code) {
    if (!this.config.comments) {
      return stripComments(code);
    }
    return code;
  }

  // Import statement helper based on ESM vs CJS
  getImport(specifiers, moduleName) {
    if (this.isESM) {
      if (typeof specifiers === 'string') {
        return `import ${specifiers} from '${moduleName}';`;
      }
      return `import { ${specifiers.join(', ')} } from '${moduleName}';`;
    } else {
      if (typeof specifiers === 'string') {
        return `const ${specifiers} = require('${moduleName}');`;
      }
      return `const { ${specifiers.join(', ')} } = require('${moduleName}');`;
    }
  }

  // Export statement helper based on ESM vs CJS
  getExport(name, isDefault = false) {
    if (this.isESM) {
      return isDefault ? `export default ${name};` : `export ${name};`;
    } else {
      return isDefault ? `module.exports = ${name};` : `exports.${name} = ${name};`;
    }
  }
}
