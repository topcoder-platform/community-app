/**
 * Renders the Technology/Platform Tags for ChallengeCard and ReviewOpportunityCard
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Tag } from 'topcoder-react-ui-kit';

// The number of technologies to be shown without requiring expanding
const VISIBLE_TECHNOLOGIES = 3;

/**
 * Implements <Tags> component
 */
export default function Tags({ expand, isExpanded, technologies, platforms, onTechTagClicked }) {
  const onClick = (item) => {
    // resolved conflict with c++ tag
    if (item.indexOf('+') === 0) {
      if (expand) expand();
    } else {
      onTechTagClicked(item);
    }
  };

  const renderTechnologies = () => {
    const combined = _.union(
      technologies ? technologies.split(',').map(item => item.trim()) : [],
      platforms ? platforms.split(',').map(item => item.trim()) : [],
    );

    if (combined.length) {
      let display = combined;
      // If the number of tags to display is larger than VISIBLE_TECHNOLOGIES
      // the last tag shown will be +num and when clicked
      // will expand the Tags component to show all of the tags
      if (combined.length > VISIBLE_TECHNOLOGIES && !isExpanded) {
        const expandItem = `+${display.length - VISIBLE_TECHNOLOGIES}`;
        display = combined.slice(0, VISIBLE_TECHNOLOGIES);
        display.push(expandItem);
      }
      return display.map(item => (
        <Tag
          onClick={() => onClick(item.trim())}
          key={item}
          role="button"
        >{item}</Tag>
      ));
    }
    return '';
  };

  return (
    <span>
      { renderTechnologies() }
    </span>
  );
}

// Default Props
Tags.defaultProps = {
  onTechTagClicked: _.noop,
  technologies: '',
  platforms: '',
  isExpanded: false,
  expand: null,
};

// Prop validation
Tags.propTypes = {
  onTechTagClicked: PT.func,
  technologies: PT.string,
  platforms: PT.string,
  isExpanded: PT.bool,
  expand: PT.func,
};
