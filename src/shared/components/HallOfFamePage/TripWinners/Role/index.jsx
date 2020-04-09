/**
 * Role Component.  Renders the role and list of trip winner.
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';
import { Link } from 'topcoder-react-utils';

import defaultStyles from './styles.scss';

const Role = ({ data, theme }) => (
  <div className={theme.container}>
    <div className={theme.role}>
      {data.track}
    </div>
    {
      data.members.map(member => (
        <div key={member.fields.handle} className={theme.winner}>
          <Link to={`/members/${member.fields.handle}`} {...(_.includes(window.origin, 'www') ? { openNewTab: true } : '')}>
            {member.fields.handle}
          </Link>
        </div>
      ))
    }
    <div className={theme.filler} />
  </div>
);

Role.defaultProps = {};

Role.propTypes = {
  data: PT.shape().isRequired,
  theme: PT.shape().isRequired,
};

export default themr('hall-of-fame/tco-role', defaultStyles)(Role);
