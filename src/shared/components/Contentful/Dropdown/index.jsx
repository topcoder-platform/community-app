/**
 * Dropdown component.
 */

import _ from 'lodash';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import PT from 'prop-types';
import React from 'react';
import { fixStyle } from 'utils/contentful';
import DropdownItem from './DropdownItem';

import defaultTheme from './themes/default.scss';
import darkTheme from './themes/dark.scss';

const THEMES = {
  Default: defaultTheme,
  'Dark mode': darkTheme,
};

function DropdownItemsLoader(props) {
  const {
    ids,
    preview,
    spaceName,
    environment,
    baseTheme,
  } = props;

  return (
    <ContentfulLoader
      entryIds={ids}
      preview={preview}
      spaceName={spaceName}
      environment={environment}
      render={data => (
        _.map(data.entries.items, item => (
          <DropdownItem
            data={item}
            preview={preview}
            spaceName={spaceName}
            environment={environment}
            key={item.sys.id}
            baseTheme={baseTheme}
          />
        ))
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
  baseTheme: PT.string.isRequired,
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
        let { theme } = fields;
        theme = theme || 'Default';
        return (
          <div
            className={THEMES[theme].container}
            style={fixStyle(fields.extraStylesForContainer)}
          >
            <div
              className={THEMES[theme].contentWrapper}
              style={fixStyle(fields.extraStylesForContentWrapper)}
            >
              <DropdownItemsLoader
                ids={_.map(fields.items, 'sys.id')}
                preview={preview}
                spaceName={spaceName}
                environment={environment}
                baseTheme={theme}
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
