/**
 * ResourceCard component
 */

import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { Link } from 'topcoder-react-utils';
import defaultStyle from './style.scss';

function ResourceCard(props) {
  const { icon: Icon, title, text, link, theme } = props;

  return (
    <div className={theme.container}>
      {Boolean(Icon) && <Icon className={theme.icon} />}
      <h3 className={theme.title}>{title}</h3>
      <p className={theme.text}>{text}</p>
      {link &&
        <div className={theme.linkWrap}>
          <Link
            className={theme.link}
            openNewTab={link.openNewTab}
            to={link.url}
          >{link.title}</Link>
        </div>
      }
    </div>
  );
}

ResourceCard.defaultProps = {
  icon: null,
  link: null,
  text: '',
  theme: {},
};

ResourceCard.propTypes = {
  icon: PT.func,
  title: PT.string.isRequired,
  text: PT.string,
  link: PT.shape({
    openNewTab: PT.bool,
    title: PT.string.isRequired,
    url: PT.string.isRequired,
  }),
  theme: PT.shape({
    container: PT.string,
    icon: PT.string,
    title: PT.string,
    text: PT.string,
    linkWrap: PT.string,
    link: PT.string,
  }),
};

export default themr('ResourceCard2', defaultStyle)(ResourceCard);
