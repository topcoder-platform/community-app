/**
 * Track Abbreviation Tooltip Component.
 *
 * USAGE:
 * Wrap with <TrackAbbreviationTooltip></TrackAbbreviationTooltip> tags the element(s)
 * which should show the tooltip when hovered. Pass in 'track' and 'subTrack' props.
 */

import React from 'react';
import PT from 'prop-types';
import Tooltip from 'components/Tooltip';
import './style.scss';

const DESCRIPTION = {
  // TODO: [Review Opps] This is temporary
  REVIEW_OPPORTUNITY: 'As a topcoder member, you can participate in review boards that review work submitted into challenges by other members.',
  APPLICATION_FRONT_END_DESIGN: 'Design UI and front end experiences for apps',
  ARCHITECTURE: 'Architect modules, components, or full applications',
  ASSEMBLY_COMPETITION: 'Develop code for a variety of use cases. Rigorous review and final fix process is included.',
  BANNERS_OR_ICONS: 'Design UI assets for use in web, mobile, print, and other digital formats',
  BUG_HUNT: 'Quickly find Bugs in apps, websites',
  CODE: 'Develop code for apps, services, etc. Final fixes are not included',
  CONCEPTUALIZATION: 'Discover and define user stories and requirements',
  DESIGN_FIRST_2_FINISH: 'Be the first to deliver the design solution',
  FIRST_2_FINISH: 'Be the first to deliver the development solution',
  LOGO_DESIGN: 'Logo Design',
  MARATHON_MATCH: 'Write algorithms to solve complex problems, often for real world issues',
  PRINT_OR_PRESENTATION: 'Design print and presentation assets',
  SRM: 'Single Round Match - quickly write code to solve algorithm problems head to head against other competitors',
  STUDIO_OTHER: 'Studio other',
  UI_PROTOTYPE_COMPETITION: 'Develop the front end of a UX',
  WEB_DESIGNS: 'Design UI and front end experiences for web experiences',
  WIDGET_OR_MOBILE_SCREEN_DESIGN: 'Design UI and front end experiences for mobile',
  WIREFRAMES: 'Produce the information architecture for user experiences',
};

const HEADER = {
  REVIEW_OPPORTUNITY: 'Review Opportunity', // TODO: [Review Opps] this is temporary
  APPLICATION_FRONT_END_DESIGN: 'Application Front-End Design (AFED)',
  ARCHITECTURE: 'Architecture (Ar)',
  ASSEMBLY_COMPETITION: 'Assembly (As)',
  BANNERS_OR_ICONS: 'Banners/Icons (BI)',
  BUG_HUNT: 'Bug Hunt (BH)',
  CODE: 'Code (Cd)',
  CONCEPTUALIZATION: 'Conceptualization (Cn)',
  DESIGN_FIRST_2_FINISH: 'Design First2Finish(DF2F)',
  FIRST_2_FINISH: 'First2Finish (F2F)',
  LOGO_DESIGN: 'Logo Design (Lg)',
  MARATHON_MATCH: 'Marathon Match',
  PRINT_OR_PRESENTATION: 'Print/Presentation (PP)',
  SRM: 'Single Round Match (SRM)',
  UI_PROTOTYPE_COMPETITION: 'UI Prototype (Pr)',
  WEB_DESIGNS: 'Web Design (Wb)',
  WIDGET_OR_MOBILE_SCREEN_DESIGN: 'Widget or Mobile Screen Design (Wg)',
  STUDIO_OTHER: 'Generic design challenge (D)',
  WIREFRAMES: 'Wireframe (Wf)',
};

const TRACK_COLOR_CLASS = {
  DESIGN: 'blue',
  DEVELOP: 'green',
  DATA_SCIENCE: 'orange',
};

/**
 * Renders the tooltip's content.
 */
function Tip({
  subTrack,
  track,
}) {
  return (
    <div styleName="track-abbreviation-tooltip">
      <div styleName={`header ${TRACK_COLOR_CLASS[track]}`}>
        {HEADER[subTrack]}
      </div>
      <div styleName="body">
        {DESCRIPTION[subTrack]}
      </div>
    </div>
  );
}

Tip.propTypes = {
  subTrack: PT.string.isRequired,
  track: PT.string.isRequired,
};

function placeArrow(TooltipNode) {
  const arrow = TooltipNode.querySelector('.rc-tooltip-arrow');
  arrow.style.left = '15px';
}

/**
 * Renders the tooltip.
 */
function TrackAbbreviationTooltip({
  children,
  subTrack,
  track,
}) {
  const tip = <Tip track={track} subTrack={subTrack} />;
  return (
    <Tooltip
      className="track-abbreviation-tooltip"
      content={tip}
      position="topLeft"
      placeArrow={placeArrow}
    >
      {children}
    </Tooltip>
  );
}

TrackAbbreviationTooltip.propTypes = {
  children: PT.node.isRequired,
  subTrack: PT.string.isRequired,
  track: PT.string.isRequired,
};

export default TrackAbbreviationTooltip;
