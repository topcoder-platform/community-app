/**
 * Custom component for group statistics section for the Wipro community.
 */

import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';
import Section from '../../../Section';

import style from './style.scss';

const IconRocket = '../../../../../../themes/wipro/challenges.png';
const IconMember = '../../../../../../themes/wipro/members.png';
const IconDollar = '../../../../../../themes/wipro/prizes.png';

/* Mapping between statistic keys and icons. */
const ICONS = {
  numChallenges: IconRocket,
  numCompanies: IconRocket,
  numMembers: IconMember,
  numProjects: IconRocket,
  openPrizes: IconDollar,
  openTasks: IconRocket,
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

export default function CommunityStats(props) {
  const icons = [];
  _.forIn(props.stats, (value, key) =>
    icons.push((
      <div styleName="statsContainer" key={key}>
        <img alt="Icon" src={ICONS[key]} styleName="statsIcon" />
        <div styleName="text">
          <p styleName="statsValue">{value}</p>
          <p styleName="statsLabel">{LABELS[key]}</p>
        </div>
      </div>
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

CommunityStats.defaultProps = {
  stats: {},
};

const numberOrString = PT.oneOfType([PT.number, PT.string]);

CommunityStats.propTypes = {
  stats: PT.shape({
    numChallenges: numberOrString,
    numMembers: numberOrString,
    numProjects: numberOrString,
    openPrizes: numberOrString,
  }),
};
