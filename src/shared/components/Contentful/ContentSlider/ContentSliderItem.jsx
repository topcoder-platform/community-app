/**
 * ContentSliderItem component
 */
import React from 'react';
import PT from 'prop-types';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import { errors } from 'topcoder-react-lib';

const { fireErrorMessage } = errors;

const COMPONENTS = {
  banner: Banner,
  contentBlock: ContentBlock,
};

function ContentSliderItem(props) {
  const {
    itemId,
    type,
    preview,
  } = props;
  const Component = COMPONENTS[type];
  if (Component) {
    return (
      <Component
        id={itemId}
        preview={preview}
      />
    );
  }
  return fireErrorMessage(
    'Unsupported content type from contentful',
    '',
  );
}

ContentSliderItem.propTypes = {
  itemId: PT.string.isRequired,
  type: PT.string.isRequired,
  preview: PT.bool.isRequired,
};

export default ContentSliderItem;
