/**
 * Role Component.  Renders the role and list of trip winner.
 */
import React from 'react';
import PT from 'prop-types';
import { themr } from 'react-css-super-themr';

import defaultStyles from './styles.scss';

const Role = ({ data, theme }) => (
  <div className={theme.container}>
    <div className={theme.role}>
      {data.track}
    </div>
    {
      data.members.map(member => (
        <div key={member.fields.handle} className={theme.winner}>
          {member.fields.handle}
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
