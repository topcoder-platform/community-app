/**
 * Member Card component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';

// eslint-disable-next-line import/no-named-as-default
import MemberTalkCloud from './MemberTalkCloud';

/* Loads the main member card entry. */
export default function MemberTalkCloudLoader(props) {
  const {
    id, preview, spaceName, environment,
  } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(cloudData) => {
        const { fields } = cloudData.entries.items[id];
        return (
          <ContentfulLoader
            entryIds={_.map(fields.items, 'sys.id')}
            preview={preview}
            spaceName={spaceName}
            environment={environment}
            render={cloudItemsData => (
              <MemberTalkCloud
                id={id}
                content={_.map(cloudItemsData.entries.items, item => ({
                  imageURL: item.fields.avatar.fields.file.url,
                  text: item.fields.text || item.fields.name,
                  ReadMoreURL: item.fields.linkURL,
                  ReadMoreText: item.fields.linkText,
                  handle: item.fields.handle,
                  handleColor: item.fields.handleColor,
                }))}
                extraStylesForContainer={fields.extraStylesForContainer}
              />
            )}
            renderPlaceholder={LoadingIndicator}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

MemberTalkCloudLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

MemberTalkCloudLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
