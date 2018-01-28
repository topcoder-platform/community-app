/**
 * LinksCard component
 */

import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { Link } from 'topcoder-react-utils';
import defaultStyle from './style.scss';

function LinksCard(props) {
  const { title, links, theme } = props;

  return (
    <nav className={theme.container}>
      <h3 className={theme.title}>{title}</h3>
      <ul className={theme.list}>
        {_.map(links, (link, index) => (
          <li className={theme.item} key={index}>
            <Link
              className={theme.link}
              openNewTab={link.openNewTab}
              to={link.url}
            >{link.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

LinksCard.defaultProps = {
  theme: {},
};

LinksCard.propTypes = {
  title: PT.string.isRequired,
  links: PT.arrayOf(PT.shape({
    openNewTab: PT.bool,
    title: PT.string.isRequired,
    url: PT.string.isRequired,
  })).isRequired,
  theme: PT.shape({
    container: PT.string,
    title: PT.string,
    list: PT.string,
    item: PT.string,
    link: PT.string,
  }),
};

export default themr('tcCommunities-LinksCard', defaultStyle)(LinksCard);
