import PT from 'prop-types';
import React from 'react';
import Slider from 'react-slick';
import ArticleCard from './ArticleCard';
import Section from './Section';

export default function NewsSection({
  news,
  theme,
}) {
  if (!news || !news.length) return null;

  const settings = {
    dots: true,
    autoplay: false,
    infinite: false,
    lazyLoad: true,
    arrows: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    className: theme.carouselContainer,
    dotsClass: theme.carouselDot,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: 'unslick',
      },
    ],
  };

  return (
    <Section
      theme={theme.section}
      title="Latest News"
    >
      <Slider {...settings}>
        {
          news.slice(0, 3).map((item, i) => (
            <div data-index={i} key={item.title} className={theme.carouselParent}>
              <ArticleCard
                theme={theme.card}
                imageSrc={`/community-app-assets/themes/common/NewsSection/news-0${1 + i}.jpg`}
                link={{
                  title: 'Read More',
                  url: item.link,
                }}
                text={item.description}
                title={item.title}
              />
            </div>
          ))
        }
      </Slider>
    </Section>
  );
}

NewsSection.defaultProps = {
  news: null,
  theme: {
    section: {},
    card: {},
    carouselContainer: '',
    carouselParent: '',
    carouselDot: '',
  },
};

NewsSection.propTypes = {
  news: PT.arrayOf(PT.shape()),
  theme: PT.shape({
    section: PT.shape(),
    card: PT.shape(),
    carouselContainer: PT.string,
    carouselParent: PT.string,
    carouselDot: PT.string,
  }),
};
