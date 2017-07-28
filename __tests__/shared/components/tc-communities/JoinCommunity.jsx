import React from 'react';
import _ from 'lodash';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import JoinCommunity from 'components/tc-communities/JoinCommunity';

const hideJoinButton = jest.fn();
const join = jest.fn();
const resetJoinButton = jest.fn();
const showJoinConfirmModal = jest.fn();

const mockDatas = [
  {
    communityName: 'ios',
    groupId: '1',
    hideJoinButton,
    join,
    resetJoinButton,
    showJoinConfirmModal,
    state: 'confirm-join',
    token: 'token',
    userId: 'useId',
  }, {
    communityName: 'ios',
    groupId: '1',
    hideJoinButton,
    join,
    resetJoinButton,
    showJoinConfirmModal,
    state: 'joining',
    token: 'token',
    userId: 'useId',
  }, {
    communityName: 'ios',
    groupId: '1',
    hideJoinButton,
    join,
    resetJoinButton,
    showJoinConfirmModal,
    state: 'hidden',
    token: 'token',
    userId: 'useId',
  }, {
    communityName: 'ios',
    groupId: '1',
    hideJoinButton,
    join,
    resetJoinButton,
    showJoinConfirmModal,
    state: 'joined',
    token: 'token',
    userId: 'useId',
  }, {
    communityName: 'ios',
    groupId: '1',
    hideJoinButton,
    join,
    resetJoinButton,
    showJoinConfirmModal,
    state: 'confirm-join',
    userId: 'useId',
  },
];

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  _.forEach(mockDatas, (data) => {
    renderer.render((
      <JoinCommunity {...data} />
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});

class Wrapper extends React.Component {
  componentDidMount() {}
  render() {
    return <JoinCommunity {...this.props} />;
  }
}

describe('click confirm-join', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[0]} />));
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  _.forEach(matches, m => TU.Simulate.click(m));
  expect(join).toHaveBeenCalled();
});


describe('click joined', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[3]} />));
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  TU.Simulate.click(matches[0]);
});

describe('click without token', () => {
  const instance = TU.renderIntoDocument((<Wrapper {...mockDatas[4]} />));
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  TU.Simulate.click(matches[0]);
});
