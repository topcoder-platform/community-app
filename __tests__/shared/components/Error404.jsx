import Error404 from 'components/Error404';
import React from 'react';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';

function render(context) {
  return renderer.create((
    <StaticRouter location="/" context={context}>
      <Error404 />
    </StaticRouter>
  )).toJSON();
}

test('renders correctly with context', () =>
  expect(render({})).toMatchSnapshot());

test('renders correctly without context', () =>
  expect(renderer.create((
    <BrowserRouter>
      <Error404 />
    </BrowserRouter>
  )).toJSON()).toMatchSnapshot(),
);

test('writes error to the context, if provided', () => {
  const context = {};
  render(context);
  expect(context.status).toBe(404);
});
