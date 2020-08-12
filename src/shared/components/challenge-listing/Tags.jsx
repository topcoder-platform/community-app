/**
 * Renders the Tags for ChallengeCard and ReviewOpportunityCard
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Tag } from 'topcoder-react-ui-kit';

// The number of tags to be shown without requiring expanding
const VISIBLE_TAGS = 3;

/**
 * Implements <Tags> component
 */
export default function Tags({
  expand, isExpanded, tags, onTechTagClicked, challengesUrl,
}) {
  const onClick = (item) => {
    // resolved conflict with c++ tag
    if (item.indexOf('+') === 0) {
      if (expand) expand();
    } else {
      onTechTagClicked(item);
    }
  };

  const renderTags = () => {
    if (tags.length) {
      let display = [...new Set(tags)];
      // If the number of tags to display is larger than VISIBLE_TAGS
      // the last tag shown will be +num and when clicked
      // will expand the Tags component to show all of the tags
      if (tags.length > VISIBLE_TAGS && !isExpanded) {
        const expandItem = `+${display.length - VISIBLE_TAGS}`;
        display = tags.slice(0, VISIBLE_TAGS);
        display.push(expandItem);
      }
      return display.map(item => (
        <Tag
          onClick={() => onClick(item.trim())}
          key={item}
          role="button"
          to={(challengesUrl && item.indexOf('+') !== 0) ? `${challengesUrl}?filter[tags][0]=${
            encodeURIComponent(item)}` : null}
        >
          {item}
        </Tag>
      ));
    }
    return '';
  };

  return (
    <span>
      { renderTags() }
    </span>
  );
}

// Default Props
Tags.defaultProps = {
  onTechTagClicked: _.noop,
  tags: [],
  isExpanded: false,
  expand: null,
  challengesUrl: null,
};

// Prop validation
Tags.propTypes = {
  onTechTagClicked: PT.func,
  tags: PT.arrayOf(PT.string),
  isExpanded: PT.bool,
  expand: PT.func,
  challengesUrl: PT.string,
};
