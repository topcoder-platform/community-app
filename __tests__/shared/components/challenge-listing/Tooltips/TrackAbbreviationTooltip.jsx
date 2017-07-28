import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import TrackAbbreviationTooltip from 'components/challenge-listing/Tooltips/TrackAbbreviationTooltip';

const mockDatas = [
  {
    subTrack: 'F2F',
    track: 'DEVELOP',
  }, {
    subTrack: 'CODE',
    track: 'DEVELOP',
  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  _.forEach(mockDatas, (data) => {
    renderer.render((
      <TrackAbbreviationTooltip {...data}>
        <div className="mock-class">abcedfghik</div>
      </TrackAbbreviationTooltip>
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return (<TrackAbbreviationTooltip {...this.props}>
      <div className="mock-class">abcedfghik</div>
    </TrackAbbreviationTooltip>);
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
