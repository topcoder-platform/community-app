import React from 'react';
import Rnd from 'react-test-renderer/shallow';
import Footer from 'components/tc-communities/Footer';

const rnd = new Rnd();

test('Snapshot match', () => {
  rnd.render((
    <Footer
      menuItems={[{
        title: 'Home',
        url: 'home',
      }, {
        title: 'Learn',
        url: 'learn',
      }, {
        title: 'Challenges',
        url: 'challenges',
      }, {
        title: 'Leaderboard',
        url: 'leaderboard',
      }]}
      communityId="wipro2"
      registerUrl="https://accounts.topcoder-dev.com/member/registration"
      loginUrl="https://accounts.topcoder-dev.com/member"
      isAuthorized
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();

  rnd.render((
    <Footer
      menuItems={[{
        title: 'Home',
        url: 'home',
      }, {
        title: 'Learn',
        url: 'learn',
      }, {
        title: 'Challenges',
        url: 'challenges',
      }, {
        title: 'Leaderboard',
        url: 'leaderboard',
      }]}
      communityId="wipro2"
      registerUrl="https://accounts.topcoder-dev.com/member/registration"
      loginUrl="https://accounts.topcoder-dev.com/member"
      isAuthorized
      theme={{
        container: 'container',
        menu: 'menu',
        authorize: 'authorize',
        btnRegister: 'btnRegister',
        btnLogin: 'btnLogin',
      }}
    />
  ));
  expect(rnd.getRenderOutput()).toMatchSnapshot();
});
