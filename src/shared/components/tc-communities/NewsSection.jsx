import PT from 'prop-types';
import React from 'react';
import ArticleCard from './ArticleCard';
import Section from './Section';

export default function NewsSection(props) {
  if (!props.news || !props.news.length) return null;

  const cards = [];
  for (let i = 0; i < Math.min(3, props.news.length); i += 1) {
    const item = props.news[i];
    cards.push((
      <ArticleCard
        theme={props.theme.card}
        imageSrc={`/themes/common/NewsSection/news-0${1 + i}.jpg`}
        key={i}
        link={{
          title: 'Read More',
          url: item.link,
        }}
        text={item.description}
        title={item.title}
      />
    ));
  }

  return (
    <Section
      theme={props.theme.section}
      title="Latest News"
    >
      {cards}
    </Section>
  );
}

NewsSection.defaultProps = {
  news: null,
  theme: {
    section: {},
    card: {},
  },
};

NewsSection.propTypes = {
  news: PT.arrayOf(PT.shape()),
  theme: PT.shape({
    section: PT.shape(),
    card: PT.shape(),
  }),
};
