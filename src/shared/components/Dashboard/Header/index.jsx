import React from 'react';
import PT from 'prop-types';

import Handle from 'components/Handle';
import DefaultUserIcon from '../../../../assets/images/ico-user-default.svg';
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
            <div styleName="pic">
              <a>
                {
                  (!profile || !profile.photoURL) &&
                  <DefaultUserIcon width={60} height={60} />
                }
                {
                  profile && profile.photoURL &&
                  <img alt="" src={profile.photoURL} styleName="profile-circle" />
                }
              </a>
            </div>
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
