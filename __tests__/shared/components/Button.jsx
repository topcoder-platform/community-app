import Button from 'components/Button';
import React from 'react';
import TU from 'react-dom/test-utils';
import { JU } from 'topcoder-react-utils';

test('Snapshot match', () => {
  JU.snapshot(<Button />);
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
