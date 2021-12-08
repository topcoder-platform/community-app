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
  // const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const { fields } = data.entries.items[id];
        const imgId = _.get(fields, 'source.sys.id');
        const imgIdMobile = _.get(fields, 'sourceMobile.sys.id');
        const imgIdPolyfill = _.get(fields, 'sourcePolyfill.sys.id');
        const imgIdPolyfillMobile = _.get(fields, 'sourceMobilePolyfill.sys.id');
        const clipSvgId = _.get(fields, 'clipSvg.sys.id');
        const assetIds = _.compact(
          [imgId, imgIdMobile, imgIdPolyfill, imgIdPolyfillMobile, clipSvgId],
        );
        const animationId = _.get(fields, 'animationOnScroll.sys.id');
        const entryIds = [];
        if (animationId) {
          entryIds.push(animationId);
        }
        if (assetIds.length !== 0) {
          return (
            <ContentfulLoader
              entryIds={entryIds}
              assetIds={assetIds}
              preview={preview}
              spaceName={spaceName}
              environment={environment}
              render={(assetData) => {
                const { items } = assetData.assets;
                const clipSvgFields = _.get(items, [clipSvgId, 'fields']);
                const imageSources = {
                  source: _.get(items, [imgId, 'fields']),
                  sourceMobile: _.get(items, [imgIdMobile, 'fields']),
                  sourcePolyfill: _.get(items, [imgIdPolyfill, 'fields']),
                  sourcePolyfillMobile: _.get(items, [imgIdPolyfillMobile, 'fields']),
                };
                let animation = {};
                if (animationId) {
                  animation = { ...assetData.entries.items[animationId].fields };
                }
                return (
                  <Image
                    {...props}
                    imageSources={imageSources}
                    clipSvg={clipSvgFields}
                    image={fields}
                    theme={defaultTheme}
                    animation={animation}
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
