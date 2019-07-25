/**
 * Image component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';

import Image from './Image';
import defaultTheme from './themes/default.scss';


/* Loads the main image entry. */
export default function ImageLoader(props) {
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
        const imgId = _.get(fields, 'source.sys.id');
        const clipSvgId = _.get(fields, 'clipSvg.sys.id');
        const assetIds = _.compact([imgId, clipSvgId]);
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
                const clipSvgFields = _.get(items, [clipSvgId, 'fields']);
                return (
                  <Image
                    {...props}
                    imageSource={imgFields}
                    clipSvg={clipSvgFields}
                    image={fields}
                    theme={defaultTheme}
                  />
                );
              }}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }
        return <Image {...props} image={fields} theme={defaultTheme} />;
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ImageLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

ImageLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
