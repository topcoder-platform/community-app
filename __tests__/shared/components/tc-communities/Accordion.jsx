import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Accordion from 'components/tc-communities/Accordion/Accordion';
import AccordionItem from 'components/tc-communities/Accordion/AccordionItem';
import TU from 'react-dom/test-utils';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Accordion>
      <AccordionItem title="Test title">
        <div>Test content</div>
      </AccordionItem>
    </Accordion>
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});

class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return (
      <div>
        <Accordion>
          <AccordionItem title="Test title 1">
            <div>Test content 1</div>
          </AccordionItem>
          <AccordionItem title="Test title 2">
            <div>Test content 2</div>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

const page = TU.renderIntoDocument((
  <Wrapper />
));

describe('Rendered title list', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Rendered title list', () => {
    const titleListItem = TU.findAllInRenderedTree(page, item =>
      item && item.className && item.className.match(/titleListItem/));
    expect(titleListItem.length).toBe(2);
  });
});
