import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import Bucket from 'components/challenge-listing/Sidebar/BucketSelector/Bucket';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <Bucket challenges={[]} disabled bucket={{ name: 'name' }} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
  renderer.render((
    <Bucket challenges={[]} disabled bucket={{ name: 'name' }} active />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});


class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <Bucket {...this.props} />;
  }
}

const onClick = jest.fn();

test('handle key press', () => {
  const instance = TU.renderIntoDocument((<Wrapper challenges={[]} onClick={onClick} bucket={{ name: 'name' }} />));
  const matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('bucket'));
  expect(matches).toHaveLength(1);
  expect(onClick).toHaveBeenCalledTimes(0);
  TU.Simulate.keyPress(matches[0], { key: 'Enter' });
  expect(onClick).toHaveBeenCalledTimes(1);
  TU.Simulate.keyPress(matches[0], { key: 'A' });
  expect(onClick).toHaveBeenCalledTimes(1);
});
