import React from 'react';
// import ReactDOM from 'react-dom';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import Winner from 'components/challenge-detail/Winners/Winner';

const mockData = {
  isDesign: false,
  isMM: true,
  prizes: [
    { value: 200, type: 'USD' },
    { value: 100, type: 'USD' },
  ],
  submissions: [
    {
      placement: 1,
      createdBy: 'test',
      created: '2017-11-06T15:49:35.000Z',
      id: '1',
    },
    {
      placement: 1,
      createdBy: 'test',
      created: '2017-12-06T15:49:35.000Z',
      id: '2',
    },
    {
      placement: 1,
      createdBy: 'test2',
      created: '2017-11-06T15:49:35.000Z',
      id: '3',
    },
  ],
  viewable: false,
  winner: {
    handle: 'test',
    placement: 1,
  },
  isLoggedIn: true,
  auth: {
    tokenV3: 'tokenV3',
  },
};

describe('Matches shallow shapshot', () => {
  test('shapshot 1', () => {
    const renderer = new Renderer();

    renderer.render((
      <Winner {...mockData} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return <Winner {...this.props} />;
  }
}
/*
describe('render properly', () => {
  test('click', () => {
    const instance = TU.renderIntoDocument((<Wrapper {...mockData} />));
    const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
    expect(matches).toHaveLength(1);
    TU.Simulate.click(matches[0]);
  });
});
*/