import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import SwitchWithLabel from 'components/SwitchWithLabel';

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <SwitchWithLabel onSwitch={() => {}} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <SwitchWithLabel {...this.props} />;
  }
}

const onSwitch = jest.fn();
const instance = TU.renderIntoDocument((<Wrapper onSwitch={onSwitch} enabled />));

test('on switch', () => {
  const switchs = TU.findAllInRenderedTree(instance, item => item && item.className && item.className.match('SwitchWithLabel'));
  TU.Simulate.click(switchs[0]);
  expect(onSwitch).toHaveBeenCalled();
});
