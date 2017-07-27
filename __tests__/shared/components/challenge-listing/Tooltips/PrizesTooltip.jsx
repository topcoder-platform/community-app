import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import PrizesTooltip from 'components/challenge-listing/Tooltips/PrizesTooltip';

const mockDatas = [
  {
    challenge: {
      prizes: [1000, 500],
      prize: [1000, 500],
      reliabilityBonus: 300,
    },
  }, {
    challenge: {
      challengeId: '1',
      prize: [1000, 500],
      reliabilityBonus: 0,
    },
  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  _.forEach(mockDatas, (data) => {
    renderer.render((
      <PrizesTooltip {...data}>
        <div className="mock-class">abcedfghik</div>
      </PrizesTooltip>
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return (<PrizesTooltip {...this.props}>
      <div className="mock-class">abcedfghik</div>
    </PrizesTooltip>);
  }
}

test('handle events', () => {
  let instance = TU.renderIntoDocument((<Wrapper {...mockDatas[0]} />));
  let matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('mock-class'));
  expect(matches).toHaveLength(1);
  TU.Simulate.mouseEnter(matches[0].parentNode);

  instance = TU.renderIntoDocument((<Wrapper {...mockDatas[1]} />));
  matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('mock-class'));
  expect(matches).toHaveLength(1);
  TU.Simulate.mouseEnter(matches[0].parentNode);
});
