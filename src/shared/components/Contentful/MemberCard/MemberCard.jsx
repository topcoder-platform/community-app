/**
 * The core member card rendering.
 */

import PT from 'prop-types';
import React from 'react';

import { themr } from 'react-css-super-themr';
import { fixStyle } from 'utils/contentful';
import _ from 'lodash';
import { getName } from 'country-list';

import defaultTheme from './themes/default.scss';

require('flag-icon-css/css/flag-icon.css');

export function MemberCardInner({
  id,
  image,
  trackIcon,
  memberCard,
  theme,
}) {
  const country = memberCard.country && memberCard.country.toLowerCase();
  const imageUrl = _.get(image, 'file.url');
  const trackIconUrl = _.get(trackIcon, 'file.url');
  const { memberName, trackColor, description } = memberCard;
  let countryName = getName(country).toLocaleUpperCase();
  if (countryName === 'UNITED STATES OF AMERICA') countryName = 'USA';
  if (countryName === 'VENEZUELA, BOLIVARIAN REPUBLIC OF') countryName = 'VENEZUELA';

  return (
    <a
      href={memberCard.url}
      className={theme.memberCard}
      id={id}
      style={fixStyle(memberCard.extraStylesForContainer)}
    >
      { imageUrl && (
        <div className={theme.imageWrapper}>
          <img src={imageUrl} alt={`${memberName}'s profile`} />
        </div>
      )}
      <div className={theme.info}>
        { trackIconUrl && (
          <div className={theme.trackIcon} style={{ backgroundColor: trackColor || '#63c630' }}>
            <img src={trackIconUrl} alt="track icon" />
          </div>
        )}
        <div className={theme.handleWrapper}>
          <div className={theme.handle}>{memberCard.memberHandle}</div>
          { memberName && (
            <div className={theme.memberName}>{memberName}</div>
          )}
          { description && (
            <div className={theme.description}>{description}</div>
          )}
          { country && (
            <div className={theme.countryWrapper}>
              <span className={`flag-icon flag-icon-${country} ${theme.flag}`} />
              <span className={theme.countryName}>
                {countryName}
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

MemberCardInner.defaultProps = {
  image: null,
  trackIcon: null,
};

MemberCardInner.propTypes = {
  id: PT.string.isRequired,
  image: PT.shape(),
  trackIcon: PT.shape(),
  memberCard: PT.shape().isRequired,
  theme: PT.shape({
    memberCard: PT.string,
    imageWrapper: PT.string,
    info: PT.string,
    trackIcon: PT.string,
    handleWrapper: PT.string,
    handle: PT.string,
    flag: PT.string,
    memberName: PT.any,
    countryWrapper: PT.any,
    countryName: PT.any,
    description: PT.any,
  }).isRequired,
};

export default themr('MemberCard', defaultTheme)(MemberCardInner);
