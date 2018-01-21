/**
 * Section component
 *
 * This is quite universal container component for blocks of content pages.
 *
 * It implements:
 *  - responsive container width
 *  - automatically spread children components into columns
 *    which shrinks to stack on mobile resolution
 *
 * Optionally it can add:
 *  - title - at the top
 *  - link - at he bottom
 *
 * For particular instances styles of this component can be configured by passing theme object.
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { Link } from 'topcoder-react-utils';
import defaultStyle from './style.scss';

function Section(props) {
  const { anchor, subTitle, title, children, link, theme } = props;

  return (
    <section className={theme.container}>
      {anchor && <a name={anchor}>&nbsp;</a>}
      {title &&
        <h2 className={theme.title}>{title}</h2>
      }
      {subTitle ? <h3 className={theme.subTitle}>{subTitle}</h3> : null}
      <div className={theme.content}>
        {children}
      </div>
      {link && <div className={theme.linkWrap}>
        <Link className={theme.link} to={link.url}>{link.title}</Link>
      </div>}
    </section>
  );
}

Section.defaultProps = {
  anchor: null,
  subTitle: '',
  title: null,
  link: null,
  theme: {},
};

Section.propTypes = {
  anchor: PT.string,
  subTitle: PT.string,
  title: PT.string,
  children: PT.node.isRequired,
  link: PT.shape({
    title: PT.string.isRequired,
    url: PT.string.isRequired,
  }),
  theme: PT.shape({
    container: PT.string,
    subTitle: PT.string,
    title: PT.string,
    content: PT.string,
    linkWrap: PT.string,
    link: PT.string,
  }),
};

export default themr('tcCommunities-Section', defaultStyle)(Section);
