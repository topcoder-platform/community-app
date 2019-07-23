/**
 * Shape component.
 */

import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import _ from 'lodash';

import Shape from './Shape';
import defaultTheme from './themes/default.scss';


/* Loads the main shape entry. */
export default function ShapeLoader(props) {
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
        const shapeSvgId = _.get(fields, 'shapeSvg.sys.id');
        const assetIds = _.compact([shapeSvgId]);
        if (assetIds.length !== 0) {
          return (
            <ContentfulLoader
              assetIds={assetIds}
              preview={preview}
              spaceName={spaceName}
              environment={environment}
              render={(assetData) => {
                const { items } = assetData.assets;
                const shapeSvgFields = _.get(items, [shapeSvgId, 'fields']);
                return (
                  <Shape
                    {...props}
                    shapeSvg={shapeSvgFields}
                    shape={fields}
                    theme={defaultTheme}
                  />
                );
              }}
              renderPlaceholder={LoadingIndicator}
            />
          );
        }
        return <Shape {...props} shape={fields} theme={defaultTheme} />;
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

ShapeLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

ShapeLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
