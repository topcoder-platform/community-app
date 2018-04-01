import JoinCommunity from 'components/tc-communities/JoinCommunity';
import React from 'react';
import TU from 'react-dom/test-utils';
import {
  renderDom,
  shallowSnapshot,
  simulate,
} from 'topcoder-react-utils/jest-utils';

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
  mockDatas.forEach(data => shallowSnapshot(<JoinCommunity {...data} />));
});

test('click confirm-join', () => {
  const dom = renderDom(<JoinCommunity {...mockDatas[0]} />);
  const matches = TU.scryRenderedDOMComponentsWithTag(dom, 'button');
  matches.forEach(m => simulate.click(m));
  expect(join).toHaveBeenCalled();
});

test('click joined', () => {
  const instance = renderDom(<JoinCommunity {...mockDatas[3]} />);
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  TU.Simulate.click(matches[0]);
});

test('click without token', () => {
  const instance = renderDom(<JoinCommunity {...mockDatas[4]} />);
  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  TU.Simulate.click(matches[0]);
});
