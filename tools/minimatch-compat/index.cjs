const modern = require('minimatch-engine');

// Older build tools expect a callable CommonJS export. glob 7 additionally
// reads _glob and uses String.match on compiled segments. Delegate matching
// to minimatch 11's bounded matcher, without restoring the old regex engine.
function compatible(defaultOptions = {}) {
  const options = (value) => ({ ...defaultOptions, ...value });
  const match = (path, pattern, value) =>
    modern.minimatch(path, pattern, options(value));
  Object.assign(match, modern.minimatch);
  match.Minimatch = class extends modern.Minimatch {
    constructor(pattern, value) {
      super(pattern, options(value));
      for (const row of this.set) {
        for (const segment of row) {
          if (typeof segment === 'object' && segment !== null) {
            segment._glob = segment.pattern;
            segment[Symbol.match] = (input) =>
              segment.test(input) ? [input] : null;
          }
        }
      }
    }

    static defaults(value) {
      return compatible(options(value)).Minimatch;
    }
  };
  match.defaults = (value) => compatible(options(value));
  match.filter = (pattern, value) => modern.filter(pattern, options(value));
  match.match = (paths, pattern, value) =>
    modern.match(paths, pattern, options(value));
  match.braceExpand = (pattern, value) =>
    modern.braceExpand(pattern, options(value));
  return match;
}

module.exports = compatible();
