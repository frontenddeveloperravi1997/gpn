import debug from 'debug';

// The namespace is customer controlled, please make changes as necessary here.
const rootNamespace = 'gpn-jss';

export type CustomDebugger = debug.Debugger;

// On server/node side, allow switching from the built-in
// `%o` (pretty-print single line) and `%O` (pretty-print multiple line)
// with a `DEBUG_MULTILINE` environment variable.
if (
  !(typeof window !== 'undefined' && window.document) &&
  process?.env?.DEBUG_MULTILINE === 'true' &&
  debug.formatters.o &&
  debug.formatters.O
) {
  debug.formatters.o = debug.formatters.O;
}

/**
 * Enable debug logging dynamically
 * @param {string} namespaces space-separated list of namespaces to enable
 */
export const enableCustomDebug = (namespaces: string) => debug.enable(namespaces);

const localDebug = {
  auth: debug(`${rootNamespace}:auth`),
  basic: debug(`${rootNamespace}:basic`),
  dataweavers: debug(`${rootNamespace}:dataweavers`),
};

/**
 * Utilises the same module that Sitecore JSS uses, 'debug'. Uses namespace prefix 'dataweavers-jss:'.
 * See {@link https://www.npmjs.com/package/debug} for details.
 * It is the expectation that the development teams will add relevant namespaces here by as and when required.
 * These namespaces can be used in the local environment or in the Dataweavers DW-Edge
 */
export default localDebug;
