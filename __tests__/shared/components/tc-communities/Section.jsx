import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import TU from 'react-dom/test-utils';
import Section from 'components/tc-communities/Section';

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
    return (<Section {...this.props}>
      <div>content</div>
    </Section>);
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
