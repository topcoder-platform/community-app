import fs from 'fs';
import render from 'utils/markdown';

/**
 * Performs snapshot test of markdown rendering, using the specified file as
 * the test markup.
 * @param {String} filename
 */
function check(filename) {
  const url = `${__dirname}/__mocks__/${filename}`;
  const doc = fs.readFileSync(url).toString();
  expect(render(doc)).toMatchSnapshot();
}

test('Generic Markdown Test #1', () => check('markdown-test-01.md'));
test('Generic Markdown Test #2', () => check('markdown-test-02.md'));

test('Custom Inline Elements (via simplified JSX)',
  () => check('markdown-test-03.md'));

test('Generic HTML markup inside Markdown code',
  () => check('markdown-test-04.md'));

test('Test of code blocks', () => check('markdown-test-05.md'));
