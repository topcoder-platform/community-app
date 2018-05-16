import _ from 'lodash';
import PT from 'prop-types';
import React from 'react';

import BadgePredixCommunity from
  'assets/images/dashboard/badge-predix-community.png';
import BadgeSrmEngagementHonor from
  'assets/images/dashboard/badge-srm-engagement-honor.png';
import BadgeTco17Champion from
  'assets/images/dashboard/badge-tco17-gold.svg';
import BadgeTco17Finalist from
  'assets/images/dashboard/badge-tco17-finalist.svg';

import './style.scss';

export const MAP = {
  'Algorithm Target': 'algorithmTarget',
  'CoECI Client Badge': 'coEciClientBadge',
  'Crowd for Good': 'crowdForGood',
  'Designer of the Month': 'designerOfTheMonth',
  'Digital Run Top Five': 'digitalRunTopFive',
  'Digital Run Winner': 'digitalRunWinner',
  'iOS Community': 'iosCommunity',
  'Marathon Match Winner': 'marathonMatchWinner',
  'Member of the Month': 'memberOfTheMonth',
  'Predix Community': 'predixCommunity',
  'Solved Hard Div1 Problem in SRM': 'solvedHardDiv1ProblemInSrm',
  'Solved Hard Div2 Problem in SRM': 'solvedHardDiv2ProblemInSrm',
  'SRM Engagement Honor': 'srmEngagementHonor',
  'SRM Winner Div 1': 'srmWinnerDiv1',
  'SRM Winner Div 2': 'srmWinnerDiv2',
  'Studio Cup Top Five': 'studioCupTopFive',
  'Studio Cup Winner': 'studioCupWinner',
  'Studio Mentor': 'studioMentor',
  'Studio Reviewer': 'studioReviewer',
  'Studio Screener': 'studioScreener',
  'Studio Spec Reviewer': 'studioSpecReviewer',
  'Studio Spirit': 'studioSpirit',
  'TCO17 Champion': 'tco17Champion',
  'TCO17 Finalist': 'tco17Finalist',
  'TopCoder Reviewer': 'topcoderReviewer',
};

/* Holds the mapping between achievement names and optional XL size badges. */
export const XL_MAP = {
  'Predix Community': BadgePredixCommunity,
  'SRM Engagement Honor': BadgeSrmEngagementHonor,
  'TCO17 Champion': <BadgeTco17Champion styleName="xlBadge" />,
  'TCO17 Finalist': <BadgeTco17Finalist styleName="xlBadge" />,
};

export default function Badge({
  badge,
  showXl,
  title,
  xlBadge,
}) {
  let xlBadgeNode;
  if (xlBadge) {
    xlBadgeNode = (
      <div
        onMouseMove={(e) => {
          e.stopPropagation();
          showXl();
        }}
        styleName="xlBadgeNode"
      >
        <div
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          styleName="xlBadgeHider"
        />
        {
          _.isString(xlBadge) ? (
            <img
              alt={title}
              src={xlBadge}
              styleName="xlBadgeImage"
            />
          ) : xlBadge
        }
      </div>
    );
  }
  return (
    <div
      onMouseMove={() => showXl(true)}
      onMouseEnter={() => showXl(true)}
      onMouseLeave={() => showXl()}
      styleName={`badge ${badge}`}
      title={title}
    >{xlBadgeNode}
    </div>
  );
}

Badge.defaultProps = {
  xlBadge: '',
};

Badge.propTypes = {
  badge: PT.string.isRequired,
  showXl: PT.func.isRequired,
  title: PT.string.isRequired,
  xlBadge: PT.oneOfType([PT.node, PT.string]),
};
