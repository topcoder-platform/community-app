import JoinCommunity from 'components/tc-communities/JoinCommunity';
import React from 'react';
import TU from 'react-dom/test-utils';
import { JU } from 'topcoder-react-utils';

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
  mockDatas.forEach(data => JU.shallowSnapshot(<JoinCommunity {...data} />));
});

test('click confirm-join', () => {
  const dom = JU.renderDom(<JoinCommunity {...mockDatas[0]} />);
  const matches = TU.scryRenderedDOMComponentsWithTag(dom, 'button');
  matches.forEach(m => JU.simulate.click(m));
  expect(join).toHaveBeenCalled();
});

test('click joined', () => {
  const instance = JU.renderDom(<JoinCommunity {...mockDatas[3]} />);
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  JU.simulate.click(matches[0]);
});

test('click without token', () => {
  const instance = JU.renderDom(<JoinCommunity {...mockDatas[4]} />);
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  JU.simulate.click(matches[0]);
});
