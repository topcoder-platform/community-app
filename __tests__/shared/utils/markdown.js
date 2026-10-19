import fs from 'fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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

/**
 * Renders Markdown through React into a detached DOM element for output assertions.
 * @param {String} markdown CMS Markdown or inline HTML source.
 * @returns {HTMLElement} Container holding the rendered content.
 * @throws Propagates Markdown or React rendering errors to the test.
 */
function renderContent(markdown) {
  const container = document.createElement('div');
  container.innerHTML = renderToStaticMarkup(React.createElement('div', null, render(markdown)));
  return container;
}

test('Marathon tester commands display angle brackets instead of HTML entities', () => {
  const container = renderContent([
    '<span style="margin-left:25px;display:block"><code class="plaintext">javac &lt;TesterClassName&gt;.java</code></span>',
    '<span style="margin-left:25px;display:block"><code class="plaintext">jar cvfe &lt;TesterJarName&gt;.jar &lt;TesterClassName&gt; .</code></span>',
  ].join('\n\n'));

  expect(Array.from(container.querySelectorAll('code')).map(code => code.textContent)).toEqual([
    'javac <TesterClassName>.java',
    'jar cvfe <TesterJarName>.jar <TesterClassName> .',
  ]);
  expect(container.innerHTML).toContain('javac &lt;TesterClassName&gt;.java');
  expect(container.innerHTML).not.toContain('&amp;lt;');
  expect(container.querySelector('testerclassname')).toBeNull();
});

test('Text escapes once while intentionally written entity names remain literal', () => {
  const container = renderContent('1 < 2 and 3 > 2; &lt;value&gt;; &amp;lt;value&amp;gt;.');

  expect(container.textContent).toBe('1 < 2 and 3 > 2; <value>; &lt;value&gt;.');
});

test('Escaped HTML stays text instead of creating active elements', () => {
  const container = renderContent('&lt;script&gt;alert(1)&lt;/script&gt; &lt;img src=x onerror=alert(1)&gt;');

  expect(container.textContent).toBe('<script>alert(1)</script> <img src=x onerror=alert(1)>');
  expect(container.querySelector('script, img')).toBeNull();
});
