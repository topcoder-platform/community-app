/**
 * An improved version of ArticleCard component, which provides more freedom
 * over the content.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

function ArticleCard(props) {
  const {
    children, imageSrc, theme, title,
  } = props;
  return (
    <div className={theme.container}>
      <div className={theme.image} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={theme.content}>
        <h3 className={theme.title}>
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

ArticleCard.defaultProps = {
  children: null,
  theme: {},
  title: null,
};

ArticleCard.propTypes = {
  children: PT.node,
  imageSrc: PT.string.isRequired,
  theme: PT.shape({
    container: PT.string,
    image: PT.string,
    content: PT.string,
    title: PT.string,
    text: PT.string,
    linkWrap: PT.string,
    link: PT.string,
  }),
  title: PT.string,
};

export default themr('tcCommunities-ArticleCard', defaultStyle)(ArticleCard);
