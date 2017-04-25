import Button from 'components/Button';
import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render(<Button />);
  const button = rnd.getRenderOutput();
  expect(button).toMatchSnapshot();
});

class ButtonClass extends React.Component {
  componentDidMount() {}

  render() {
    return <Button {...this.props} />;
  }
}

const mockOnClick = jest.fn();

const render = TU.renderIntoDocument((
  <ButtonClass
    onClick={mockOnClick}
  />
));

test('onClick', () => {
  const obj = TU.findRenderedDOMComponentWithClass(render, 'tc-btn');
  TU.Simulate.click(obj);
  expect(mockOnClick).toHaveBeenCalled();
});
