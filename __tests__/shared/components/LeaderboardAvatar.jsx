import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import LeaderboardAvatar from 'components/LeaderboardAvatar';

const mockData = {
  member: {
    handle: 'handle',
  },
  domain: 'domain',
  url: 'url',
};

const mockData2 = {
  member: {
    handle: 'handle',
    isSmr: true,
    photoURL: 'photoURL',
  },
  domain: 'domain',
};

const mockData3 = {
  member: {
    handle: 'handle',
    isSmr: true,
    photoURL: 'photoURL',
    position: '1',
  },
  domain: 'domain',
};

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  renderer.render((
    <LeaderboardAvatar {...mockData} />
  ));
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test('Render properly', () => {
  let instance = TU.renderIntoDocument((<LeaderboardAvatar {...mockData2} />));
  expect(instance.state.member).toEqual(mockData2.member);
  instance.handleError();
  expect(instance.state.member.photoURL).toEqual('https://acrobatusers.com/assets/images/template/author_generic.jpg');

  instance = TU.renderIntoDocument((<LeaderboardAvatar {...mockData3} />));
  expect(instance.state.member).toEqual(mockData3.member);
});
