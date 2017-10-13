/** 
 * Child component of Dashboard/Header renders summary of user achievements, 
 * money earned and number of active challenges. Also renders special badges
 * based of acheivement data.  
*/
import React from 'react';
import PT from 'prop-types';

import './styles.scss';

export default function Header(props) {
  const { title, financials, achievements, myChallenges } = props;
  return (
    <div styleName="header-dashboard">
      <div styleName="page-state-header">
        <header>
          <div styleName="page-info">
            <h1>{title}</h1>
          </div>
          <div styleName="info">
            {
              myChallenges > 0 &&
              <div styleName="item">
                <div styleName="value">
                  <p>{myChallenges}</p>
                </div>
                <div styleName="title"><p>Active Challenges</p></div>
              </div>
            }
            {
              financials > 0 &&
              <div styleName="item">
                <div styleName="value">
                  <p styleName="number">${financials.toLocaleString()}</p>
                </div>
                <div styleName="title"><p>Won in Prizes</p></div>
              </div>
            }
            {
              achievements && achievements.length > 0 &&
              <div styleName="badgeItem">
                <div title={achievements[0].description} styleName="dashboardBadge" />
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
  financials: PT.number,
  achievements: React.PropTypes.arrayOf(React.PropTypes.object),
  myChallenges: PT.number,
};

Header.defaultProps = {
  title: '',
  financials: 0,
  achievements: [],
  myChallenges: 0,
};
