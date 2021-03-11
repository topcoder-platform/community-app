/**
 * Renders the Tags for ChallengeCard and ReviewOpportunityCard
 */
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import { Tag } from 'topcoder-react-ui-kit';
import Tooltip from 'components/Tooltip';
import VerifiedTag from './VerifiedTag';
import './style.scss';

// The number of tags to be shown without requiring expanding
const VISIBLE_TAGS = 3;

/**
 * Implements <Tags> component
 */
export default function Tags({
  expand, isExpanded, tags, onTechTagClicked, challengesUrl, recommended, verifiedTags,
}) {
  const onClick = (item) => {
    // resolved conflict with c++ tag
    if (item.indexOf('+') === 0) {
      if (expand) expand();
    } else {
      onTechTagClicked(item);
    }
  };

  const tagRedirectLink = (item) => {
    if (challengesUrl && item.indexOf('+') !== 0) {
      return `${challengesUrl}?filter[tags][0]=${
        encodeURIComponent(item)}`;
    }
    return null;
  };

  const additionalTags = (items, verifiedTagIndex) => (
    <div styleName="additionalTagWrapper">
      {
        items.map((item, index) => {
          if (index < verifiedTagIndex) {
            return (
              <VerifiedTag
                challengesUrl={challengesUrl}
                item={item}
                onClick={onClick}
                recommended={recommended}
              />
            );
          }
          return (
            (
              <div styleName="additionalTag">
                <Tag
                  onClick={() => onClick(item.trim())}
                  key={item}
                  role="button"
                  to={tagRedirectLink(item)}
                >
                  <span>{item}</span>
                </Tag>
              </div>
            )
          );
        })
      }
    </div>
  );

  const renderTags = () => {
    const nonVerified = tags.filter(tag => !verifiedTags.includes(tag));
    const allTags = _.union(verifiedTags, nonVerified);

    if (allTags.length) {
      let display = [...new Set(allTags)];
      // If the number of tags to display is larger than VISIBLE_TAGS
      // the last tag shown will be +num and when clicked
      // will expand the Tags component to show all of the tags
      if (allTags.length > VISIBLE_TAGS && !isExpanded) {
        const expandItem = `+${display.length - VISIBLE_TAGS}`;
        display = allTags.slice(0, VISIBLE_TAGS);
        display.push(expandItem);
      }
      return display.map((item, index) => {
        if ((recommended && index < verifiedTags.length) || item[0] === '+') {
          return (
            item[0] === '+' ? (
              <div styleName="recommended-plus-tag">
                <Tooltip
                  id="recommended-tip"
                  content={additionalTags(
                    allTags.slice(VISIBLE_TAGS), verifiedTags.length - VISIBLE_TAGS,
                  )}
                  trigger={['hover', 'focus']}
                  className="overlayTagBg"
                >
                  <Tag
                    onClick={() => onClick(item.trim())}
                    key={item}
                    role="button"
                    to={tagRedirectLink(item)}
                  >
                    <span>{item}</span>
                  </Tag>
                </Tooltip>
              </div>
            )
              : (
                <VerifiedTag
                  challengesUrl={challengesUrl}
                  item={item}
                  onClick={onClick}
                  recommended={recommended}
                />
              )
          );
        }

        return (
          <Tag
            onClick={() => onClick(item.trim())}
            key={item}
            role="button"
            to={tagRedirectLink(item)}
          >
            <span>{item}</span>
          </Tag>
        );
      });
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
  recommended: false,
  verifiedTags: [],
};

// Prop validation
Tags.propTypes = {
  onTechTagClicked: PT.func,
  tags: PT.arrayOf(PT.string),
  isExpanded: PT.bool,
  expand: PT.func,
  challengesUrl: PT.string,
  recommended: PT.bool,
  verifiedTags: PT.arrayOf(PT.string),
};
