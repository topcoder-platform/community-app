/**
 * ArticleCard component
 */

import Player from 'react-player';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import defaultStyle from './style.scss';

function ArticleCard(props) {
  const { title, theme, url } = props;
  return (
    <div className={theme.container}>
      <Player className={theme.video} url={url} controls />
      <div className={theme.content}>
        <h3 className={theme.title}>{title}</h3>
      </div>
    </div>
  );
}

ArticleCard.propTypes = {
  title: PT.string.isRequired,
  theme: PT.shape({
    container: PT.string,
    content: PT.string,
    title: PT.string,
    video: PT.string,
  }).isRequired,
  url: PT.string.isRequired,
};

export default themr('tcCommunities-ArticleCard', defaultStyle)(ArticleCard);
