/**
 * Component for group statistics section.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import IconStat from '../IconStat';
import Section from '../Section';

import IconBuilding from
'../../../../assets/images/tc-communities/tmp/building.svg';
import IconRocket from '../../../../assets/images/tc-communities/rocket.svg';
import IconMember from '../../../../assets/images/tc-communities/member.svg';
import IconDollar from '../../../../assets/images/tc-communities/dollar.svg';
import IconWork from '../../../../assets/images/tc-communities/suitcase.svg';

import style from './style.scss';

/* Mapping between statistic keys and icons. */
const ICONS = {
  numChallenges: IconRocket,
  numCompanies: IconBuilding,
  numMembers: IconMember,
  numProjects: IconWork,
  openPrizes: IconDollar,
  openTasks: IconWork,
  work: IconDollar,
};

/* Mapping between statistics keys and rendered labels. */
const LABELS = {
  numChallenges: 'Challenges',
  numCompanies: 'Companies',
  numMembers: 'Members',
  numProjects: 'Projects',
  openPrizes: 'Prizes',
  openTasks: 'Open Tasks',
  work: 'Work',
};

export default function CommunityStats({ stats, theme, icons, titles, filter }) {
  const iconsToRender = [];
  _.forIn(stats, (value, key) => {
    if (!filter || filter[key]) {
      const ICON = icons[key] || ICONS[key];
      const LABEL = titles[key] || LABELS[key];
      iconsToRender.push((
        <IconStat
          icon={ICON}
          key={key}
          label={LABEL}
          number={value}
          theme={theme}
        />
      ));
    }
  });
  return iconsToRender.length ? (
    <Section
      theme={{
        container: style.container,
        content: style.content,
      }}
    >{iconsToRender}</Section>
  ) : null;
}

CommunityStats.defaultProps = {
  stats: {},
  theme: {},
  icons: {},
  titles: {},
  filter: null,
};

const numberOrString = PT.oneOfType([PT.number, PT.string]);
const iconOrPath = PT.oneOfType([PT.func, PT.string]);

CommunityStats.propTypes = {
  stats: PT.shape({
    numChallenges: numberOrString,
    numMembers: numberOrString,
    numProjects: numberOrString,
    openPrizes: numberOrString,
  }),
  theme: PT.shape(),
  icons: PT.shape({
    numChallenges: iconOrPath,
    numMembers: iconOrPath,
    numProjects: iconOrPath,
    openPrizes: iconOrPath,
  }),
  titles: PT.shape(),
  filter: PT.shape(),
};
