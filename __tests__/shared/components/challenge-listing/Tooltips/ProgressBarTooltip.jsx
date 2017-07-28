import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import ProgressBarTooltip from 'components/challenge-listing/Tooltips/ProgressBarTooltip';

const mockDatas = [
  {
    challenge: {
      prizes: [1000, 500],
      prize: [1000, 500],
      reliabilityBonus: 300,
      allPhases: [{ scheduledEndTime: '2017-01-01' }],
      currentPhases: [{
        scheduledEndTime: '2017-01-02',
      }],
    },
  }, {
    challenge: {
      id: '1',
      prize: [1000, 500],
      reliabilityBonus: 0,
      allPhases: [{ scheduledEndTime: '2017-01-01' }],
      currentPhases: [],
      checkpointSubmissionEndDate: '2017-01-02',
    },
  }, {

  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  _.forEach(mockDatas, (data) => {
    renderer.render((
      <ProgressBarTooltip {...data}>
        <div className="mock-class">abcedfghik</div>
      </ProgressBarTooltip>
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return (<ProgressBarTooltip {...this.props}>
      <div className="mock-class">abcedfghik</div>
    </ProgressBarTooltip>);
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

  instance = TU.renderIntoDocument((<Wrapper {...mockDatas[2]} />));
  matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('mock-class'));
  expect(matches).toHaveLength(1);
  TU.Simulate.mouseEnter(matches[0].parentNode);
});
