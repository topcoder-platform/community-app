/**
 * Footer with logos for Topcoder sub-communities.
 */
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyle from './style.scss';

function FooterLogos({ logos, theme }) {
  return (
    <div className={theme.footerLogos}>
      <ul className={theme.logos}>
        {logos.map(logo => (
          <li key={logo.img}>
            <a href={logo.url} target="_blank" rel="noopener noreferrer">
              <img src={logo.img} alt="logo" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

FooterLogos.propTypes = {
  logos: PT.arrayOf(PT.shape({
    img: PT.string.isRequired,
    url: PT.string,
  })).isRequired,
  theme: PT.shape({
    footerLogos: PT.string,
    logos: PT.string,
  }).isRequired,
};

export default themr('tc-communitiesFooterLogos', defaultStyle)(FooterLogos);
