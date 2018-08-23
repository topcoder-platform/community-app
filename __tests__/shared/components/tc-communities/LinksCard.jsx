import _ from 'lodash';
import LinksCard from 'components/tc-communities/LinksCard';
import mockStore from 'redux-mock-store';
import PT from 'prop-types';
import React from 'react';
import TU from 'react-dom/test-utils';
import { Provider } from 'react-redux';

const store = mockStore()();

class Wrapper extends React.Component {
  getChildContext() {
    return {
      router: {
        history: {
          createHref: _.noop,
          push: _.noop,
          replace: _.noop,
        },
      },
    };
  }

  componentDidMount() {}

  render() {
    return <LinksCard {...this.props} />;
  }
}

Wrapper.childContextTypes = {
  router: PT.shape({
    history: PT.shape({}),
  }),
};

test('render properly', () => {
  TU.renderIntoDocument((
    <Provider store={store}>
      <Wrapper
        title="Videos"
        links={[{
          title: 'Tristique ullamcorper id vitae',
          url: '#',
        }, {
          title: 'Nulla mollis sapien sollicitudin',
          url: '#',
        }, {
          title: 'Vivamus facilisis dolor et massa',
          url: '#',
        }, {
          title: 'Vestibulum nisl egestas',
          url: '#',
        }]}
      />
    </Provider>
  ));

  TU.renderIntoDocument((
    <Provider store={store}>
      <Wrapper
        title="Videos"
        links={[{
          title: 'Tristique ullamcorper id vitae',
          url: '#',
        }, {
          title: 'Nulla mollis sapien sollicitudin',
          url: '#',
        }, {
          title: 'Vivamus facilisis dolor et massa',
          url: '#',
        }, {
          title: 'Vestibulum nisl egestas',
          url: '#',
        }]}
        theme={{
          container: 'container',
          title: 'title',
          list: 'list',
          item: 'item',
          link: 'link',
        }}
      />
    </Provider>
  ));
});
