import mockStore from 'redux-mock-store';
import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import TU from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import Section from 'components/tc-communities/Section';

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
    return (
      <Provider store={store}>
        <Section {...this.props}>
          <div>content</div>
        </Section>
      </Provider>
    );
  }
}

Wrapper.childContextTypes = {
  router: PT.shape({
    history: PT.shape({}),
  }),
};

test('Render properly', () => {
  TU.renderIntoDocument((
    <Wrapper />
  ));

  TU.renderIntoDocument((
    <Wrapper
      title="Section title"
      link={{
        title: 'link',
        url: '#',
      }}
      theme={{
        container: 'container',
        title: 'title',
        content: 'content',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));
});
