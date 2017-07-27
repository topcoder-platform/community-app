import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import MyChallenges from 'components/Dashboard/MyChallenges';

const mockData = {
  challenges: [{
    id: '1',
    groups: {
      2: true,
    },
  }],
  groups: [{
    id: '1',
    name: 'group 1',
  }, {
    id: '2',
    name: 'group 2',
  }],
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();
  renderer.render((
    <MyChallenges {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

describe('handler clicks', () => {
  let view;

  beforeEach(() => {
    view = TU.renderIntoDocument((<MyChallenges {...mockData} />));
  });

  test('switch to list view', () => {
    const buttons = TU.scryRenderedDOMComponentsWithTag(view, 'button');
    TU.Simulate.click(buttons[1]);
    expect(view.state.viewMode).toEqual('list');
  });

  test('switch back to tile view', () => {
    const buttons = TU.scryRenderedDOMComponentsWithTag(view, 'button');
    TU.Simulate.click(buttons[0]);
    expect(view.state.viewMode).toEqual('tile');
  });

  test('switch to my communties tab', () => {
    const tabs = TU.scryRenderedDOMComponentsWithTag(view, 'h1');
    TU.Simulate.click(tabs[1]);
    expect(view.state.activeTab).toEqual(1);
  });

  test('switch to my challenges tab', () => {
    const tabs = TU.scryRenderedDOMComponentsWithTag(view, 'h1');
    TU.Simulate.click(tabs[0]);
    expect(view.state.activeTab).toEqual(0);
  });

  test('select group', () => {
    const groups = TU.findAllInRenderedTree(view, item => item && item.className && item.className.match('ChallengeFilter'));
    TU.Simulate.click(groups[1]);
    expect(view.state.selectedCommunityId).toEqual('');
  });
});
