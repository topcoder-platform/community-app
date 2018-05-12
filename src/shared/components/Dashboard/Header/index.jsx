/**
 * Child component of Dashboard/Header renders summary of user achievements,
 * money earned and number of active challenges. Also renders special badges
 * based of acheivement data.
*/
import React from 'react';
import PT from 'prop-types';

import Badge, { MAP, XL_MAP } from './Badge';

import './styles.scss';

export default function Header(props) {
  const {
    achievements,
    showXlBadge,
    xlBadge,
  } = props;
  const badges = achievements.filter(x => MAP[x.description]);
  return (
    <div styleName="container">
      <h1 styleName="title">Dashboard</h1>
      <div styleName="badges">
        {
          badges.map(({ description }) => (
            <Badge
              badge={MAP[description]}
              key={description}
              showXl={show => showXlBadge(show && description)}
              title={description}
              xlBadge={xlBadge === description && XL_MAP[xlBadge]}
            />
          ))
        }
      </div>
    </div>
  );
}

Header.defaultProps = {
  achievements: [],
};

Header.propTypes = {
  achievements: PT.arrayOf(PT.object),
  showXlBadge: PT.func.isRequired,
  xlBadge: PT.string.isRequired,
};
