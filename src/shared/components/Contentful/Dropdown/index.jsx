/**
 * Dropdown component.
 */

import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import FAQ from 'components/TrackHomePages/HowToCompetePage/FAQ';
import { fixStyle } from 'utils/contentful';

import defaultTheme from './default.scss';

function DropdownItemsLoader(props) {
  const {
    ids,
    preview,
    spaceName,
    environment,
  } = props;

  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => (
        <FAQ data={{ AQs: _.map(data.entries.items, item => item) }} hashLink="" />
      )}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

DropdownItemsLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

DropdownItemsLoader.propTypes = {
  ids: PT.arrayOf(PT.string).isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};

/* Loads the dropdown entry. */
export default function DropdownLoader(props) {
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
        const { fields } = Object.values(data.entries.items)[0];
        if (!fields) return null;
        return (
          <div
            className={defaultTheme.container}
            style={fixStyle(fields.extraStylesForContainer)}
          >
            <div
              className={defaultTheme.contentWrapper}
              style={fixStyle(fields.extraStylesForContentWrapper)}
            >
              <DropdownItemsLoader
                ids={_.map(fields.items, 'sys.id')}
                preview={preview}
                spaceName={spaceName}
                environment={environment}
              />
            </div>
          </div>
        );
      }}
      renderPlaceholder={LoadingIndicator}
    />
  );
}

DropdownLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

DropdownLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
