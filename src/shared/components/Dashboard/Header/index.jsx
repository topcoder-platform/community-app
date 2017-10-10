import React from 'react';
import PT from 'prop-types';

import Handle from 'components/Handle';
import Badge from './Badge';
import './styles.scss';

export default function Header(props) {
  const { title, profile, financials } = props;
  return (
    <div styleName="header-dashboard">
      <div styleName="page-state-header">
        <header>
          <div styleName="page-info">
            <h1>{title}</h1>
          </div>
          <div styleName="info">
            {
              profile && <div styleName="user-metrics">
                <Handle handle={profile.handle} size={24} rating={profile.maxRating.rating} />
                {
                  financials > 0 &&
                  <div styleName="money-earned">
                    <p styleName="number">${financials.toLocaleString()}</p>
                    <p>Earned</p>
                  </div>
                }
              </div>
            }
            <Badge />
          </div>
        </header>
      </div>
    </div>
  );
}

Header.propTypes = {
  title: PT.string,
  profile: PT.shape(),
  financials: PT.number,
};

Header.defaultProps = {
  title: '',
  profile: {
    maxRating: {},
  },
  financials: 0,
};
