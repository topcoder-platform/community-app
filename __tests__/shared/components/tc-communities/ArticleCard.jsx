import React from 'react';
import PT from 'prop-types';
import _ from 'lodash';
import TU from 'react-dom/test-utils';
import ArticleCard from 'components/tc-communities/ArticleCard';

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
    return <ArticleCard {...this.props} />;
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
      title="How Does An IOS 10 LCD Work"
      text="There are advances being made in science and technology everyday"
      imageSrc="/themes/wipro/home/news-01.jpg"
      link={{
        title: 'Read More',
        url: '#',
      }}
    />
  ));

  TU.renderIntoDocument((
    <Wrapper
      title="How Does An IOS 10 LCD Work"
      text="<p>There are advances being made in science and technology everyday</p>"
      imageSrc="/themes/wipro/home/news-01.jpg"
      link={{
        title: 'Read More',
        url: 'http://link#',
      }}
      theme={{
        container: 'container',
        image: 'image',
        content: 'content',
        title: 'title',
        text: '',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));

  TU.renderIntoDocument((
    <Wrapper
      title="How Does An IOS 10 LCD Work"
      text="<p>There are advances being made in science and technology everyday</p>"
      imageSrc="/themes/wipro/home/news-01.jpg"
      link={{
        title: 'Read More',
        url: 'https://link#',
      }}
      theme={{
        container: 'container',
        image: 'image',
        content: 'content',
        title: 'title',
        text: '',
        linkWrap: 'linkWrap',
        link: 'link',
      }}
    />
  ));
});
