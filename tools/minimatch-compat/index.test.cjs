const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const legacyRequire = createRequire(require.resolve('eslint'));
const match = legacyRequire('minimatch');

test('legacy consumers retain the callable minimatch API', () => {
  assert.equal(typeof match, 'function');
  assert.equal(match('src/main.ts', '**/*.ts'), true);
  assert.equal(match('src/main.js', '**/*.ts'), false);
  assert.equal(match('.env', '*'), false);
  assert.equal(match.defaults({ dot: true })('.env', '*'), true);
  assert.deepEqual(match.match(['a.ts', 'b.js'], '*.ts'), ['a.ts']);
  assert.deepEqual(['a.ts', 'b.js'].filter(match.filter('*.ts')), ['a.ts']);
  assert.deepEqual(match.braceExpand('*.{js,ts}'), ['*.js', '*.ts']);
  assert.equal(new match.Minimatch('**/*.ts').match('src/main.ts'), true);
  assert.equal(match.Minimatch.defaults({ dot: true }) !== undefined, true);
  assert.equal(typeof match.GLOBSTAR, 'symbol');
});

test('amplifying glob patterns terminate within a bounded time', () => {
  const result = spawnSync(process.execPath, ['-e', `
    const match = require(${JSON.stringify(legacyRequire.resolve('minimatch'))});
    new match.Minimatch('**/../'.repeat(30) + '*.ts', { optimizationLevel: 2 });
  `], { timeout: 5000, encoding: 'utf8' });
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0, result.stderr);
});
