import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import AccessDenied from 'components/tc-communities/AccessDenied';

const mockDatas = [
  {
    cause: 'Not authenticated',
  }, {
    cause: 'Not authorized',
  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  _.forEach(mockDatas, (data) => {
    renderer.render((
      <AccessDenied {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
