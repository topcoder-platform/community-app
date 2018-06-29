import Modal from 'components/Modal';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';

test('Snapshot match', () => {
  const rnd = new Rnd();
  rnd.render(<Modal />);
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class ModalClass extends React.Component {
  componentDidMount() {}

  render() {
    return <Modal {...this.props} />;
  }
}

const mockOnCancel = jest.fn();

const render = TU.renderIntoDocument((
  <ModalClass
    onCancel={mockOnCancel}
  />
));

test('onCancel', () => {
  const obj = TU.findAllInRenderedTree(render, item => item && item.className && item.className.match('overlay'))[0];
  TU.Simulate.click(obj);
  expect(mockOnCancel).toHaveBeenCalled();
});

test('onWheel', () => {
  const container = TU.findAllInRenderedTree(render, item => item && item.className && item.className.match('container'))[0];
  TU.Simulate.wheel(container);
  const overlay = TU.findAllInRenderedTree(render, item => item && item.className && item.className.match('overlay'))[0];
  TU.Simulate.wheel(overlay);
});
