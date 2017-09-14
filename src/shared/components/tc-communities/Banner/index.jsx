/**
 * Banner component
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-themr';
import defaultStyle from './style.scss';
import Link from './Link';

function Banner({ children, imageSrc, link, theme, text, title }) {
  let links;
  if (link) {
    links = (_.isArray(link) ? link : [link]).map(item => (
      <Link
        key={item.title}
        theme={theme}
        title={item.title}
        url={item.url}
      />
    ));
  }

  return (
    <div className={theme.container} style={{ backgroundImage: `url(${imageSrc})` }}>
      <div className={theme.content}>
        <div className={theme.contentBg} />
        <div className={theme.contentInner}>
          <h2 className={theme.title}>{title}</h2>
          <p className={theme.text}>{text}</p>
          {links}
          {children}
        </div>
      </div>
    </div>
  );
}

Banner.defaultProps = {
  children: null,
  link: null,
  theme: {},
};

const LinkShape = PT.shape({
  title: PT.string.isRequired,
  url: PT.string.isRequired,
});

Banner.propTypes = {
  children: PT.node,
  imageSrc: PT.string.isRequired,
  title: PT.string.isRequired,
  text: PT.string.isRequired,
  link: PT.oneOfType([
    PT.arrayOf(LinkShape),
    LinkShape,
  ]),
  theme: PT.shape({
    container: PT.string,
    content: PT.string,
    contentBg: PT.string,
    contentInner: PT.string,
    title: PT.string,
    text: PT.string,
    linkWrap: PT.string,
    link: PT.string,
  }),
};

export default themr('tcCommunities-Banner', defaultStyle)(Banner);
