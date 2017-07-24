import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import TU from 'react-dom/test-utils';
import ImageText from 'components/tc-communities/ImageText';

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
    return <ImageText {...this.props} />;
  }
}

Wrapper.childContextTypes = {
  router: PT.shape({
    history: PT.shape({}),
  }),
};

test('render properly', () => {
  TU.renderIntoDocument((
    <Wrapper
      title="Learn"
      text="You can learn and get certified donec facilisis tortor ut augue lacinia"
      imageSrc="/themes/wipro/home/image-text-learn.jpg"
    />
  ));

  TU.renderIntoDocument((
    <Wrapper
      title="Learn"
      text="You can learn and get certified donec facilisis tortor ut augue lacinia"
      link={{
        title: 'Start Learning',
        url: '#',
      }}
      imageSrc="/themes/wipro/home/image-text-learn.jpg"
      theme={{
        container: 'container',
        image: 'image',
        content: 'content',
        contentInner: 'contentInner',
        title: 'title',
        text: 'text',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));
});
