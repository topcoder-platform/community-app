#!/usr/bin/env node

/* Verifies that runtime, build, and deploy inputs contain no URL whose network
 * host is a retired CMS API or asset provider. Contentful-shaped schema names
 * and migrated S3 object paths are intentionally allowed. */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TARGETS = [
  '.circleci',
  'Dockerfile',
  'build',
  'build.sh',
  'config/custom-environment-variables.js',
  'config/default.js',
  'config/development.js',
  'config/production.js',
  'config/qa.js',
  'package.json',
  'src',
];
const RETIRED_HOSTS = /(?:https?:)?\/\/(?:[^\s/"'<>]*\.)?(?:contentful\.com|ctfassets\.net|netlify\.app|netlify\.com|netlifyusercontent\.com|octana\.io)(?=[:/\s"'<>]|$)/gi;
const RETIRED_API_HOST_LITERALS = /\b(?:api|app|cdn|preview)\.contentful\.com\b/gi;

function getFiles(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return [target];
  return fs.readdirSync(target)
    .reduce((files, name) => files.concat(getFiles(path.join(target, name))), []);
}

const findings = [];
TARGETS.forEach((target) => {
  getFiles(path.join(ROOT, target)).forEach((file) => {
    const stat = fs.statSync(file);
    if (stat.size > 50 * 1024 * 1024) return;
    let source;
    try {
      source = fs.readFileSync(file, 'utf8').replace(/\\\//g, '/');
    } catch (error) {
      return;
    }
    source.split(/\r?\n/).forEach((line, index) => {
      RETIRED_HOSTS.lastIndex = 0;
      RETIRED_API_HOST_LITERALS.lastIndex = 0;
      const matches = (line.match(RETIRED_HOSTS) || [])
        .concat(line.match(RETIRED_API_HOST_LITERALS) || []);
      if (matches.length) {
        findings.push(`${path.relative(ROOT, file)}:${index + 1}: ${matches.join(', ')}`);
      }
    });
  });
});

if (findings.length) {
  process.stderr.write(`Retired CMS network targets detected:\n${findings.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('No retired CMS network targets detected.\n');
}
