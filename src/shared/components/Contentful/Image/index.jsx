/**
 * Image component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { useMediaQuery } from 'react-responsive';

import Image from './Image';
import defaultTheme from './themes/default.scss';


/* Loads the main image entry. */
export default function ImageLoader(props) {
  const {
    id, preview, spaceName, environment,
  } = props;
  const isTabletOrMobile = useMediaQuery({ maxWidth: 768 });
  return (
    <ContentfulLoader
      entryIds={id}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={(data) => {
        const { fields } = data.entries.items[id];
        const imgId = _.get(fields, isTabletOrMobile && fields.sourceMobile ? 'sourceMobile.sys.id' : 'source.sys.id');
        const clipSvgId = _.get(fields, 'clipSvg.sys.id');
        const assetIds = _.compact([imgId, clipSvgId]);
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
                const imgFields = _.get(items, [imgId, 'fields']);
                const clipSvgFields = _.get(items, [clipSvgId, 'fields']);
                let animation = {};
                if (animationId) {
                  animation = { ...assetData.entries.items[animationId].fields };
                }
                return (
                  <Image
                    {...props}
                    imageSource={imgFields}
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
