/**
 * ContentSliderItem component
 */
import React from 'react';
import PT from 'prop-types';
import Banner from 'components/Contentful/Banner';
import ContentBlock from 'components/Contentful/ContentBlock';
import { ViewportLoader } from 'components/Contentful/Viewport';
import { errors } from 'topcoder-react-lib';

const { fireErrorMessage } = errors;

const COMPONENTS = {
  banner: Banner,
  contentBlock: ContentBlock,
  viewport: ViewportLoader,
};

function ContentSliderItem(props) {
  const {
    itemId,
    type,
    preview,
    spaceName,
    environment,
  } = props;
  const Component = COMPONENTS[type];
  if (Component) {
    return (
      <Component
        id={itemId}
        preview={preview}
        spaceName={spaceName}
        environment={environment}
      />
    );
  }
  return fireErrorMessage(
    'Unsupported content type from contentful',
    '',
  );
}

ContentSliderItem.defaultProps = {
  spaceName: '',
  environment: '',
};

ContentSliderItem.propTypes = {
  itemId: PT.string.isRequired,
  type: PT.string.isRequired,
  preview: PT.bool.isRequired,
  spaceName: PT.string,
  environment: PT.string,
};

export default ContentSliderItem;
