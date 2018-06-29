import _ from 'lodash';
import mockStore from 'redux-mock-store';
import React from 'react';
import Renderer from 'react-test-renderer/shallow';
import TU from 'react-dom/test-utils';
import SRMCard from 'components/challenge-listing/SRMCard';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';

const store = mockStore()();

const mockDatas = [
  {
    category: 'now',
    srmChallenge: {},
  }, {
    category: 'upcoming',
    srmChallenge: {},
  }, {
    category: 'past',
    srmChallenge: {},
  },
];

class Wrapper extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <StaticRouter context={{}}>
        <SRMCard {...this.props} />
      </StaticRouter>
    );
  }
}

test('Matches shallow shapshot', () => {
  const renderer = new Renderer();

  _.forEach(mockDatas, (data) => {
    renderer.render((
      <Provider store={store}>
        <StaticRouter context={{}}>
          <SRMCard {...data} />
        </StaticRouter>
      </Provider>
    ));
    expect(renderer.getRenderOutput()).toMatchSnapshot();
    TU.renderIntoDocument((<Wrapper {...data} />));
  });
});
