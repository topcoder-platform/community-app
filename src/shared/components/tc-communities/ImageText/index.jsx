/**
 * ImageText component
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { Link } from 'topcoder-react-utils';
import defaultStyle from './style.scss';

function ImageText(props) {
  const { imageSrc, title, text, link, theme, children } = props;

  let links;
  if (link) {
    links = (_.isArray(link) ? link : [link]).map(item => (
      <div className={theme.linkWrap} key={item.title}>
        <Link
          className={theme.link}
          openNewTab={item.newTab}
          to={item.url}
        >{item.title}</Link>
      </div>
    ));
  }

  return (
    <div className={theme.container}>
      <div className={theme.image} style={{ backgroundImage: `url(${imageSrc})` }} />
      <div className={theme.content}>
        <div className={theme.contentInner}>
          <h3 className={theme.title}>{title}</h3>
          <p className={theme.text}>{text}</p>
          {links}
          {children}
        </div>
      </div>
    </div>
  );
}

ImageText.defaultProps = {
  link: null,
  theme: {},
  children: null,
};

const LinkShape = PT.shape({
  newTab: PT.bool,
  title: PT.string.isRequired,
  url: PT.string.isRequired,
});

ImageText.propTypes = {
  imageSrc: PT.string.isRequired,
  title: PT.string.isRequired,
  text: PT.string.isRequired,
  link: PT.oneOfType([
    PT.arrayOf(LinkShape),
    LinkShape,
  ]),
  theme: PT.shape({
    container: PT.string,
    image: PT.string,
    content: PT.string,
    contentInner: PT.string,
    title: PT.string,
    text: PT.string,
    linkWrap: PT.string,
    link: PT.string,
  }),
  children: PT.node,
};

export default themr('tcCommunities-ImageText', defaultStyle)(ImageText);
