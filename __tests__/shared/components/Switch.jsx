import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import Switch from 'components/Switch';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <Switch onSwitch={() => {}} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <Switch {...this.props} />;
  }
}

const onSwitch = jest.fn();
const instance = TU.renderIntoDocument((<Wrapper onSwitch={onSwitch} enabled />));

test('on switch', () => {
  const switchs = TU.findAllInRenderedTree(instance, item => item && item.className && item.className.match('enabled'));
  expect(switchs).toHaveLength(1);
  TU.Simulate.click(switchs[0]);
  expect(onSwitch).toHaveBeenCalled();
});
