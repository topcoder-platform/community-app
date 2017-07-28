import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import UserAvatarTooltip from 'components/challenge-listing/Tooltips/UserAvatarTooltip';

const mockDatas = [
  {
    user: {
      country: 'cn',
      handle: 'haha',
      memberSince: '2016-12-01',
      photoLink: 'link',
      ratingSummary: [],
    },
  }, {
    user: {
      country: 'cn',
      handle: 'haha',
      memberSince: '2016-12-01',
      photoLink: 'https://mockey.com/mock.jpg',
      ratingSummary: [],
    },
  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  _.forEach(mockDatas, (data) => {
    renderer.render((
      <UserAvatarTooltip {...data}>
        <div className="mock-class">abcedfghik</div>
      </UserAvatarTooltip>
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return (<UserAvatarTooltip {...this.props}>
      <div className="mock-class">abcedfghik</div>
    </UserAvatarTooltip>);
  }
}

test('handle events', () => {
  let instance = TU.renderIntoDocument((<Wrapper {...mockDatas[0]} />));
  let matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('mock-class'));
  expect(matches).toHaveLength(1);
  TU.Simulate.mouseEnter(matches[0].parentNode.parentNode);

  instance = TU.renderIntoDocument((<Wrapper {...mockDatas[1]} />));
  matches = TU.findAllInRenderedTree(instance, item =>
    item && item.className && item.className.match('mock-class'));
  expect(matches).toHaveLength(1);
  TU.Simulate.mouseEnter(matches[0].parentNode.parentNode);
});
