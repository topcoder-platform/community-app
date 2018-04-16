import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
import TU from 'react-dom/test-utils';

const mockOnTitleClick = jest.fn();

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <AccordionItem
      title="Test title"
    >
      <div>Test content</div>
    </AccordionItem>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <AccordionItem
      title="Test title"
      isOpen
    >
      <div>Test content</div>
    </AccordionItem>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <AccordionItem {...this.props} title="Test title">
          <div>Test content</div>
        </AccordionItem>
      </div>
    );
  }
}

const page = TU.renderIntoDocument((
  <Wrapper
    onTitleClick={mockOnTitleClick}
  />
));

describe('Click on title', () => {
  beforeEach(() => jest.clearAllMocks());

  test('onTitleClick', () => {
    const btn = TU.scryRenderedDOMComponentsWithClass(page, 'accordion-title-button');
    expect(btn.length).toBe(2);
    TU.Simulate.click(btn[0]);
    expect(mockOnTitleClick).toHaveBeenCalled();
  });
});
