import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import TU from 'react-dom/test-utils';
import Footer from 'components/tc-communities/Footer';

class Wrapper extends React.Component {
  getChildContext() {
    return {
      router: {
        history: {
          createHref: _.noop,
          push: _.noop,
          replace: _.noop,
        },
        route: {
          location: {
            pathname: 'mock',
          },
        },
      },
    };
  }
  componentDidMount() {}

  render() {
    return <Footer {...this.props} />;
  }
}

Wrapper.childContextTypes = {
  router: PT.shape({
    history: PT.shape(),
    route: PT.shape(),
  }),
};

test('render properly', () => {
  TU.renderIntoDocument((
    <Wrapper
      menuItems={[]}
      communityId="wipro"
      registerUrl="https://accounts.topcoder-dev.com/member/registration"
      loginUrl="https://accounts.topcoder-dev.com/member"
      isAuthorized
    />
  ));

  const instance = TU.renderIntoDocument((
    <Wrapper
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
      communityId="wipro"
      registerUrl="https://accounts.topcoder-dev.com/member/registration"
      loginUrl="https://accounts.topcoder-dev.com/member"
      isAuthorized={false}
      theme={{
        container: 'container',
        menu: 'menu',
        authorize: 'authorize',
        btnRegister: 'btnRegister',
        btnLogin: 'btnLogin',
      }}
    />
  ));

  const matches = TU.scryRenderedDOMComponentsWithTag(instance, 'button');
  _.forEach(matches, m => TU.Simulate.click(m));
});
