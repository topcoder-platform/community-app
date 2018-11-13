/**
 * Renders Tabs with data from Contentful
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import Tabs, { TAB_THEMES } from './Tabs';

function ContentfulTabs(props) {
  const {
    id,
    preview,
    spaceName,
    environment,
  } = props;

  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const { fields } = Object.values(data.entries.items)[0];
        if (!fields) return null;

        return (
          <Tabs
            ids={_.map(fields.tabsList, 'sys.id')}
            preview={preview}
            spaceName={spaceName}
            environment={environment}
            selected={fields.selected}
            theme={TAB_THEMES[fields.theme || 'Default']}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulTabs.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

ContentfulTabs.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

export default ContentfulTabs;
