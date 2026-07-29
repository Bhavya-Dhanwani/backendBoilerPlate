/**
 * Strips comments from JavaScript / TypeScript code strings when comments option is disabled.
 * Preserves URLs (like http://) and strings.
 */
export function stripComments(code) {
  if (!code) return code;
  
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1')
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s*[\r\n]+/, '');
}
