import fs from 'fs';
import render from 'utils/markdown';

test('Generic Markdown Test #1', () => {
  const url = `${__dirname}/__mocks__/markdown-test-01.md`;
  const doc = fs.readFileSync(url).toString();
  expect(render(doc)).toMatchSnapshot();
});

test('Generic Markdown Test #2', () => {
  const url = `${__dirname}/__mocks__/markdown-test-02.md`;
  const doc = fs.readFileSync(url).toString();
  expect(render(doc)).toMatchSnapshot();
});

test('Custom Inline Elements (via simplified JSX)', () => {
  const url = `${__dirname}/__mocks__/markdown-test-03.md`;
  const doc = fs.readFileSync(url).toString();
  expect(render(doc)).toMatchSnapshot();
});
