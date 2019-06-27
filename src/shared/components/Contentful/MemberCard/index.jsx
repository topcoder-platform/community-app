/**
 * Member Card component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';

import MemberCard from './MemberCard';
import defaultTheme from './themes/default.scss';

// Future themes added here
const THEMES = {
  Default: defaultTheme,
};

/* Loads the main member card entry. */
export default function MemberCardLoader(props) {
  const {
    id, preview, spaceName, environment,
  } = props;
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const { fields } = data.entries.items[id];
        const imgId = _.get(fields, 'image.sys.id');
        const trackIconId = _.get(fields, 'trackIcon.sys.id');
        const assetIds = _.compact([imgId, trackIconId]);
        const theme = THEMES[fields.theme];
        if (assetIds.length !== 0) {
          return (
            <ContentfulLoader
              assetIds={assetIds}
              preview={preview}
              spaceName={spaceName}
              environment={environment}
              render={(assetData) => {
                const { items } = assetData.assets;
                const imgFields = _.get(items, [imgId, 'fields']);
                const trackIconFields = _.get(items, [trackIconId, 'fields']);
                return (
                  <MemberCard
                    {...props}
                    image={imgFields}
                    trackIcon={trackIconFields}
                    memberCard={fields}
                    theme={theme}
                  />
                );
              }}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }
        return <MemberCard memberCard={fields} theme={theme} />;
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

MemberCardLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

MemberCardLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
