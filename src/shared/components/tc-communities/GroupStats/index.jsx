/**
 * Component for group statistics section.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import IconStat from '../IconStat';
import Section from '../Section';

import IconSuitcase from '../../../../assets/images/tc-communities/suitcase.svg';
import IconRocket from '../../../../assets/images/tc-communities/rocket.svg';
import IconMember from '../../../../assets/images/tc-communities/member.svg';
import IconDollar from '../../../../assets/images/tc-communities/dollar.svg';

import style from './style.scss';

/* Mapping between statistic keys and icons. */
const ICONS = {
  numChallenges: IconRocket,
  numMembers: IconMember,
  numProjects: IconSuitcase,
  openPrizes: IconDollar,
};

/* Mapping between statistics keys and rendered labels. */
const LABELS = {
  numChallenges: 'Challenges',
  numMembers: 'Members',
  numProjects: 'Projects',
  openPrizes: 'Prizes',
};

export default function GroupStats(props) {
  const icons = [];
  _.forIn(props.stats, (value, key) =>
    icons.push((
      <IconStat
        icon={ICONS[key]}
        key={key}
        label={LABELS[key]}
        number={value}
      />
    )),
  );
  return icons.length ? (
    <Section
      theme={{
        container: style.container,
        content: style.content,
      }}
    >{icons}</Section>
  ) : null;
}

GroupStats.defaultProps = {
  stats: {},
};

const numberOrString = PT.oneOfType([PT.number, PT.string]);

GroupStats.propTypes = {
  stats: PT.shape({
    numChallenges: numberOrString,
    numMembers: numberOrString,
    numProjects: numberOrString,
    openPrizes: numberOrString,
  }),
};
