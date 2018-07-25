/**
 * Renders Tabs with data from Contentful
 */
import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { themr } from 'react-css-super-themr';
import Tabs from './Tabs';

import defaultTheme from './style.scss';

function ContentfulTabs(props) {
  const {
    id,
    preview,
    theme,
  } = props;

  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      render={(data) => {
        const { fields } = Object.values(data.entries.items)[0];
        if (!fields) return null;

        return (
          <Tabs
            ids={_.map(fields.tabsList, 'sys.id')}
            preview={preview}
            selected={fields.selected}
            theme={theme}
          />
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ContentfulTabs.defaultProps = {
  preview: false,
  theme: {},
};

ContentfulTabs.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  theme: PT.shape(),
};

export default themr('ContentfulTabs', defaultTheme)(ContentfulTabs);
