import React from 'react';
import PT from 'prop-types';
import moment from 'moment';

import './styles.scss';

const MemberInfo = ({ country, info, wins }) => (
  <div styleName="member-info">
    <div styleName="country">
      <span>{ country }</span>
    </div>

    <h3 styleName="tenure">
      Member Since
      {' '}
      {moment(info.createdAt).format('MMM YYYY')}
    </h3>

    <div styleName="activity">
      <h3>COMPETITION ACTIVITY</h3>

      {Boolean(wins) && (
        <div styleName="wins">
          <span>
            {wins}
            {' '}
            WINS
          </span>

        </div>
      )
      }
    </div>

  </div>
);

MemberInfo.defaultProps = {
  country: '',
  info: {},
  wins: 0,
};

MemberInfo.propTypes = {
  country: PT.string,
  info: PT.shape(),
  wins: PT.number,
};

export default MemberInfo;
