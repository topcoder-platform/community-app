/**
 * ArticleCard component
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';
import { Link } from 'react-router-dom';
import defaultStyle from './style.scss';

function ArticleCard(props) {
  const { imageSrc, title, text, link, theme } = props;

  return (
    <div className={theme.container}>
      <div className={theme.image} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={theme.content}>
        <h3 className={theme.title}>{title}</h3>
        <p className={theme.text}>{text}</p>
        {link &&
          <div className={theme.linkWrap}>
            <Link className={theme.link} to={link.url}>{link.title}</Link>
          </div>
        }
      </div>
    </div>
  );
}

ArticleCard.defaultProps = {
  link: null,
  theme: {},
};

ArticleCard.propTypes = {
  imageSrc: PT.string.isRequired,
  title: PT.string.isRequired,
  text: PT.string.isRequired,
  link: PT.shape({
    title: PT.string.isRequired,
    url: PT.string.isRequired,
  }),
  theme: PT.shape({
    container: PT.string,
    image: PT.string,
    content: PT.string,
    title: PT.string,
    text: PT.string,
    linkWrap: PT.string,
    link: PT.string,
  }),
};

export default themr('tcCommunities-ArticleCard', defaultStyle)(ArticleCard);
