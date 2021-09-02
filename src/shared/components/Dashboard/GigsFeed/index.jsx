/**
 * Gigs Feed component
 */
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import './styles.scss';
import { config } from 'topcoder-react-utils';

export default function GigsFeed({
  gigs,
  loading,
  theme,
}) {
  const formatRateType = rateType => `/${rateType === 'weekly' ? 'week' : rateType}`;
  return (
    <div styleName={`container ${theme}`}>
      <div styleName="header">
        <span styleName="title">GIGS</span>
        <a
          styleName="allLink"
          href={`${config.URL.COMMUNITY_APP}/gigs`}
          target="_blank"
          rel="noreferrer"
        >View all <span>gigs</span>
        </a>
      </div>
      <Scrollbars styleName="gigs">
        {loading || !gigs ? <div styleName="loading"><LoadingIndicator /></div>
          : gigs.map(gig => (
            <div styleName="row" key={`dashboard-gigs-feed-${gig.externalId}`}>
              <a
                href={`${config.URL.COMMUNITY_APP}/gigs/${gig.externalId}`}
                target="_blank"
                rel="noreferrer"
              >{gig.title}
              </a>
              <div styleName="salary">
                <span styleName="amount">
                  ${`${(gig.minSalary || 0).toLocaleString()} - ${
                  (gig.maxSalary || 0).toLocaleString()}`
                }
                </span>
                <span styleName="rateType">{formatRateType(gig.rateType)}</span>
              </div>
            </div>
          ))}
      </Scrollbars>
    </div>
  );
}

GigsFeed.defaultProps = {
  gigs: [],
  theme: 'light',
};

GigsFeed.propTypes = {
  gigs: PT.arrayOf(PT.shape()),
  loading: PT.bool.isRequired,
  theme: PT.oneOf(['dark', 'light']),
};
