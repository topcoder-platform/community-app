/*
* Article Component.
*/
import _ from 'lodash';
import React from 'react';
import PT from 'prop-types';
import ContentfulLoader from 'containers/ContentfulLoader';
import LoadingIndicator from 'components/LoadingIndicator';
import Article from './Article';

import defaultTheme from './themes/default.scss';

const THEMES = {
  Default: defaultTheme,
};

/* Loads the main article entry. */
export default function ArticleLoader(props) {
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
        const authorIds = fields.contentAuthor.map(author => author.sys.id);
        const assetIds = fields.featuredImage ? [fields.featuredImage.sys.id] : [];
        const recommendedIds = fields.recommended
          ? fields.recommended.map(author => author.sys.id) : [];
        const theme = THEMES.Default;
        return (
          <ContentfulLoader
            assetIds={assetIds}
            entryIds={_.concat(authorIds, recommendedIds)}
            preview={preview}
            spaceName={spaceName}
            environment={environment}
            render={subData => (
              <Article
                id={id}
                theme={theme}
                fields={fields}
                subData={subData}
                preview={preview}
                spaceName={spaceName}
                environment={environment}
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

ArticleLoader.defaultProps = {
  preview: false,
  spaceName: null,
  environment: null,
};

ArticleLoader.propTypes = {
  id: PT.string.isRequired,
  preview: PT.bool,
  spaceName: PT.string,
  environment: PT.string,
};
